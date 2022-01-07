/**
 Decode "null" to empty strings and encode empty strings to "null".
 The API requires non-empty strings for multiple properties.
 We comply to that validation with "null" values.
 */
@propertyWrapper struct NullStringCodable {
    var wrappedValue: String
}

extension NullStringCodable: Codable, Equatable {
    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        let decoded = try container.decode(String.self)

        if decoded == .null {
            wrappedValue = ""
        } else {
            wrappedValue = decoded
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()

        if wrappedValue.isEmpty {
            try container.encode(.null)
        } else {
            try container.encode(wrappedValue)
        }
    }
}
