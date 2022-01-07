//
//  DoneEditingTextFieldModifier.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 7/21/21.
//

import SwiftUI
import Foundation
import UIKit
struct DoneEditingTextFieldModifier: ViewModifier {
    @Binding var text: String

    func body(content: Content) -> some View {
        HStack {
            content

            if !text.isEmpty {
                Button(
                    action: { hideKeyboard() },
                    label: {
                        Text("Completo")
                            .foregroundColor(Color(asset: .recGreen))
                    }
                )
            }
        }
    }
}
