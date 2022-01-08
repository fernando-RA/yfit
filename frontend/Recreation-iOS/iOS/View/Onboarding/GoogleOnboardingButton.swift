import SwiftUI
import OpenGoogleSignInSDK

struct GoogleOnboardingButton: View {
    @Environment(\.googleAuthenticator) var authenticator

    var body: some View {
        ZStack {
            presenter
            button
        }
        .onOpenURL(perform: authenticator.handle)
    }

    private var presenter: some View {
        GooglePresenter()
            .frame(width: 0, height: 0)
    }

    private var button: some View {
        Button(action: {
            authenticator.signIn()
        }, label: {
            ZStack {
                Capsule()
                    .foregroundColor(.black)
                    .frame(
                        width: MainButtonStyle.defaultWidth,
                        height: MainButtonStyle.defaultHeight
                    )

                HStack(alignment: .center, spacing: 8) {
                    Image(asset: .googleLogo)

                    Text("Continuar com Google")
                        .font(.system(size: 19))
                        .foregroundColor(.white)
                }
            }
        })
    }
}

struct GooglePresenter: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> GoogleOnboardingController {
        GoogleOnboardingController()
    }

    func updateUIViewController(_ uiViewController: GoogleOnboardingController, context: Context) {}
}

final class GoogleOnboardingController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        OpenGoogleSignIn.shared.presentingViewController = self
    }
}
