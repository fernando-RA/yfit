import Foundation
import Combine

final class EditProfileViewModel: ObservableObject {
    @Published var state = EditProfileState()

    private let auth: AuthSessionManager
    private let client: APIClient
    private let completionHandler: () -> Void
    private var cancellables = Set<AnyCancellable>()

    init(auth: AuthSessionManager, client: APIClient, completionHandler: @escaping () -> Void) {
        self.auth = auth
        self.client = client
        self.completionHandler = completionHandler
        prefillForm()
    }

    func send(_ action: EditProfileAction) {
        switch action {
        case .getUserAcct:
            getCurrentUser()
        case .getStripeAccount:
            getStripeAcct()
        case .connectStripeAccount:
            createStripeLink()
        case .deleteStripeAccount:
            deleteStripeAcct(showActivity: false)
        case .userDeletsStripeAccount:
            deleteStripeAcct(showActivity: true)
        case .changeAcctType:
            changeUserAccountType()
        case .save:
            saveAndQuit()
        case .handleStripeFormUrl(let url):
            handle(stripeFormURL: url)
        case .editWorkouts:
            fetchPossibleWorkouts()
            state.isEditingWorkouts = true
        case .toggleWorkoutSelection(let workout):
            if state.selectedWorkouts.contains(workout) {
                state.selectedWorkouts.removeAll { $0 == workout }
            } else {
                state.selectedWorkouts.append(workout)
            }
        }
    }

    private func prefillForm() {
        guard let user = auth.signedInUser else { return }
        state.accessToken = client.accessToken
        state.user = user
    }

    private func createStripeLink() {
        state.isLoadingStripe = true
        state.showProfile = true
        self.send(.deleteStripeAccount)
        state.userType = .trainer
        client
            .dispatch(CreateStripeAccount())
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                self?.state.isLoadingStripe = false
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [weak self] link in
                self?.state.stripeLink = URL(string: link.url)
            }
            .store(in: &cancellables)
    }

    private func getStripeAcct() {
        state.isLoadingStripe = true

        client
            .dispatch(GetStripeAcct())
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                self?.state.isLoadingStripe = false
            } receiveValue: { [weak self] acct in
                guard acct.payoutsEnabled == true else {
                    self?.send(.deleteStripeAccount)
                    return
                }
                self?.state.stripePaymentsEnabled = true
                print("payments are enabled")
            }
            .store(in: &cancellables)
    }

    private func deleteStripeAcct(showActivity: Bool) {
        if showActivity {
        state.isLoadingStripe = true
        }
        client
            .dispatch(DeleteStripeAcct())
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                self?.state.stripeIsConnected = false
                if showActivity {
                    self?.state.isLoadingStripe = false
                    self?.state.userType = .client
                    self?.send(.changeAcctType)
                }
            } receiveValue: { _ in
                self.state.stripePaymentsEnabled = false
                if showActivity {
                    self.send(.changeAcctType)
                }
            }
            .store(in: &cancellables)
    }

    private func getCurrentUser() {
        state.isLoadingStripe = true
        client
            .dispatch(GetCurrentUser())
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                self?.state.stripeIsConnected = false
            } receiveValue: { user in
                self.state.stripeAccountId = user.stripeAccountId ?? ""
            }
            .store(in: &cancellables)
    }

    private func fetchPossibleWorkouts() {
        guard state.possibleWorkouts.isEmpty else { return }

        client
            .dispatch(GetWorkoutTypes())
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [weak self] workouts in
                self?.state.possibleWorkouts = workouts
            }
            .store(in: &cancellables)
    }

    private func handle(stripeFormURL: URL) {
        let url = stripeFormURL.absoluteString

        if url.contains("user_failed") {
            state.stripeLink = nil
        } else if url.contains("user_created") {
            state.stripeLink = nil
            state.stripeIsConnected = true
        }
    }

    private func saveAndQuit() {
        state.isUpdatingUser = true

        let updater = TrainerProfileUpdater(state: state, auth: auth, client: client)

        updater
            .save()
            .sink { [weak self] completion in
                self?.state.isUpdatingUser = false
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [weak self] in
                self?.completionHandler()
            }
            .store(in: &cancellables)
    }

    private func changeUserAccountType() {
        let updater = TrainerProfileUpdater(state: state, auth: auth, client: client)

        updater
            .save()
            .sink {_ in } receiveValue: { [weak self] in
                self?.completionHandler()
            }
            .store(in: &cancellables)
    }
}
