import Foundation

struct TrainerClassPage: Codable {
    let results: [TrainerClass]
}

struct FetchTrainerClassPage: Request {
    typealias ReturnType = TrainerClassPage
    let path = "trainer-class"
    var method: HTTPMethod = .get
}
