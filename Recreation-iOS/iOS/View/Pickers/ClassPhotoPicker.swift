import SwiftUI

struct ClassPhotoPicker: View {
    @Binding var encodedImage: String?
    @Binding var image: UIImage
    @Binding var showCropingView: Bool
    @State private var showSheet = false
    @State private var selectedSource: ImagePicker.SourceType?
    var hasImgUrl: Bool = false

    var body: some View {
        HStack {
            button
        }
        .actionSheet(isPresented: $showSheet) {
            if image != UIImage() {
                return EditSheet
            } else {
                return actionSheet
            }
        }
        .fullScreenCover(isPresented: imagePickerIsPresented) {
            imagePicker
        }
    }

    private var button: some View {
        return Button( hasImgUrl || hasStagedImage ? "Edit" : "Add featured photo") {
            showSheet = true
        }
    }

    private var hasStagedImage: Bool {
        image != UIImage()
    }

    private var actionSheet: ActionSheet {
        ActionSheet(
            title: Text("Select the class featured photo"),
            message: nil,
            buttons: [
                .default(Text("Camera")) {
                    selectedSource = .camera
                },
                .default(Text("Photo Library")) {
                    selectedSource = .photoLibrary
                },
                .cancel()
            ]
        )
    }

    var EditSheet: ActionSheet {
        ActionSheet(
            title: Text("Select the class featured photo"),
            message: nil,
            buttons: [
                .default(Text("Camera")) {
                    selectedSource = .camera
                },
                .default(Text("Photo Library")) {
                    selectedSource = .photoLibrary
                },
                .default(Text("Crop")) {
                    self.showCropingView.toggle()
                },
                .cancel()
            ]
        )
    }

    private var imagePicker: some View {
        ImagePicker(
            isPresented: imagePickerIsPresented, showCropTool: $showCropingView,
            sourceType: selectedSource ?? .camera,
            onSelection: { image in
                self.image = image
                encodedImage = image.base64Encoded
            }
        )
    }

    private var imagePickerIsPresented: Binding<Bool> {
        .notNil($selectedSource)
    }
}
