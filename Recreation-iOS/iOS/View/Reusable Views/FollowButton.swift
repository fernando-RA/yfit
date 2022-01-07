//
//  FollowButton.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/11/21.
//

import Foundation
import SwiftUI
struct FollowButton: View {
    @Environment(\.matches) var matches
    @Environment(\.authManager) var sessionManager
    @State var isFollowing = false
    let trainer: User
    let followingColor: Color
    var body: some View {
        Button(isFollowing ? "Following" : "Follow", action: {
            if matches.state.following.contains(where: { match in
                match.user == trainer.id
            }) {
                if let id = matches.state.following.first(where: {$0.user == trainer.id}) {
                   // do something with foo
                    matches.deleteMatch(match: id.id ?? 0)
                }
            isFollowing = false
        } else {
            matches.createMatch(userId: sessionManager.signedInUser?.id ?? nil, trainerId: trainer.id)
            isFollowing = true
        }
        })
            .buttonStyle(FollowButtonStyle(isFollowing: isFollowing, color: followingColor))
        .onAppear {
            if matches.state.following.contains(where: { match in
                match.user == trainer.id
            }) {
                isFollowing = true
            }
    }
    }
}
