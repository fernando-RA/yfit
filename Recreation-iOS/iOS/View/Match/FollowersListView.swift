//
//  FollowersListView.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/11/21.
//

import SwiftUI

struct FollowersListView: View {
    @Environment(\.matches) var matches
    var body: some View {
        ScrollView {
            PullToRefresh(coordinateSpaceName: "Followers") {
                matches.fetchFollowers()
                }
            VStack {
                ForEach(matches.state.followers) { trainer in
                    TrainerLabelView(trainer: trainer)
                }
            }
            .padding()
        }
        .coordinateSpace(name: "Followers")
        .navigationBarTitle("Followers(\(matches.state.followers.count))", displayMode: .inline)
    }
}

struct FollowersListView_Previews: PreviewProvider {
    static var previews: some View {
        FollowersListView()
    }
}
