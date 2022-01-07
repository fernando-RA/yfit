import Combine
import Stripe

protocol PaymentProvider {
    var paymentSheet: AnyPublisher<Stripe.PaymentSheet?, Never> { get }
    func createPaymentSheet(from session: PaymentSession)
}
