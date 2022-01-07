import Foundation

struct UpdateStripeCustomer: Request {
    typealias ReturnType = User

    let user: User
    let method: HTTPMethod = .put

    var path: String {
        "profile/\(user.id)"
    }

    var body: [String: Any]? {
        [
            "stripe_customer_id": user.stripeCustomerId ?? ""
        ]
    }
}
