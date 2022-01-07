struct PaymentLineItem: Identifiable, Equatable {
    let label: Label
    let amount: Money

    enum Label: String {
        case subtotal, total
    }

    var title: String {
        label.rawValue.capitalized
    }

    var id: String {
        label.rawValue
    }
}
