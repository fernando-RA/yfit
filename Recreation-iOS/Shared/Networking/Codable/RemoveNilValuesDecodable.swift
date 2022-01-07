@propertyWrapper struct RemoveNilValuesDecodable<Base: Codable & Equatable> {
    var wrappedValue: [Base]
}

extension RemoveNilValuesDecodable: Codable, Equatable {
    init(from decoder: Decoder) throws {
        self.wrappedValue = try decoder
            .singleValueContainer()
            .decode([FailableDecodable<Base>].self)
            .compactMap { $0.wrappedValue }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(wrappedValue)
    }
}
