import Foundation

struct Login: Codable {
    let token: String
}

struct CreateAppleLogin: Request {
    typealias ReturnType = Login

    let path = "login/apple"
    let method: HTTPMethod = .post
    let code: String

    var body: [String: Any]? {
        [
            "access_token": code
        ]
    }
}

struct CreateGoogleLogin: Request {
    typealias ReturnType = Login

    let path = "login/google"
    let method: HTTPMethod = .post
    let credentials: GoogleCredentials

    var bodyData: Data? {
        try? JSON.encoder.encode(credentials)
    }
}
