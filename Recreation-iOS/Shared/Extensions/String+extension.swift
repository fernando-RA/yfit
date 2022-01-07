import Foundation

extension String: Identifiable {
    static let null = "null"

    public var id: String {
        self
    }

    var isNull: Bool {
        self == .null
    }

    var isValidEmail: Bool {
        let format = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let predicate = NSPredicate(format: "SELF MATCHES %@", format)
        return predicate.evaluate(with: self)
    }

    var isFilled: Bool {
        !isEmpty
    }

    var money: Money? {
        integer?.cents
    }

    var integer: Int? {
        var cleanedUp = replacingOccurrences(of: ".", with: "")
            .replacingOccurrences(of: ",", with: "")

        Currency.allCases.forEach { currency in
            cleanedUp = cleanedUp.replacingOccurrences(of: currency.symbol, with: "")
        }

        return Int(cleanedUp)
    }
}

extension String: LocalizedError {
    public var errorDescription: String? {
        self
    }
}

extension Optional where Wrapped == String {
    var isFilled: Bool {
        map(\.isFilled) ?? false
    }
}
