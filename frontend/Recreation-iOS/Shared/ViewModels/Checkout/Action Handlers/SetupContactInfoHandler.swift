struct SetupContactInfoHandler {
    let auth: AuthSessionManager

    func updateState(_ state: inout CheckoutState) {
        guard case .signedIn(let user) = auth.session else { return }
        guard state.contactInfo.isEmpty else { return }
        state.contactInfo = user.contactInfo
    }
}
