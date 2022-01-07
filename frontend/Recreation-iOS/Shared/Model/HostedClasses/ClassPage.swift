import Foundation

struct ClassPage: Codable {
    let limit: Int?
    let count: Int?
    let offset: Int?
    let results: [TrainerClass]
}
