import SwiftUI
import AVKit

struct VideoView: View {
    @Binding var isPlaying: Bool

    private let player: AVPlayer

    init(url: URL, isPlaying: Binding<Bool>) {
        self.player = .init(url: url)
        self._isPlaying = isPlaying
        player.isMuted = true
    }

    var body: some View {
        VideoController(player: player)
            .onChange(of: isPlaying, perform: togglePlayer)
            .onAppear {
                togglePlayer(isPlaying: isPlaying)
            }
    }

    private func togglePlayer(isPlaying: Bool) {
        if isPlaying {
            player.play()
        } else {
            player.pause()
        }
    }
}
