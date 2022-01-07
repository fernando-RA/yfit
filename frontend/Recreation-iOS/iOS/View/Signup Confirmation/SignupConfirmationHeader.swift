import SwiftUI

struct SignupConfirmationHeader: View {
    var body: some View {
        ZStack {
            Rectangle()
                .foregroundColor(Color(asset: .checkoutConfirmationAllSet))
            icon.padding(.top, 40)
        }
        .frame(height: 280, alignment: .center)
    }
    private var icon: some View {
        VStack {
            Image(asset: .checkCircle)
            Text("All Set!")
                .font(.largeTitle)
                .bold()
        }
        .foregroundColor(.white)
    }
}
