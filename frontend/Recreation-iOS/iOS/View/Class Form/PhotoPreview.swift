import SwiftUI

struct PhotoPreview: View {
    let photo: UIImage?

    @State private var showPreview = false

    var body: some View {
        Group {
            if let image = photo {
                HStack {
                    smallPreviewImage(for: image)
                    Spacer()
                }
            }
        }
        .sheet(isPresented: $showPreview) {
            preview
        }
    }

    private func smallPreviewImage(for image: UIImage) -> some View {
        Image(uiImage: image)

            .resizable()
            .scaledToFill()
            .clipShape(RoundedRectangle(cornerRadius: 6))
            .frame(width: 42, height: 73)
            .onTapGesture {
                showPreview = true
            }
    }

    private var preview: some View {
        VStack {
            HStack {
                Spacer()
                Button("Fechar") {
                    showPreview = false
                }
            }
            .padding()

            if let image = photo {
                Image(uiImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .ignoresSafeArea()
                    .clipShape(RoundedRectangle(cornerRadius: 20))
            }
            Spacer()
        }
    }
}
