import Foundation

struct User: Codable, Identifiable, Equatable {
    let id: Int
    @NullStringCodable var firstName: String
    @NullStringCodable var lastName: String
    var email: String
    let phoneNumber: String?
    @NullStringCodable var bio: String
    var profilePicture: String?
    var stripeCustomerId: String?
    var stripeAccountId: String?
    @SkipEncoding var workoutTypes: [WorkoutType]
    var userType: UserType
    var instagramLink: String?
    var trainerLink: String?
    var verifiedTrainer: Bool?

    enum UserType: String, Codable {
        case trainer, client
    }

    var fullName: String {
        "\(firstName) \(lastName)"
    }

    var initials: String {
        [firstName, lastName]
            .map { $0.prefix(1) }
            .joined()
    }

    var profilePictureURL: URL? {
        profilePicture.flatMap { url in
            URL(string: url)
        }
    }

    var hasName: Bool {
        [firstName, lastName].allSatisfy { !$0.isEmpty }
    }

    var isTrainer: Bool {
        userType == .trainer
    }

    var contactInfo: ContactInfo {
        .init(email: email, firstName: firstName, lastName: lastName)
    }

    var formattedWorkoutTypes: String {
        workoutTypes.map(\.workoutType).joined(separator: ", ")
    }

    mutating func update(with session: PaymentSession) {
        stripeCustomerId = session.customerId
    }

    mutating func update(with form: OnboardingNameState) {
        firstName = form.firstName
        lastName = form.lastName
        userType = .client
    }

    mutating func update(with contactInfo: ContactInfo) {
        firstName = contactInfo.firstName
        lastName = contactInfo.lastName
        email = contactInfo.email
    }
}

#if DEBUG

extension User {
    static func create(id: Int = 1,
                       firstName: String = "<first_name>",
                       lastName: String = "<last_name>",
                       email: String = "<email>",
                       phoneNumber: String? = nil,
                       bio: String = "<bio>",
                       profilePicture: String? = nil,
                       stripeCustomerId: String? = nil,
                       stripeAccountId: String? = nil,
                       workoutTypes: [WorkoutType] = [],
                       userType: UserType = .trainer,
                       instagramLink: String? = nil) -> Self {
        Self(
            id: id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            bio: bio,
            profilePicture: profilePicture,
            stripeCustomerId: stripeCustomerId,
            stripeAccountId: stripeAccountId,
            workoutTypes: workoutTypes,
            userType: userType,
            instagramLink: instagramLink
        )
    }
}

#endif
