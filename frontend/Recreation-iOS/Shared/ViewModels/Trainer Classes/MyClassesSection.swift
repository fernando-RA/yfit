enum MyClassesSection: Int, CaseIterable, Identifiable {
    case upcoming
    case past

    var name: String {
        switch self {
        case .upcoming:
            return "Upcoming"
        case .past:
            return "Past"
        }
    }

    var id: Int {
        rawValue
    }
}
