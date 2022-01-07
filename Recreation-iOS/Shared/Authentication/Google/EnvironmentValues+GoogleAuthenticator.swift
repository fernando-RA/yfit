import SwiftUI

struct GoogleAuthenticatorEnvironmentKey: EnvironmentKey {
    static let defaultValue: GoogleAuthenticator = DefaultGoogleAuthenticator.shared
}

extension EnvironmentValues {
    var googleAuthenticator: GoogleAuthenticator {
        get {
            self[GoogleAuthenticatorEnvironmentKey.self]
        }
        set {
            self[GoogleAuthenticatorEnvironmentKey.self] = newValue
        }
    }
}
