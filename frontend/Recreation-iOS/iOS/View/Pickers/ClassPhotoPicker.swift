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
        return Button( hasImgUrl || hasStagedImage ? "Editar" : "Adicionar foto em destaque") {
            showSheet = true
        }
    }

    private var hasStagedImage: Bool {
        image != UIImage()
    }

    private var actionSheet: ActionSheet {
        ActionSheet(
            title: Text("Selecione a foto em destaque da turma"),
            message: nil,
            buttons: [
                .default(Text("Camera")) {
                    selectedSource = .camera
                },
                .default(Text("Biblioteca de fotos")) {
                    selectedSource = .photoLibrary
                },
                .cancel()
            ]
        )
    }

    var EditSheet: ActionSheet {
        ActionSheet(
            title: Text("Selecione a foto em destaque da turma"),
            message: nil,
            buttons: [
                .default(Text("Camera")) {
                    selectedSource = .camera
                },
                .default(Text("Biblioteca de fotos")) {
                    selectedSource = .photoLibrary
                },
                .default(Text("Recortar")) {
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
