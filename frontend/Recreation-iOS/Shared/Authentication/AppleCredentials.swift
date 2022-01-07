import AuthenticationServices

protocol AppleCredentials {
    func authorizationCode() throws -> String
}

struct AppleCredentialsWrapper: AppleCredentials {
    let auth: ASAuthorization

    enum Error: LocalizedError {
        case invalidCredentials
        case authorizationCodeNotFound
        case invalidAuthorizationCode

        var errorDescription: String? {
            var message = "Something unexpected happened: "

            switch self {
            case .invalidCredentials:
                message += "invalid Apple credentials."
            case .authorizationCodeNotFound:
                message += "Apple authorization code not found."
            case .invalidAuthorizationCode:
                message += "Apple authorization code is invalid."
            }

            return message
        }
    }

    func authorizationCode() throws -> String {
        guard let creds = auth.credential as? ASAuthorizationAppleIDCredential else {
            throw Error.invalidCredentials
        }
        guard let code = creds.authorizationCode else {
            throw Error.authorizationCodeNotFound
        }
        guard let code = String(data: code, encoding: .utf8) else {
            throw Error.invalidAuthorizationCode
        }
        return code
    }
}
