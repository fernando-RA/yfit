import Combine

final class UserMenuViewModel: ObservableObject {
    @Published var state = UserMenuState()

    private let auth: AuthSessionManager
    private var cancellables = Set<AnyCancellable>()

    init(auth: AuthSessionManager) {
        self.auth = auth
        subscribeToAuthSession()
    }

    func handleSelection(_ option: UserMenuOption) {
        switch option {
        case .signIn, .signOut:
            try? KeychainInterface.deletePassword(service: "authToken")
            auth.logout()

        case .createClass:
            if isTrainer {
                state.destination = .createClass
            } else {
                state.isShowingRequiredProfile = true
            }

        default:
            state.destination = option
        }
    }

    private func subscribeToAuthSession() {
        state.user = auth.signedInUser

        auth.$session
            .sink { [weak self] session in
                self?.state.user = session.user
            }
            .store(in: &cancellables)
    }

    private var isTrainer: Bool {
        auth.signedInUser?.userType == .trainer
    }
}
