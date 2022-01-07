import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let url: URL
    let accessToken: String?
    @StateObject var listener = WebNavigationListener()
    let onNavigation: ((URL) -> Void)?

    init(url: URL, token: String? = nil, onNavigation: ((URL) -> Void)? = nil) {
        self.url = url
        self.accessToken = token
        self.onNavigation = onNavigation
    }

    func makeUIView(context: Context) -> AuthorizedWebview {
        let view = AuthorizedWebview()
        view.accessToken = accessToken
        view.navigationDelegate = listener
        listener.onNavigationHandler = onNavigation
        return view
    }

    func updateUIView(_ uiView: AuthorizedWebview, context: Context) {
        let request = URLRequest(url: url)
        uiView.load(request)
    }
}

final class AuthorizedWebview: WKWebView {
    var accessToken: String?

    @discardableResult
    override func load(_ request: URLRequest) -> WKNavigation? {
        guard let token = accessToken,
              let mutableRequest: NSMutableURLRequest = request as? NSMutableURLRequest
        else {
            return super.load(request)
        }
        mutableRequest.setValue("custom value", forHTTPHeaderField: "Token \(token)")
        return super.load(mutableRequest as URLRequest)
    }
}

final class WebNavigationListener: NSObject, WKNavigationDelegate, ObservableObject {
    var onNavigationHandler: ((URL) -> Void)?

    func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
        guard let url = webView.url else { return }
        onNavigationHandler?(url)
    }
}
