import SwiftUI

struct CheckoutContactInfoDetails: View {
    let state: ContactInfo

    var body: some View {
        VStack(alignment: .leading) {
            Text(fullName)
            Text(state.email)
            Text(state.phoneNumber)
        }
        .font(.system(size: 16))
    }

    private var fullName: String {
        [state.firstName, state.lastName].joined(separator: " ")
    }
}
