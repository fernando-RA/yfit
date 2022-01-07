@testable import Recreation_iOS

extension JSON {
    static func decode<A: Decodable>(_ fixture: Fixture) -> A {
        decode(fixture.json)
    }

    static func decode<A: Decodable>(_ json: String) -> A {
        let data = json.data(using: .utf8)!

        return try! JSON.decoder.decode(A.self, from: data)
    }
}
