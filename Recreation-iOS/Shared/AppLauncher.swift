import SwiftUI
import Foundation
import Sentry

@main
struct AppLauncher {
    static func main() throws {
        if Env.shouldLaunchApp {
            Application.main()
        } else {
            EmptyApp.main()
        }
    }

    private struct EmptyApp: App {
        var body: some Scene {
            WindowGroup {
                EmptyView()
            }
        }
    }
}
