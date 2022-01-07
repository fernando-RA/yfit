import SwiftUI

struct TransparentButtonStyle: ButtonStyle {
    var width: CGFloat = 286, height: CGFloat = 48
    var BtnFontColor: String = "BtnColor"
    var systemBlue: String = "SystemBlue"

    func makeBody(configuration: Self.Configuration) -> some View {
        configuration.label
            .font(Font.body.weight(.bold))
            .frame(width: width, height: height, alignment: .center)
            .background(Capsule()
                            .stroke(Color(.white), lineWidth: 1)
                            .foregroundColor(.clear)
            )
    }
}

#if DEBUG

struct TransparentButtonStyle_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            Button(action: {}, label: {
                Text("Button")
            }).buttonStyle(TransparentButtonStyle())
            Button(action: {}, label: {
                Text("Button")
            }).preferredColorScheme(.dark).buttonStyle(TransparentButtonStyle())
        }
    }
}

#endif
