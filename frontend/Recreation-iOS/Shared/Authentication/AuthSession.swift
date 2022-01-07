enum AuthSession: Equatable {
    case guess
    case signedIn(User)

    var user: User? {
        guard case .signedIn(let user) = self else {
            return nil
        }
        return user
    }
}
