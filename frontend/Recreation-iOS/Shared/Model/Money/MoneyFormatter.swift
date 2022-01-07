import Foundation

struct MoneyFormatter {
    var decimalStyle = DecimalStyle.short
    var currencyStyle = CurrencyStyle.symbol

    enum DecimalStyle {
        case short
        case long
    }

    enum CurrencyStyle {
        case symbol, none
    }

    func string(from money: Money) -> String {
        let cents = money.centAmount

        if cents >= 0 {
            return "\(currency(money))\(decimal(cents))"
        } else {
            return "-\(currency(money))\(decimal(cents).dropFirst())"
        }
    }

    private func currency(_ money: Money) -> String {
        switch currencyStyle {
        case .symbol:
            return money.currency.symbol
        case .none:
            return ""
        }
    }

    private func decimal(_ centAmount: Int) -> String {
        let decimal = decimalNumber(centAmount)

        guard decimalStyle == .short else {
            return longFormat(decimal)
        }

        if shouldDisplayDecimals(decimal) {
            return longFormat(decimal)
        } else {
            return shortFormat(decimal)
        }
    }

    private func decimalNumber(_ centAmount: Int) -> NSDecimalNumber {
        NSDecimalNumber(value: centAmount).dividing(by: 100)
    }

    private func longFormat(_ decimal: NSDecimalNumber) -> String {
        String(format: "%.2f", decimal.doubleValue)
    }

    private func shortFormat(_ decimal: NSDecimalNumber) -> String {
        String(format: "%.0f", decimal.doubleValue)
    }

    private func shouldDisplayDecimals(_ number: NSDecimalNumber) -> Bool {
        number.doubleValue.truncatingRemainder(dividingBy: 1) != 0
    }
}
