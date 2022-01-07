import Combine
import Foundation
import OpenGoogleSignInSDK

final class DefaultGoogleAuthenticator: NSObject {
    static let shared = DefaultGoogleAuthenticator()

    private let credentialsSubject = PassthroughSubject<GoogleCredentials, Never>()
    private let errorSubject = PassthroughSubject<Error, Never>()

    private override init() {
        super.init()
        client?.clientID = Env.secret(.googleClientId)
        client?.delegate = self
    }

    private var client: OpenGoogleSignIn? {
        .shared
    }
}

extension DefaultGoogleAuthenticator: GoogleAuthenticator {
    var credentials: AnyPublisher<GoogleCredentials, Never> {
        credentialsSubject.eraseToAnyPublisher()
    }

    var error: AnyPublisher<Error, Never> {
        errorSubject.eraseToAnyPublisher()
    }

    func handle(_ url: URL) {
        client?.handle(url)
    }

    func signIn() {
        client?.signIn()
    }
}

extension DefaultGoogleAuthenticator: OpenGoogleSignInDelegate {
    func sign(didSignInFor user: GoogleUser?, withError error: GoogleSignInError?) {
        if let error = error {
            guard !userDidCancel(error) else { return }
            errorSubject.send(error)
        } else if let user = user {
            publishCredentials(for: user)
        }
    }

    private func userDidCancel(_ error: Error) -> Bool {
        guard let error = error as? GoogleSignInError else {
            return false
        }
        return error == .userCancelledSignInFlow
    }

    private func publishCredentials(for user: GoogleUser) {
        credentialsSubject.send(.init(
            accessToken: user.accessToken
        ))
    }
}
