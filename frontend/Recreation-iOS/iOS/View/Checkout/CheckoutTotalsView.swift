import SwiftUI

struct CheckoutTotalsView: View {
    let lineItems: [PaymentLineItem]

    var body: some View {
        VStack(spacing: 10) {
            ForEach(lineItems) { lineItem in
                HStack {
                    Text(lineItem.title + ":")
                    Spacer()
                    Text(lineItem.amount.formatted())
                }
                .font(.system(size: 16))
            }
        }
    }
}

#if DEBUG

struct CheckoutTotalsView_Previews: PreviewProvider {
    static var previews: some View {
        CheckoutTotalsView(lineItems: [
            .init(label: .subtotal, amount: 1050.cents),
            .init(label: .total, amount: 1250.cents)
        ])
    }
}

#endif
