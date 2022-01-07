import Foundation

struct PaymentSession: Codable, Equatable {
    let clientSecret: String
    let ephemeralKey: String
    let customerId: String
    let paymentIntentId: String
}

struct CreatePaymentSession: Request {
    typealias ReturnType = PaymentSession

    let amount: Money
    let trainerClass: TrainerClass
    let client: User?

    let method: HTTPMethod = .post
    let path = "payment/payment_intent"

    var body: [String: Any]? {
        var params = baseParams

        if let id = trainer.stripeAccountId {
            params["trainer_stripe_customer_id"] = id
        }

        if let id = client?.stripeCustomerId {
            params["stripe_customer_id"] = id
        }

        return params
    }

    private var baseParams: [String: Any] {
        [
            "amount_cents": amount.centAmount
        ]
    }

    private var trainer: User {
        trainerClass.author
    }
}

#if DEBUG

extension PaymentSession {
    static func create(clientSecret: String = "<client_secret>",
                       ephemeralKey: String = "<client_ephemeral_key>",
                       customerId: String = "<client_customer_id>",
                       paymentIntentId: String = "<payment_intent_id>") -> Self {
        Self(
            clientSecret: clientSecret,
            ephemeralKey: ephemeralKey,
            customerId: customerId,
            paymentIntentId: paymentIntentId
        )
    }
}

#endif
