//
//  FollowButtonStyle.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/5/21.
//

import SwiftUI

struct FollowButtonStyle: ButtonStyle {
    var isFollowing: Bool
    var color: Color = .blue
    func makeBody(configuration: Self.Configuration) -> some View {
        if !isFollowing {
            configuration.label
                .font(.system(size: 14).weight(.semibold))
            .foregroundColor(color)
            .padding(.horizontal, 25)
            .padding(.vertical, 6)
            .overlay(
                        RoundedRectangle(cornerRadius: 90, style: .continuous)
                            .stroke(color, style: StrokeStyle(lineWidth: 1))
                    )
        } else {
            configuration.label
                .font(.system(size: 14).weight(.semibold))
                .foregroundColor(color)
                .padding(.horizontal, 15)
                .padding(.vertical, 6)
        }
    }
}

#if DEBUG

struct FollowButtonStyle_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            Button("Seguir") {}
            .buttonStyle(FollowButtonStyle(isFollowing: false))

            Button("Seguindo") {}
            .preferredColorScheme(.dark)
            .buttonStyle(FollowButtonStyle(isFollowing: true))
        }
    }
}

#endif
