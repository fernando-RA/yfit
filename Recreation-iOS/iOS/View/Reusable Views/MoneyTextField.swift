import SwiftUI
import UIKit

struct MoneyTextField: View {
    @Binding var money: Money

    var body: some View {
        TextField("", text: moneyProxy)
            .multilineTextAlignment(.trailing)
            .keyboardType(.decimalPad)
    }

    private var moneyProxy: Binding<String> {
        .init(get: {
            money.formatted(.long)
        }, set: { newValue in
            if let newMoney = newValue.money {
                money = newMoney
            }
        })
    }
}
