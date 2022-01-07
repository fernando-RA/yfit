struct OnboardingNameState {
    var firstName = ""
    var lastName = ""

    var isFilled: Bool {
        [firstName, lastName].allSatisfy { name in
            !(name.isNull || name.isEmpty)
        }
    }
}
