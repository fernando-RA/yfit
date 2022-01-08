import SwiftUI

struct PricePicker: View {
    @Binding var price: Money

    var body: some View {
        HStack {
            Text("Preço por visitante")
            Spacer()
            MoneyTextField(money: $price)
        }
    }
}
