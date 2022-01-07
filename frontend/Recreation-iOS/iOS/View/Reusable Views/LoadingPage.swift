import SwiftUI

struct LoadingPage: View {
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        ZStack {
            VisualEffectView(effect: UIBlurEffect(style: .dark))

            ProgressView()
                .foregroundColor(.primary)
                .frame(width: 80, height: 80, alignment: .center)
                .background(RoundedRectangle(cornerRadius: 10).fill(backgroundColor))
        }
        .ignoresSafeArea(.all)
    }

    private var backgroundColor: some ShapeStyle {
        colorScheme == .dark ? Color(asset: .darkGray) : .white
    }
}
