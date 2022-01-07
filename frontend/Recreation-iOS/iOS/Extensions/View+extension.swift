import SwiftUI

extension View {
    func alert(_ error: Binding<IdentifiableError?>) -> some View {
        alert(item: error) { error in
            Alert(
                title: Text("Oops"),
                message: Text(error.localizedDescription),
                dismissButton: .default(Text("OK"))
            )
        }
    }

    /// This act as `viewDidLoad` for SwiftUI.
    func onLoad(perform action: (() -> Void)? = nil) -> some View {
        modifier(ViewDidLoadModifier(perform: action))
    }
}

struct ViewDidLoadModifier: ViewModifier {
    @State private var didLoad = false

    private let action: (() -> Void)?

    init(perform action: (() -> Void)? = nil) {
        self.action = action
    }

    func body(content: Content) -> some View {
        content.onAppear {
            if didLoad == false {
                didLoad = true
                action?()
            }
        }
    }
}
