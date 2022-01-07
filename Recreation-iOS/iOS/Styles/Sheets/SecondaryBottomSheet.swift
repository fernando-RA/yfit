//
//  SecondaryBottomSheet.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 7/17/21.
//

import Foundation
import SwiftUI

private enum Constants {
    static let radius: CGFloat = 16
    static let indicatorHeight: CGFloat = 6
    static let indicatorWidth: CGFloat = 60
    static let snapRatio: CGFloat = 0.25
    static let minHeightRatio: CGFloat = 0.5
}

struct SecondaryBottomSheet<Content: View>: View {
    @Environment(\.colorScheme) var colorScheme
    @Binding var isOpen: Bool

    let maxHeight: CGFloat
    let minHeight: CGFloat
    let content: Content

    @GestureState private var translation: CGFloat = 0

    private var offset: CGFloat {
        isOpen ? 0 : maxHeight - minHeight
    }

    private var indicator: some View {
        RoundedRectangle(cornerRadius: Constants.radius)
            .fill(Color.secondary)
            .frame(
                width: Constants.indicatorWidth,
                height: Constants.indicatorHeight
        ).onTapGesture {
            self.isOpen.toggle()
        }
    }

    init(isOpen: Binding<Bool>, maxHeight: CGFloat, @ViewBuilder content: () -> Content) {
        self.minHeight = maxHeight * Constants.minHeightRatio
        self.maxHeight = maxHeight
        self.content = content()
        self._isOpen = isOpen
    }

    var body: some View {
        GeometryReader { geometry in
            VStack(spacing: 0) {
                self.indicator.padding().padding(.bottom)
                self.content
            }
            .frame(width: geometry.size.width, height: self.maxHeight, alignment: .top)
            .background(backgroundColor)
            .cornerRadius(Constants.radius)
            .frame(height: geometry.size.height, alignment: .bottom)
            .offset(y: max(self.offset + self.translation, 0))
            .animation(.interactiveSpring())
            .gesture(
                DragGesture().updating(self.$translation) { value, state, _ in
                    state = value.translation.height
                }.onEnded { value in
                    let snapDistance = self.maxHeight * Constants.snapRatio
                    guard abs(value.translation.height) > snapDistance else {
                        return
                    }
                    self.isOpen = value.translation.height < 0
                }
            )
        }
    }

    private var backgroundColor: Color {
        Color(asset: .bottomSheet)
    }
}

#if DEBUG

struct SecondaryBottomSheet_Previews: PreviewProvider {
    static var previews: some View {
        SecondaryBottomSheet(isOpen: .constant(false), maxHeight: 600) {
            Rectangle().fill(Color.red)
        }.edgesIgnoringSafeArea(.all)
    }
}
#endif
