//
//  FollowingListView.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/11/21.
//

import SwiftUI

struct FollowingListView: View {
    @Environment(\.matches) var matches
    var body: some View {
        ScrollView {
            PullToRefresh(coordinateSpaceName: "Seguindo") {
                matches.fetchFollowing()
                }
            VStack {
                ForEach(matches.state.followed) { trainer in
                    TrainerLabelView(trainer: trainer)
                }
            }
            .padding()
        }

        .coordinateSpace(name: "Seguindo")
        .navigationBarTitle("Seguindo(\(matches.state.followed.count))", displayMode: .inline)
    }
}

struct FollowingListView_Previews: PreviewProvider {
    static var previews: some View {
        FollowingListView()
    }
}
