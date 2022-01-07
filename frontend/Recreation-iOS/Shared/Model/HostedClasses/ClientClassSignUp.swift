import Foundation

struct ClientClassSignUp: Codable, Equatable, Identifiable {
    let id: Int
    let spots: [Spot]
    let paymentIntentId: String?
    let trainerClass: Int
    let spotsCount: Int
    let firstName: String
    let lastName: String
    var firstNameReferred: String?
    var lastNameReferred: String?
    let emailAddress: String
    var phoneNumber: String?
    var promoCode: String?
    let subscribeToEmails: Bool
    let agreeToSafetyWaver: Bool
    var paymentMethod: String?
    var paymentstatus: String?
    var user: Int?
    var isHere: Bool?
}

struct Spot: Codable, Equatable, Hashable {
    let id: Int
    var firstName: String
    var lastName: String
    var emailAddress: String
    var didAttend: Bool?
}

#if DEBUG

extension ClientClassSignUp {
    static func create(spots: [Spot] = []) -> Self {
        Self(
            id: 0,
            spots: spots,
            paymentIntentId: nil,
            trainerClass: 0,
            spotsCount: 0,
            firstName: "",
            lastName: "",
            firstNameReferred: nil,
            lastNameReferred: nil,
            emailAddress: "",
            phoneNumber: nil,
            promoCode: nil,
            subscribeToEmails: true,
            agreeToSafetyWaver: true,
            paymentMethod: nil,
            paymentstatus: nil,
            user: nil
        )
    }
}

#endif
