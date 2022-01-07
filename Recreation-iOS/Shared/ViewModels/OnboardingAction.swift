enum OnboardingAction {
    case close
    case updateUser(OnboardingNameState)
    case handleAuthorization(User)
}
