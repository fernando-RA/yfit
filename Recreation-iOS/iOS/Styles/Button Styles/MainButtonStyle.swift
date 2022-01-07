import SwiftUI

struct MainButtonStyle: ButtonStyle {
    static let defaultHeight: CGFloat = 48
    static let defaultWidth: CGFloat = 289

    var width = defaultWidth
    var height = defaultHeight
    var color: Asset.Color = .buttonColor

    func makeBody(configuration: Self.Configuration) -> some View {
        configuration.label
            .frame(width: width, height: height, alignment: .center)
            .background(Capsule()
                            .foregroundColor(Color(asset: color))
                            .shadow(color: .black, radius: 0.8, x: -0.2, y: 0.5)
            )
            .foregroundColor(.white)
    }
}

#if DEBUG

struct MainButtonStyle_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            Button("Button") {}
                .buttonStyle(MainButtonStyle())

            Button("Button") {}
                .preferredColorScheme(.dark)
                .buttonStyle(MainButtonStyle())
        }
    }
}

#endif
