#if DEBUG

import Stripe
import Combine

struct InMemoryPaymentProvider: PaymentProvider {
    let paymentSheet: AnyPublisher<PaymentSheet?, Never>

    init(paymentSheet: PaymentSheet? = nil) {
        self.paymentSheet = Just(paymentSheet).eraseToAnyPublisher()
    }

    func createPaymentSheet(from session: PaymentSession) {}
    func handle(result: PaymentSheetResult) {}
}

#endif
