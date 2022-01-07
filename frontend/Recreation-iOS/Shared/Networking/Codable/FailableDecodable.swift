/**
 Use this property wrapper for optional decodables that can be represented with empty string and other weird json value.
 */
@propertyWrapper struct FailableDecodable<Base: Codable & Equatable> {
    var wrappedValue: Base?

    init(wrappedValue: Base?) {
        self.wrappedValue = wrappedValue
    }
}

extension FailableDecodable: Codable, Equatable {
    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        self.wrappedValue = try? container.decode(Base.self)
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try? container.encode(wrappedValue)
    }

    static func == (lhs: FailableDecodable<Base>, rhs: FailableDecodable<Base>) -> Bool {
        lhs.wrappedValue == rhs.wrappedValue
    }
}
