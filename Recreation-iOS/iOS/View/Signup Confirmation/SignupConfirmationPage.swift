import SwiftUI

struct SignupConfirmationPage: View {
    let trainerClass: TrainerClass
    let contactInfo: ContactInfo
    @Environment(\.authManager) var sessionManager
    @Environment(\.apiClient) private var client
    @Binding var isPresented: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            ScrollView {
                header
                signupDetails
                emptyNavigation
            }
        }
        .edgesIgnoringSafeArea(.top)
        .background(Color(.black).edgesIgnoringSafeArea(.all))
        .navigationBarHidden(true)
        .navigationTitle("")
        .navigationBarBackButtonHidden(true)
    }

    private var signupDetails: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("Get ready for")
                .font(.title3)
                .foregroundColor(Color(asset: .lightGray))
            ClassInformation(trainerClass: trainerClass)
            instructorLabel
            shareableLink
            reservationEmail
            whatHappensNow
            cancellationPolicy
            HStack {
                Text("Upcoming classes from \(trainerClass.author.fullName)")
                    .font(.headline)
                    .bold()
                Spacer()
            }
            ScrollView(.horizontal) {
                otherClasses
            }
        }
        .padding(.horizontal)
    }

    private var header: some View {
        ZStack(alignment: .top) {
            SignupConfirmationHeader()
            HStack {
                Spacer()
                Button("Done") {
                    self.isPresented = false
                }
                .padding(35)
                .padding(.top, 10)
            }
        }
    }

    private var shareableLink: some View {
        VStack(alignment: .leading) {
            Text("Invite your friends")
                .font(.caption)
                .foregroundColor(Color(asset: Asset.Color.lightGray))
            HStack {
                Text(trainerClass.classLink ?? "")
                Spacer()
                SharingButton(url: trainerClass.classLink ?? "", styleIsCircle: false)
                    .foregroundColor(.white)
            }
            .padding()
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(Color(asset: .lightGray), lineWidth: 1.5)
            )
        }
        .padding(.horizontal, 5)
    }
    private var profilePhoto: some View {
        Group {
            trainerClass.author.profilePictureURL.map { url in
                CachedImage(url: url, height: 36, width: 36)
                    .clipShape(Circle())
            }
        }
    }

    private var instructorLabel: some View {
        HStack(spacing: 5) {
            profilePhoto
            VStack(alignment: .leading) {
                Text(trainerClass.author.fullName)
                    .underline().bold()
                Text(trainerClass.tags.map(\.name).joined(separator: ", "))
            }
            .foregroundColor(.white)
        }
    }

    private var reservationEmail: some View {
        VStack(alignment: .leading) {
            Text("Reservation details sent to:")
                .font(.caption)
                .foregroundColor(Color(asset: Asset.Color.lightGray))
            Text(sessionManager.signedInUser?.contactInfo.email ?? contactInfo.email)
        }
        .foregroundColor(.white)
    }

    private var whatHappensNow: some View {
        VStack(alignment: .leading) {
            Text("What happens now?")
                .font(.caption)
                .foregroundColor(Color(asset: Asset.Color.lightGray))
            Text("Your spot details have been sent to your email and you will receive a reminder email 12 hours before class. Please show up 5-10 minutes before the class.")
                .fixedSize(horizontal: false, vertical: true)
        }
        .foregroundColor(.white)
    }

    private var cancellationPolicy: some View {
        VStack(alignment: .leading) {
            Text("Cancellation Policy")
                .font(.caption)
                .foregroundColor(Color(asset: Asset.Color.lightGray))
            Text("Speak with your trainer before class.")
        }
        .foregroundColor(.white)
    }
    private var otherClasses: some View {
        let trainerClassFeedViewModel = OtherEventsFromUserViewModel(client: client, user: trainerClass.author)
        let classFeedViewModel = EventsViewModel(client: client)
        let matchesVM = MatchesViewModel(client: client, auth: sessionManager)

        return OtherClassesFromTrainer(trainerClassFeedViewModel: trainerClassFeedViewModel, classFeedViewModel: classFeedViewModel, matchesVM: matchesVM, trainer: trainerClass)
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
}

#if DEBUG

struct SignupConfirmationPage_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: preview)
    }

    private static var preview: some View {
        NavigationView {
            SignupConfirmationPage(trainerClass: .create(), contactInfo: ContactInfo(), isPresented: .constant(true))
        }
    }
}

#endif
