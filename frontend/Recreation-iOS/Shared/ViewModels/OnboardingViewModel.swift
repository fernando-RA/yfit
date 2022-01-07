import Combine
import Foundation
import AuthenticationServices
import OSLog

final class OnboardingViewModel: NSObject, ObservableObject {
    @Published var state = OnboardingState()

    private let client: APIClient
    private let authManager: AuthSessionManager
    private var cancellables = Set<AnyCancellable>()

    init(client: APIClient, authManager: AuthSessionManager, googleAuthenticator: GoogleAuthenticator) {
        self.client = client
        self.authManager = authManager
        super.init()
        presentOnboardingOnLogout()
        callLoggedInUser()
        listen(to: googleAuthenticator)
    }

    func send(_ action: OnboardingAction) {
        switch action {
        case .close:
            state.isShowingApplication = true

        case .handleAuthorization(let user):
            if user.hasName {
                self.state.isShowingApplication = true
            } else {
                self.state.isShowingNameInputForm = true
            }

        case .updateUser(let form):
            authManager
                .updateSignedInUser { user in
                    user.update(with: form)
                }
                .sink { [weak self] completion in
                    guard case .failure(let error) = completion else { return }
                    self?.state.error = error.identifiable
                } receiveValue: { [weak self] _ in
                    self?.send(.close)
                }
                .store(in: &cancellables)
        }
    }

    private func presentOnboardingOnLogout() {
        authManager.$session
            .sink { [weak self] session in
                guard case .guess = session, self?.state.isShowingApplication == true else { return }
                self?.state = .init()
            }
            .store(in: &cancellables)
    }

    private func listen(to authenticator: GoogleAuthenticator) {
        authenticator.credentials
            .flatMap { [weak self] credentials in
                self?.authManager.loginWithGoogle(with: credentials) ?? .none
            }
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [weak self] user in
                self?.send(.handleAuthorization(user))
            }
            .store(in: &cancellables)

        authenticator.error.map(\.identifiable)
            .sink { [weak self] error in
                self?.state.error = error
            }
            .store(in: &cancellables)
    }

    func callLoggedInUser() {
        guard (try? KeychainInterface.readToken(service: "authToken")) != nil else {
            return
        }
        authManager
            .fetchLoggedInUser()
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [weak self] _ in
                self?.send(.close)
            }
            .store(in: &cancellables)
    }
}

extension OnboardingViewModel: ASAuthorizationControllerDelegate {
    func authorizationController(
        controller: ASAuthorizationController,
        didCompleteWithAuthorization authorization: ASAuthorization
    ) {
        let credentials = AppleCredentialsWrapper(auth: authorization)

        authManager
            .loginWithApple(with: credentials)
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [weak self] _ in
                self?.send(.close)
            }
            .store(in: &cancellables)
    }

    func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
        let logger = Logger()
        let msg = "\(ASAuthorizationControllerDelegate.self) - \(#function) -- \(error.localizedDescription)"
        logger.error("\(msg)")
    }
}
