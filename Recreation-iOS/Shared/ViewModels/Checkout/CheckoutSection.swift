import Foundation

enum CheckoutSection: Identifiable, Equatable {
    case classInfo(TrainerClass)
    case contactInfo
    case cancellationPolicy
    case waiver
    case totals
    case placeOrder

    var id: String {
        title
    }

    var title: String {
        switch self {
        case .classInfo(let trainerClass):
            return trainerClass.name
        case .contactInfo:
            return "Contact info"
        case .cancellationPolicy:
            return "Cancellation policy"
        case .waiver:
            return "Waiver"
        case .totals:
            return "Payment"
        case .placeOrder:
            return "Place Order"
        }
    }

    var titleIsVisible: Bool {
        switch self {
        case .totals, .placeOrder:
            return false
        default:
            return true
        }
    }

    var accessoryAction: CheckoutAction? {
        switch self {
        case .contactInfo:
            return .editContactInfo
        default:
            return nil
        }
    }
}
