#if DEBUG

import Combine
import Foundation

final class InMemoryGoogleAuthenticator: GoogleAuthenticator {
    var isSignedIn = false

    let credentialsPublisher = PassthroughSubject<GoogleCredentials, Never>()
    let errorPublisher = PassthroughSubject<Error, Never>()

    var credentials: AnyPublisher<GoogleCredentials, Never> {
        credentialsPublisher.eraseToAnyPublisher()
    }

    var error: AnyPublisher<Error, Never> {
        errorPublisher.eraseToAnyPublisher()
    }

    func handle(_ url: URL) {}

    func signIn() {
        isSignedIn = true
    }
}

#endif
