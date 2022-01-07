import Foundation

struct Money: Equatable {
    let centAmount: Int
    let currency: Currency

    func formatted(_ style: MoneyFormatter.DecimalStyle = .short) -> String {
        var formatter = MoneyFormatter()
        formatter.decimalStyle = style
        return formatter.string(from: self)
    }

    var isFree: Bool {
        centAmount == 0
    }

    static func * (left: Money, right: Int) -> Money {
        Money(centAmount: left.centAmount * right, currency: left.currency)
    }
}

extension Int {
    var cents: Money {
        Money(centAmount: self, currency: .usd)
    }
}

extension Money: Codable {
    enum Error: LocalizedError {
        case decodeCentAmount(faultyAmount: String)

        var errorDescription: String? {
            switch self {
            case .decodeCentAmount(let faultyAmount):
                return "Could not decode \(faultyAmount) to cent amount of type Int."
            }
        }
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        currency = .usd
        let centAmountString = (try container.decode(String.self)).replacingOccurrences(of: ".", with: "")
        if let centAmount = Int(centAmountString) {
            self.centAmount = centAmount
        } else {
            throw Error.decodeCentAmount(faultyAmount: centAmountString)
        }
    }

    func encode(to encoder: Encoder) throws {
        var formatter = MoneyFormatter()
        formatter.decimalStyle = .long
        formatter.currencyStyle = .none
        let moneyString = formatter.string(from: self)

        var container = encoder.singleValueContainer()
        try container.encode(moneyString)
    }
}
