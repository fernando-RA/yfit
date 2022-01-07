import Foundation
import Combine
import SwiftUI

final class CheckoutViewModel: ObservableObject {
    @Published var state: CheckoutState

    private let dependencies: CheckoutDependencies
    private var cancellables = Set<AnyCancellable>()

    var paymentProvider: PaymentProvider {
        dependencies.paymentProvider
    }

    init(
        trainerClass: TrainerClass,
        dependencies: CheckoutDependencies
    ) {
        self.state = .init(trainerClass: trainerClass)
        self.dependencies = dependencies
        prefillContactInfo()
    }

    func send(_ action: CheckoutAction) {
        switch action {
        case .setup:
            createPaymentSession()
            send(.checkAvailabilities)

        case .editContactInfo:
            state.showContactInfoForm = true

        case .signupForClass:
            signupForClass()

        case .save(let contactInfo, let saveContactInfo):
            save(contactInfo, saveContactInfo: saveContactInfo)
            send(.checkAvailabilities)

        case .handlePayment(let result):
            handle(result)

        case .checkAvailabilities:
            checkAvailabilities()
        }
    }

    private func createPaymentSession() {
        CreatePaymentSessionHandler(
            state: stateBinding,
            cancellables: cancellablesBinding,
            dependencies: dependencies
        )
        .updateState()
    }

    private func prefillContactInfo() {
        SetupContactInfoHandler(auth: dependencies.auth).updateState(&state)
    }

    private func signupForClass() {
        SignupForClassHandler(
            state: stateBinding,
            cancellables: cancellablesBinding,
            dependencies: dependencies
        )
        .updateState()
    }

    private func save(_ contactInfo: ContactInfo, saveContactInfo: Bool) {
        EditContactInfoHandler(
            state: stateBinding,
            cancellables: cancellablesBinding,
            auth: dependencies.auth,
            client: dependencies.client
        )
        .updateState(contactInfo: contactInfo, saveContactInfo: saveContactInfo)
    }

    private func handle(_ paymentResult: PaymentResult) {
        switch paymentResult {
        case .completed:
            send(.signupForClass)
        case .failed(let equatableError):
            state.error = equatableError.identifiable
        case .canceled:
            break
        }
    }

    private func checkAvailabilities() {
        AvailabilitiesCheck(client: dependencies.client)
            .perform(state)
            .sink { [weak self] completion in
                self?.handleError(completion)
            } receiveValue: { [weak self] status in
                self?.state.availabilitiesStatus = status
            }
            .store(in: &cancellables)
    }

    private func handleError(_ completion: Subscribers.Completion<Error>) {
        guard case .failure(let error) = completion else { return }
        state.error = error.identifiable
    }

    private var stateBinding: Binding<CheckoutState> {
        Binding { [unowned self] in
            self.state
        } set: { [weak self] in
            self?.state = $0
        }
    }

    private var cancellablesBinding: Binding<Set<AnyCancellable>> {
        Binding { [weak self] in
            self?.cancellables ?? .init()
        } set: { [weak self] in
            self?.cancellables = $0
        }
    }
}
