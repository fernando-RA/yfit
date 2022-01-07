import Foundation

struct StripeAccountCreationLink: Codable {
    var url: String
}

struct CreateStripeAccount: Request {
    typealias ReturnType = StripeAccountCreationLink

    let method: HTTPMethod = .post
    let path = "payment/create_stripe_account"
}
