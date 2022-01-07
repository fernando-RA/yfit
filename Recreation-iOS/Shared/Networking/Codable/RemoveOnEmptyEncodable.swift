/**
 By using this property wrapper the encoder will ignore the array if it's empty.
 The API throws errors when it receives empty arrays in some cases.
 */
@propertyWrapper struct RemoveOnEmptyEncodable<Base: Codable & Equatable> {
    var wrappedValue: [Base]
}

extension RemoveOnEmptyEncodable: Codable, Equatable {
    init(from decoder: Decoder) throws {
        self.wrappedValue = try decoder
            .singleValueContainer()
            .decode([Base].self)
    }
}

extension KeyedEncodingContainer {
    mutating func encode<T>(_ value: RemoveOnEmptyEncodable<T>, forKey key: K) throws {
        guard !value.wrappedValue.isEmpty else { return }
        try encode(value.wrappedValue, forKey: key)
    }
}
