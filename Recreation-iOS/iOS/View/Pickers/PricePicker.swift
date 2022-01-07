import SwiftUI

struct PricePicker: View {
    @Binding var price: Money

    var body: some View {
        HStack {
            Text("Price per attendee")
            Spacer()
            MoneyTextField(money: $price)
        }
    }
}
