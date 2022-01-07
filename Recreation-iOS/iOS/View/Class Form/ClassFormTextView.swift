import SwiftUI

struct ClassFormTextView: View {
    @Binding var text: String

    let placeholder: String

    init(_ placeholder: String, text: Binding<String>) {
        self.placeholder = placeholder
        self._text = text
    }

    var body: some View {
        TextView(placeholder: placeholder, text: $text)
            .padding(.horizontal, -4)
            .frame(height: 118, alignment: .leading)
    }
}
