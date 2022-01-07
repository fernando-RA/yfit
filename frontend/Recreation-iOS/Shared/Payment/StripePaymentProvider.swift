import Foundation
import Combine
import Stripe

final class StripePaymentProvider: PaymentProvider, ObservableObject {
    private let paymentSheetSubject = CurrentValueSubject<PaymentSheet?, Never>(nil)

    var paymentSheet: AnyPublisher<PaymentSheet?, Never> {
        paymentSheetSubject.eraseToAnyPublisher()
    }

    func createPaymentSheet(from session: PaymentSession) {
        configureStripeClient()
        let config = configuration(for: session)
        createPaymentSheet(with: config, intentSecret: session.clientSecret)
    }

    private func configureStripeClient() {
        let client = STPAPIClient.shared
        guard client.publishableKey == nil else { return }
        client.publishableKey = Env.secret(.stripePublishableKey)
    }

    private func configuration(for session: PaymentSession) -> PaymentSheet.Configuration {
        var configuration = PaymentSheet.Configuration()
        configuration.merchantDisplayName = "Undercard Technologies, Inc."

        configuration.applePay = .init(
            merchantId: Env.secret(.applePayMerchantId),
            merchantCountryCode: "US"
        )

        configuration.customer = .init(
            id: session.customerId,
            ephemeralKeySecret: session.ephemeralKey
        )

        return configuration
    }

    private func createPaymentSheet(with configuration: PaymentSheet.Configuration, intentSecret: String) {
        DispatchQueue.main.async {
            let sheet = PaymentSheet(
                paymentIntentClientSecret: intentSecret,
                configuration: configuration
            )

            self.paymentSheetSubject.send(sheet)
        }
    }
}
