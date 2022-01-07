import SwiftUI
import AuthenticationServices

struct AppleOnboardingButton: View {
    private weak var delegate: ASAuthorizationControllerDelegate?

    init(delegate: ASAuthorizationControllerDelegate?) {
        self.delegate = delegate
    }

    var body: some View {
        Representable()
            .frame(
                width: MainButtonStyle.defaultWidth,
                height: MainButtonStyle.defaultHeight
            )
            .mask(Capsule())
            .onTapGesture(perform: action)
    }

    private struct Representable: UIViewRepresentable {
        func makeUIView(context: Context) -> ASAuthorizationAppleIDButton {
            ASAuthorizationAppleIDButton(type: .continue, style: .black)
        }

        func updateUIView(_ uiView: ASAuthorizationAppleIDButton, context: Context) {}
    }

    private func action() {
        let provider = ASAuthorizationAppleIDProvider()
        let request = provider.createRequest()
        request.requestedScopes = [.fullName, .email]
        let controller = ASAuthorizationController(authorizationRequests: [request])
        controller.delegate = delegate
        controller.performRequests()
    }
}

#if DEBUG

struct AppleOnboardingButton_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: preview)
    }

    private static var preview: some View {
        AppleOnboardingButton(delegate: nil)
    }
}

#endif
