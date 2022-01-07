enum UserMenuSectionType: String, Identifiable {
    case classes, training, account, about

    var title: String {
        switch self {
        case.classes:
            return ""
        case .about:
            return "ABOUT REC"
        default:
            return rawValue.uppercased()
        }
    }

    var id: String {
        title
    }
}
