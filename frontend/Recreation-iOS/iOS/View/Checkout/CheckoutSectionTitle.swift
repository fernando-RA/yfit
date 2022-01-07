import SwiftUI

struct CheckoutSectionTitle: View {
    let section: CheckoutSection

    private let smallSize: CGFloat = 16
    private let bigSize: CGFloat = 28

    var body: some View {
        Group {
            if section.titleIsVisible {
                label
            }
        }
    }

    private var label: some View {
        Text(section.title)
            .font(.system(size: fontSize, weight: .semibold))
    }

    private var fontSize: CGFloat {
        switch section {
        case .classInfo:
            return bigSize
        default:
            return smallSize
        }
    }
}

#if DEBUG

struct CheckoutSectionTitle_Previews: PreviewProvider {
    static var previews: some View {
        CheckoutSectionTitle(section: .contactInfo)
    }
}

#endif
