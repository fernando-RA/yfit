import SwiftUI

struct LazyView<Content: View>: View {
    let build: () -> Content

    var body: some View {
        build()
    }
}
