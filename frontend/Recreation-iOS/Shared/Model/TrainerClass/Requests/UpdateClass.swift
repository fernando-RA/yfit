import Foundation

struct UpdateClass: Request {
    typealias ReturnType = TrainerClass

    let method: HTTPMethod = .put
    let `class`: TrainerClass

    var path: String {
        "trainer-class/\(`class`.id)"
    }

    var bodyData: Data? {
        try? JSON.encoder.encode(`class`)
    }
}
