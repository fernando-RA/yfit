import SwiftUI

struct AuthSessionManagerEnvironmentKey: EnvironmentKey {
    static let defaultValue = AuthSessionManager(
        client: DefaultAPIClient.shared,
        google: DefaultGoogleAuthenticator.shared
    )
}

extension EnvironmentValues {
    var authManager: AuthSessionManager {
        get {
            self[AuthSessionManagerEnvironmentKey.self]
        }
        set {
            self[AuthSessionManagerEnvironmentKey.self] = newValue
        }
    }
}
