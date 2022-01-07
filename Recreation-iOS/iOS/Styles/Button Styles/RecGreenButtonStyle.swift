//
//  RecGreenButtonStyle.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 7/27/21.
//

import SwiftUI

struct RecGreenButtonStyle: ButtonStyle {
    static let defaultHeight: CGFloat = 40
    static let defaultWidth: CGFloat = 327

    var width = defaultWidth
    var height = defaultHeight
    var color: Asset.Color = .recGreen

    func makeBody(configuration: Self.Configuration) -> some View {
        configuration.label
            .font(Font.system(size: 14).weight(.bold))
            .frame(width: width, height: height, alignment: .center)
            .background(Capsule()
                            .foregroundColor(Color(asset: color))
            )
            .foregroundColor(.black)
    }
}

#if DEBUG

struct RecGreenButtonStyle_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            Button("Button") {}
                .preferredColorScheme(.dark)
                .buttonStyle(RecGreenButtonStyle())
        }
    }
}

#endif
