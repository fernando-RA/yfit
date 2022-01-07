import Combine
import Foundation

protocol GoogleAuthenticator {
    var credentials: AnyPublisher<GoogleCredentials, Never> { get }
    var error: AnyPublisher<Error, Never> { get }

    func handle(_ url: URL)
    func signIn()
}
