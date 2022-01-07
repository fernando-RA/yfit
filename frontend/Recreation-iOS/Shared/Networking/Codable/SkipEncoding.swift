@propertyWrapper struct SkipEncoding<Base: Codable & Equatable> {
   var wrappedValue: Base
}

extension SkipEncoding: Codable, Equatable {
    init(from decoder: Decoder) throws {
        self.wrappedValue = try decoder
            .singleValueContainer()
            .decode(Base.self)
    }

    func encode(to encoder: Encoder) throws {}
}

extension KeyedEncodingContainer {
   mutating func encode<T>(_ value: SkipEncoding<T>, forKey key: K) throws {}
}
