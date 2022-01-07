import SwiftUI

struct StoryVideoView: View {
    let url: URL

    @State var isPlaying = true

    var body: some View {
        VideoView(url: url, isPlaying: $isPlaying)
            .ignoresSafeArea()
            .onLongPressGesture(
                minimumDuration: .infinity,
                maximumDistance: .infinity,
                pressing: { isPressing in isPlaying = !isPressing },
                perform: {}
            )
    }
}
