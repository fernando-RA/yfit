struct GetClass: Request {
    typealias ReturnType = TrainerClass

    let id: TrainerClass.ID
    let method: HTTPMethod = .get

    var path: String {
        "trainer-class/\(id)"
    }
}
