import Foundation
import AuthenticationServices
import Combine

final class AuthSessionManager: ObservableObject {
    @Published var session: AuthSession = .guess

    private let client: APIClient
    private let google: GoogleAuthenticator
    private var cancellables = Set<AnyCancellable>()

    init(client: APIClient, google: GoogleAuthenticator) {
        self.client = client
        self.google = google
    }

    var signedInUser: User? {
        session.user
    }

    func logout() {
        session = .guess
    }

    func updateSignedInUser(_ update: @escaping (inout User) -> Void) -> AnyPublisher<User, Error> {
        updateUserRequest(update)
            .receive(on: DispatchQueue.main)
            .handleEvents(receiveOutput: { [weak self] user in
                self?.session = .signedIn(user)
            })
            .eraseToAnyPublisher()
    }

    func loginWithApple(with credentials: AppleCredentials) -> AnyPublisher<User, Error> {
        .wrap(credentials.authorizationCode)
            .flatMap { [weak self] code in
                self?.createAppleLogin(code: code) ?? .none
            }
            .flatMap { [weak self] login in
                self?.fetchCreatedUser(login) ?? .none
            }
            .mapError { $0 as Error }
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }

    func loginWithGoogle(with credentials: GoogleCredentials) -> AnyPublisher<User, Error> {
        createGoogleLogin(credentials)
            .flatMap { [weak self] login in
                self?.fetchCreatedUser(login) ?? .none
            }
            .mapError { $0 as Error }
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }

    private func updateUserRequest(_ update: @escaping (inout User) -> Void) -> AnyPublisher<User, Error> {
        guard let currentUser = signedInUser else {
            return .none
        }

        var copy = currentUser
        update(&copy)
        let hasChangeToSave = copy != currentUser

        guard hasChangeToSave else {
            return .just(currentUser)
        }

        return client
            .dispatch(UpdateUser(user: copy))
            .mapError { $0 as Error }
            .eraseToAnyPublisher()
    }

    private func createAppleLogin(code: String) -> AnyPublisher<Login, Error> {
        client
            .dispatch(CreateAppleLogin(code: code))
            .mapError { $0 as Error }
            .eraseToAnyPublisher()
    }

    private func createGoogleLogin(_ creds: GoogleCredentials) -> AnyPublisher<Login, Error> {
        client
            .dispatch(CreateGoogleLogin(credentials: creds))
            .mapError { $0 as Error }
            .eraseToAnyPublisher()
    }

    func fetchCreatedUser(_ login: Login) -> AnyPublisher<User, Error> {
        guard let token = login.token.data(using: .utf8) else {
            return client
                .dispatch(GetCurrentUser())
                .handleEvents(receiveOutput: { [weak self] user in
                    self?.session = .signedIn(user)
            })
                .mapError { $0 as Error }
                .eraseToAnyPublisher()
        }
        do {
            try KeychainInterface.save(token: token, service: "authToken")
            print("added")
        } catch {
           try? KeychainInterface.update(token: token, service: "authToken")
        }
        client.assign(accessToken: login.token)
        return client
            .dispatch(GetCurrentUser())
            .handleEvents(receiveOutput: { [weak self] user in
                self?.session = .signedIn(user)
        })
            .mapError { $0 as Error }
            .eraseToAnyPublisher()
    }

    func fetchLoggedInUser() -> AnyPublisher<User, Error> {
        guard let encodedToken = try? KeychainInterface.readToken(service: "authToken") else {
            preconditionFailure("only these errors are expected")
        }
        guard let token = String(data: encodedToken, encoding: .utf8) else {
            preconditionFailure("only these errors are expected")
        }
        client.assign(accessToken: token)
        return client
            .dispatch(GetCurrentUser())
            .receive(on: DispatchQueue.main)
            .handleEvents(receiveOutput: { [weak self] user in
                self?.session = .signedIn(user)
        })
            .mapError { $0 as Error }

            .eraseToAnyPublisher()
    }

    private enum AuthError: LocalizedError {
        case unauthenticated

        var errorDescription: String? {
            switch self {
            case .unauthenticated:
                return "User is not authenticated. Please login."
            }
        }
    }
}

#if DEBUG

extension AuthSessionManager {
    static func create(client: APIClient = InMemoryAPIClient(),
                       google: GoogleAuthenticator = InMemoryGoogleAuthenticator()) -> Self {
        Self(client: client, google: google)
    }
}

#endif
