struct ContactInfo: Codable, Equatable {
    var email = ""
    var firstName = ""
    var lastName = ""
    var phoneNumber = ""

    var isFilled: Bool {
        email.isValidEmail
            && !firstName.isEmpty
            && !lastName.isEmpty
    }

    var isEmpty: Bool {
        [firstName, lastName, email].allSatisfy(\.isEmpty)
    }
}
