import Stripe

enum PaymentResult: Equatable {
    case completed, failed(EquatableError), canceled
}

extension PaymentResult {
    init(from sheetResult: Stripe.PaymentSheetResult) {
        switch sheetResult {
        case .canceled:
            self = .canceled
        case .completed:
            self = .completed
        case .failed(let error):
            self = .failed(error.equatable)
        }
    }
}
