import Foundation

struct UpdateContactInformation: Request {
    typealias ReturnType = User

    let user: User
    let method: HTTPMethod = .put

    var path: String {
        "profile/\(user.id)"
    }

    var bodyData: Data? {
        try? JSON.encoder.encode(user.contactInfo)
    }
}
