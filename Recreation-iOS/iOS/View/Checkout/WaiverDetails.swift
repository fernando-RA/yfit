import SwiftUI

struct WaiverDetails: View {
    @Binding var isChecked: Bool

    var body: some View {
        HStack(alignment: .center, spacing: 14) {
            checkBox
            label
            Spacer()
            privacyPolicy
        }
    }

    private var checkBox: some View {
        Button(action: {
            isChecked.toggle()
        }, label: {
            Image(systemName: isChecked ? "checkmark.square" : "square")
        })
    }

    private var label: some View {
        Text("Eu concordo com os termos e condições da Rec.")
            .font(.system(size: 12, weight: .light))
    }

    private var privacyPolicy: some View {
        Group {
            if let url = URL(string: "https://getrec.com/privacy-policy") {
                NavigationLink("Saiba mais", destination: WebView(url: url))
                emptyNavigation
            }
        }
    }
    /*
     This is a hacky fix for a SwiftUI navigation bug.
     https://developer.apple.com/forums/thread/677333
     */
    private var emptyNavigation: some View {
        NavigationLink(destination: EmptyView()) {
            EmptyView()
        }
    }
}
