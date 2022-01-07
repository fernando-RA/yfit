import SwiftUI

struct TrainerLabelView: View {
    @Environment(\.apiClient) var client
    @Environment(\.authManager) var sessionManager
    @Environment(\.matches) var matches
    @State private var isShowingProfile: Bool = false
    let trainer: User
    var components = Component.allCases
    var color: Color = Color.primary
    @State private var isFollowing: Bool = false
    var followingColor: Color = .blue
    enum Component: CaseIterable {
        case profilePicture, fullname, workoutTypes, checkMark
    }

    var body: some View {
        profileDetails
    }

    var profileDetails: some View {
        let trainerClassFeedViewModel = OtherEventsFromUserViewModel(client: client, user: trainer)
        let classFeedViewModel = EventsViewModel(client: client)

        return LazyView {
            HStack {
                NavigationLink(
                    destination: TrainerProfileView(trainer: trainer, trainerClassFeedViewModel: trainerClassFeedViewModel, classFeedViewModel: classFeedViewModel),
                label: {
                    HStack {
                        if components.contains(.profilePicture) {
                            ProfilePicture(user: trainer, size: .small)
                        }

                        VStack(alignment: .leading) {
                            if components.contains(.fullname) {
                                if components.contains(.checkMark) && trainer.verifiedTrainer == true {
                                    HStack {
                                        Text(trainer.fullName).font(.system(size: 14).weight(.bold))
                                        Image(asset: .blueCheck)
                                            .resizable()
                                            .frame(width: 15, height: 15, alignment: .center)
                                    }.padding(.vertical, -5)
                                } else {
                                        HStack {
                                            Text(trainer.fullName).font(.system(size: 14))
                                        }
                                    }
                                }

                            if components.contains(.workoutTypes) {
                                Text(trainer.formattedWorkoutTypes).font(.system(size: 12))
                            }
                        }
                        .foregroundColor(color)

                        Spacer()
                    }
            })

                if sessionManager.signedInUser != nil {
                    VStack {
                        FollowButton(trainer: trainer, followingColor: followingColor)
                        Spacer()
                    }
                }
            }
        }
        .frame(width: nil, height: 38, alignment: .center)
    }
    /*
     This is a hacky fix for a SwiftUI navigation bug.
     https://developer.apple.com/forums/thread/677333
     */
    private var emptyNavigation: some View {
        NavigationLink(destination: EmptyView()) {
            EmptyView()
        }
    }

//    private var FollowButton: some View {
//        Button(matches.state.following.contains(where: { match in
//            match.user == trainer.id
//        }) || isFollowing ? "Following" : "Follow", action: {
//            if matches.state.following.contains(where: { match in
//                match.user == trainer.id
//            }) {
//                matches.deleteMatch(match: trainer.id)
//                isFollowing = false
//        } else {
//            matches.createMatch(userId: sessionManager.signedInUser?.id ?? nil, trainerId: trainer.id)
//            isFollowing = true
//        }
//        })
//            .buttonStyle(FollowButtonStyle(isFollowing: matches.state.following.contains(where: { match in
//                match.user == trainer.id
//            }) || isFollowing, color: followingColor))
//    }
}

#if DEBUG

struct TrainerLabelView_Previews: PreviewProvider {
    static var previews: some View {
        TrainerLabelView(
            trainer: .create(firstName: "Harry", lastName: "Potter", workoutTypes: [
                .create(workoutType: "Yoga")
            ])
        ).padding()
    }
}

#endif
