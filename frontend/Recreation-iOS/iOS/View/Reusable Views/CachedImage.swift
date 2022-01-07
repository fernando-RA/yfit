import SwiftUI
import Kingfisher

struct CachedImage: View {
    @Environment(\.colorScheme) var colorScheme

    let url: URL?
    var fallback: AnyView?
    var height: CGFloat
    var width: CGFloat
    var body: some View {
        Group {
            if let url = url {
                cachedImage(for: url)
            } else {
                fallbackView
            }
        }
    }

    private func cachedImage(for url: URL) -> some View {
        KFImage
            .url(url)
            .cancelOnDisappear(true)
            .placeholder { fallbackView }
            .fade(duration: 0.25)
            .resizable()
            .aspectRatio(contentMode: .fill)
            .frame(width: width, height: height, alignment: .center)
    }

    private var fallbackView: some View {
        Group {
            if let fallback = fallback {
                fallback
                    .frame(width: width, height: height, alignment: .center)
            } else {
                colorScheme == .dark ? Color(.darkGray) : Color(.lightGray)
            }
        }
    }
}
