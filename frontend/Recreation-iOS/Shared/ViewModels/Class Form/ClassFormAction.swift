enum ClassFormAction: String {
    case publish
    case preview

    var name: String {
        rawValue.capitalized
    }
}
