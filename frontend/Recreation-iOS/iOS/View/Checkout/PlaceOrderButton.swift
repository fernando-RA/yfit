import SwiftUI
import Stripe

struct PlaceOrderButton: View {
    let paymentProvider: PaymentProvider
    var labelType: LabelType = .placeOrder
    let isEnabled: Bool
    let onAction: (CheckoutAction) -> Void

    @State var paymentSheet: PaymentSheet?

    enum LabelType {
        case placeOrder, noSpotsLeft

        var text: String {
            switch self {
            case .placeOrder:
                return "Agendar"
            case .noSpotsLeft:
                return "Esgotado"
            }
        }
    }

    var body: some View {
        ZStack {
            if let sheet = paymentSheet {
                paymentButton(for: sheet)
            } else {
                regularButton
            }
        }
        .disabled(!isEnabled)
        .onReceive(paymentProvider.paymentSheet) { paymentSheet in
            self.paymentSheet = paymentSheet
        }
    }

    private var regularButton: some View {
        Button(action: {
            onAction(.signupForClass)
        }, label: {
            content
        })
    }

    private func paymentButton(for paymentSheet: PaymentSheet) -> some View {
        PaymentSheet.PaymentButton(
            paymentSheet: paymentSheet,
            onCompletion: { stripeResult in
                let result = PaymentResult(from: stripeResult)
                onAction(.handlePayment(result))
            },
            content: { content })
    }

    private var content: some View {
        ZStack {
            capsule
            label
        }
        .opacity(opacity)
    }

    private var capsule: some View {
        Capsule()
            .frame(height: 48)
            .foregroundColor(backgroundColor)
    }

    private var label: some View {
        Text(labelType.text).foregroundColor(.black)
    }

    private var opacity: Double {
        isEnabled ? 1 : 0.5
    }

    private var backgroundColor: Color {
        isEnabled ? Color(asset: .recGreen) : .gray
    }
}

#if DEBUG

struct PlaceOrderButton_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            preview(isEnabled: true)
            preview(isEnabled: false)
        }
    }

    private static func preview(isEnabled: Bool) -> some View {
        let paymentProvider = InMemoryPaymentProvider()

        return PlaceOrderButton(
            paymentProvider: paymentProvider,
            isEnabled: isEnabled,
            onAction: { _ in })
    }
}

#endif
