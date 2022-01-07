import Foundation

struct JSON {
    static let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.keyEncodingStrategy = .convertToSnakeCase
        encoder.dateEncodingStrategy = .custom(encodeDate)
        return encoder
    }()

    static let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        decoder.dateDecodingStrategy = .custom(decodeDate)
        return decoder
    }()

    private static func encodeDate(date: Date, encoder: Encoder) throws {
        let formatter = DateFormatter()
        formatter.dateFormat = dateFormats[0]
        var container = encoder.singleValueContainer()
        try container.encode(date.iso8601withFractionalSeconds)
    }

    private static func decodeDate(decoder: Decoder) throws -> Date {
        let container = try decoder.singleValueContainer()
        let dateString = try container.decode(String.self)
        return try parseDateString(dateString)
    }

    private static func parseDateString(_ dateString: String) throws -> Date {
        var date: Date?

        for format in dateFormats {
            if date != nil { break }
            let formatter = DateFormatter()
            formatter.dateFormat = format
            date = formatter.date(from: dateString)?.to(timeZone: TimeZone.current, from: TimeZone(abbreviation: "UTC")!)
        }

        if let date = date {
            return date
        } else {
            throw Error.wrongDateFormat(dateString)
        }
    }

    private static let dateFormats = [
        "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'",
        "yyyy-MM-dd'T'HH:mm:ssZ"
    ]

    private enum Error: Swift.Error {
        case wrongDateFormat(String)
    }
}
