struct OnboardingState {
    var isShowingApplication = false
    var isShowingNameInputForm = false
    var nameForm = OnboardingNameState()
    var error: IdentifiableError?
}
