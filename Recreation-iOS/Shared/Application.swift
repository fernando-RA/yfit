import SwiftUI
import Sentry

struct Application: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self)
    private var appDelegate

    @Environment(\.authManager) var auth
    @Environment(\.apiClient) var client
    @Environment(\.googleAuthenticator) var google
    @Environment(\.gps) var gps

    var body: some Scene {
        WindowGroup {
                onboarding
        }
    }

    init() {
        SentrySDK.start { options in
                options.dsn = "https://a1931b055cc04ce489af2a71495370a1@o525489.ingest.sentry.io/5983188"
                options.debug = true // Enabled debug when first installing is always helpful
            options.tracesSampleRate = 0.3
            }
    }

    private var onboarding: some View {
        let viewModel = OnboardingViewModel(client: client, authManager: auth, googleAuthenticator: google)
        let destination = LazyView { classFeed }
        return OnboardingPage(viewModel: viewModel, destination: destination)
    }

    private var classFeed: some View {
        let viewModel = EventsViewModel(client: client)
        return ContentView(viewModel: viewModel, gps: gps)
    }
}
