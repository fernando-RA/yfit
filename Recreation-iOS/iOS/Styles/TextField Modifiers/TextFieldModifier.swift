import SwiftUI

struct TextFieldModifier: ViewModifier {
    var roundedCorner: CGFloat = 6
    var borderColor: Color = .primary
    var textColor: Color = .primary
    var horizontalPadding: CGFloat = 3
    var verticalPadding: CGFloat = 3

    func body(content: Content) -> some View {
        content
            .padding(.horizontal, horizontalPadding)
            .padding(.vertical, verticalPadding)
            .cornerRadius(roundedCorner)
            .foregroundColor(textColor)
            .overlay(RoundedRectangle(cornerRadius: roundedCorner)
                        .stroke(borderColor))
    }
}
