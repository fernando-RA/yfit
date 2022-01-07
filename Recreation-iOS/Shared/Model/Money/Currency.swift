import Foundation

enum Currency: Equatable, CaseIterable {
    case usd

    var symbol: String {
        switch self {
        case .usd:
            return "$"
        }
    }
}
