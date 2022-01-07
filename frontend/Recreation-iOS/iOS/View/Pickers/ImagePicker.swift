import Foundation
import SwiftUI

struct ImagePicker: UIViewControllerRepresentable {
    @Binding var isPresented: Bool
    @Binding var showCropTool: Bool

    typealias SourceType = UIImagePickerController.SourceType
    typealias UIViewControllerType = UIImagePickerController
    typealias Coordinator = ImagePickerCoordinator

    var sourceType: SourceType = .camera
    var onSelection: (UIImage) -> Void = { _ in }

    func makeUIViewController(context: UIViewControllerRepresentableContext<ImagePicker>) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = sourceType
        picker.delegate = context.coordinator
        return picker
    }

    func makeCoordinator() -> ImagePicker.Coordinator {
        ImagePickerCoordinator(isPresented: $isPresented, showCropTool: $showCropTool, onSelection: onSelection)
    }

    func updateUIViewController(_ uiViewController: UIImagePickerController, context: UIViewControllerRepresentableContext<ImagePicker>) {}
}

final class ImagePickerCoordinator: NSObject, UINavigationControllerDelegate, UIImagePickerControllerDelegate {
    @Binding private var isPresented: Bool
    @Binding private var showCropTool: Bool
    private let onSelection: (UIImage) -> Void

    init(isPresented: Binding<Bool>, showCropTool: Binding<Bool>, onSelection: @escaping (UIImage) -> Void) {
        _isPresented = isPresented
        _showCropTool = showCropTool
        self.onSelection = onSelection
    }

    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
        if let image = info[UIImagePickerController.InfoKey.originalImage] as? UIImage {
            onSelection(image)
            isPresented = false
            showCropTool = true
        }
    }

    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        isPresented = false
    }
}
