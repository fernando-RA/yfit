import SwiftUI

struct TrainerProfileView: View {
    let trainer: User
    @Environment(\.presentationMode) var presentationMode: Binding<PresentationMode>
    @Environment(\.apiClient) var client
    @Environment(\.authManager) var sessionManager
    @StateObject var trainerClassFeedViewModel: OtherEventsFromUserViewModel
    @StateObject var classFeedViewModel: EventsViewModel

    @State var isFollowing: Bool = false
    var body: some View {
        ScrollView {
            header
                .padding(.bottom, 24)
            HStack {
                VStack(alignment: .leading) {
                    VStack(alignment: .leading, spacing: 4) {
                        HStack {
                            VStack(alignment: .leading, spacing: 8) {
                                HStack {
                                    Text(trainer.fullName)
                                        .font(.system(size: 20, weight: .semibold, design: .rounded))
                                    Spacer()
                                    if sessionManager.signedInUser != nil {
                                        FollowButton(trainer: trainer, followingColor: Color(asset: .systemBlue))
                                    }
                                }
                            Text(trainer.workoutTypes.map(\.name).joined(separator: ", "))
                                .font(.system(size: 16, weight: .light, design: .rounded))
                            }
                        }
                        instagramLink
                            .font(.system(size: 14, weight: .light, design: .rounded))
                    }
                    Text(trainer.bio)
                        .font(.system(size: 16, weight: .regular, design: .rounded))
                        .multilineTextAlignment(.leading)
                        .padding(.vertical, 24)
                }
                .padding(.horizontal)
                .foregroundColor(.primary)
                Spacer()
            }
            otherClasses
        }
        .edgesIgnoringSafeArea(.top)
        .navigationBarBackButtonHidden(true)
        .navigationBarHidden(true)
    }

    private var profilePhoto: some View {
        CachedImage(url: trainer.profilePictureURL, height: 312, width: UIScreen.main.bounds.width)
            .edgesIgnoringSafeArea(.top)
    }
    private var header: some View {
        ZStack {
            profilePhoto
            VStack {
                HStack {
                    closeButton
                    Spacer()
                    SharingButton(url: trainer.trainerLink ?? "")
                }
                .padding(.top, 30)
                .padding()
                Spacer()
            }
        }
    }

    private var otherClasses: some View {
        return OtherReservableClassesFromTrainer(viewModel: trainerClassFeedViewModel, classFeedViewModel: classFeedViewModel)
    }

    private var instagramLink: some View {
        var instaName = ""
        if let insta = URLComponents(string: trainer.instagramLink ?? "") {
            instaName = insta.path.replacingOccurrences(of: "/", with: "@", options: NSString.CompareOptions.literal, range: nil)
            if instaName.last == "@" || instaName.last == "/" {
                instaName = String(instaName.dropLast())
            }
        }
        return HStack {
            if trainer.instagramLink != nil {
                Link(destination: URL(string: trainer.instagramLink!)!, label: {
                    Text(instaName).underline()
                })
            } else {
                Text("")
        }
    }
}

private var closeButton: some View {
    Button(action: {
        presentationMode.wrappedValue.dismiss()
    }) {
        ZStack {
            Circle()
                .fill(style: FillStyle())
                .foregroundColor(.white)
                .frame(width: 40, height: 40, alignment: .center)
            Image(systemName: "xmark").foregroundColor(.black).frame(width: 14, height: 14, alignment: .center)
        }
    }
}
}

#if DEBUG

struct TrainerProfileView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            PreviewGroup(preview: preview)
        }
    }
    private static var preview: some View {
        return TrainerProfileView(trainer: .create(id: 12, firstName: "Dobby", lastName: "House elf", email: "dobby@dobs.com", phoneNumber: nil, bio: "Dobby is a house elf and a free elf. Thanks to Harry Potter and a sock. Dobby has lived his days doing crossfit and some boxing on the side", profilePicture: nil, stripeCustomerId: nil, stripeAccountId: nil, workoutTypes: [WorkoutType(id: 1, workoutType: "Cross fit"), WorkoutType(id: 2, workoutType: "Boxing")], userType: User.UserType.client, instagramLink: "https://www.instagram.com/houseelfontheshelf/"), trainerClassFeedViewModel: OtherEventsFromUserViewModel(client: InMemoryAPIClient(), user: .create(id: 12, firstName: "Dobby", lastName: "House elf", email: "dobby@dobs.com", phoneNumber: nil, bio: "Dobby is a house elf and a free elf. Thanks to Harry Potter and a sock. Dobby has lived his days doing crossfit and some boxing on the side", profilePicture: nil, stripeCustomerId: nil, stripeAccountId: nil, workoutTypes: [WorkoutType(id: 1, workoutType: "Cross fit"), WorkoutType(id: 2, workoutType: "Boxing")], userType: User.UserType.client, instagramLink: "https://www.instagram.com/houseelfontheshelf/")), classFeedViewModel: EventsViewModel(client: InMemoryAPIClient()))
    }
}

#endif
