struct GetCurrentUser: Request {
    typealias ReturnType = User

    let method: HTTPMethod = .get
    let path = "profile/get_user_profile"
}
