import Foundation

struct CreateClass: Request {
    typealias ReturnType = TrainerClass

    let path = "trainer-class"
    let method: HTTPMethod = .post
    let `class`: TrainerClass

    var bodyData: Data? {
        try? JSON.encoder.encode(`class`)
    }
}
