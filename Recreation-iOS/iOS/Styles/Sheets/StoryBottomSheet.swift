//
//  StoryBottomSheet.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  on 6/1/21.
//

import Foundation
import SwiftUI

private enum Constants {
    static let radius: CGFloat = 16
    static let indicatorHeight: CGFloat = 20
    static let indicatorWidth: CGFloat = 100
    static let snapRatio: CGFloat = 0.25
    static let minHeightRatio: CGFloat = 0.1
}

struct StoryBottomSheet<Content: View>: View {
    @Binding var isOpen: Bool

    let maxHeight: CGFloat
    let minHeight: CGFloat
    let content: Content

    @GestureState private var translation: CGFloat = 0

    private var offset: CGFloat {
        isOpen ? 0 : maxHeight - minHeight
    }

    private var indicator: some View {
        VStack {
            if isOpen {
                Text("Minimize")
                    .fontWeight(.bold)
                Image(systemName: "chevron.down")
            } else {
            Image(systemName: "chevron.up")
            Text("Saiba Mais")
                .fontWeight(.bold)
            }
        }
        .foregroundColor(.white)
            .frame(
                width: Constants.indicatorWidth,
                height: Constants.indicatorHeight + 10
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
                self.indicator.padding()
                self.content
            }
            .frame(width: geometry.size.width, height: self.maxHeight, alignment: .top)
            .background(
                LinearGradient(gradient: Gradient(colors: [.clear, .black, .black, .black, .black, .black, .black, .black, .black, .black, .black, .black, .black, .black, .black]), startPoint: .top, endPoint: .bottom)
            )
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
}

struct StoryBottomSheet_Previews: PreviewProvider {
    static var previews: some View {
        StoryBottomSheet(isOpen: .constant(false), maxHeight: 900) {
            Rectangle().fill(Color.red)
        }.edgesIgnoringSafeArea(.all)
            .background(Color(.black))
    }
}
