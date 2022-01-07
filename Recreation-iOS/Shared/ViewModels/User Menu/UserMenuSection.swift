struct UserMenuSection: Identifiable {
    let type: UserMenuSectionType
    let options: [UserMenuOption]

    var id: String {
        type.id
    }

    var title: String {
        type.title
    }
}
