struct SetFeaturedPhoto: Request {
    typealias ReturnType = TrainerClass

    let encodedPhoto: String
    let `class`: TrainerClass
    let method: HTTPMethod = .post

    var path: String {
        "trainer-class/\(`class`.id)/set_featured_photo"
    }

    var body: [String: Any]? {
        [
            "image": encodedPhoto
        ]
    }
}
