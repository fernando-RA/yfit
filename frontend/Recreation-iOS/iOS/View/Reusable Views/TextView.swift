import SwiftUI

struct TextView: View {
    let placeholder: String

    @Binding var text: String

    init(placeholder: String, text: Binding<String>) {
        self.placeholder = placeholder
        _text = text
        UITextView.appearance().backgroundColor = .clear
    }
    var body: some View {
        ZStack(alignment: .topLeading) {
            if text.isEmpty {
                Text(placeholder)
                    .foregroundColor(Color(.systemGray3))
                    .padding(.top, 8)
                    .padding(.leading, 4)
                    .allowsHitTesting(false)
            }

            TextEditor(text: $text)
        }
   }
}
