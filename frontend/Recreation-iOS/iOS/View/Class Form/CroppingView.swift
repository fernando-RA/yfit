//
//  CroppingView.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 8/31/21.
//

import SwiftUI
import Mantis

struct CroppingView: View {
    @Binding var encodedImage: String?
    @Binding var image: UIImage
    @State private var cropShapeType: Mantis.CropShapeType = .rect
    @State private var presetFixedRatioType: Mantis.PresetFixedRatioType = .alwaysUsingOnePresetFixedRatio(ratio: 9.0 / 16.0)

    var body: some View {
        ImageCropper(image: $image, cropShapeType: $cropShapeType, presetFixedRatioType: $presetFixedRatioType)
            .padding(.bottom)

        .onDisappear {
            encodedImage = image.base64Encoded
        }
            .navigationTitle("")
            .navigationBarHidden(true)
            .navigationBarBackButtonHidden(true)
            .background(Color.black.edgesIgnoringSafeArea(.all))
    }

    func reset() {
        image = image
        cropShapeType = .rect
        presetFixedRatioType = .canUseMultiplePresetFixedRatio()
    }
}
