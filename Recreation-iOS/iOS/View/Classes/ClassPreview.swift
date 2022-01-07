import SwiftUI

struct ClassPreview<BarItem: View>: View {
    let `class`: TrainerClass
    var image: UIImage?
    @Binding var isPresented: Bool
    let trailingBarItem: BarItem
    @Binding var isLoading: Bool

    var body: some View {
        VStack {
            NavigationLink(
                destination: preview,
                isActive: $isPresented,
                label: { EmptyView() }
            )
            emptyNavigation
        }
    }

    private var preview: some View {
        ZStack {
            ClassStoryView(
                trainerClass: `class`,
                viewType: .preview,
                image: image,
                trailingBarItem: AnyView(trailingBarItem)
            )

            if isLoading {
                LoadingPage()
            }
        }
    }

    /*
     This is a hacky fix for a SwiftUI navigation bug.
     https://developer.apple.com/forums/thread/677333
     */
    private var emptyNavigation: some View {
        NavigationLink(destination: EmptyView()) {
            EmptyView()
        }
    }
}
