import SwiftUI

struct UserMenuRouter: View {
    @Binding var destination: UserMenuOption?
    @Environment(\.authManager) var auth
    @Environment(\.apiClient) var client

    var body: some View {
        NavigationLink(
            destination: destinationView,
            isActive: .notNil($destination),
            label: {
                EmptyView()
            })
    }

    private var destinationView: some View {
        Group {
            switch destination {
            case .profile:
                editProfile

            case .Following:
                followingList

            case .Followers:
                followersList
            case .settings:
                settings

            case .createClass:
                createClass

            case .viewClasses:
                LazyView { myClasses }

            default:
                Text(destination?.title ?? "")
            }
        }
    }

    private var editProfile: some View {
        let viewModel = EditProfileViewModel(auth: auth, client: client, completionHandler: {
            self.destination = nil
        })
        return EditProfilePage(viewModel: viewModel)
    }
    private var followingList: some View {
        FollowingListView()
    }
    private var followersList: some View {
        FollowersListView()
    }
    private var myClasses: some View {
        let viewModel = TrainerClassFeedViewModel(client: client, auth: auth)
        return TrainerClassFeedView(viewModel: viewModel)
    }

    private var settings: some View {
        let viewModel = SettingsViewModel(auth: auth)
        return SettingsPage(viewModel: viewModel)
    }

    private var createClass: some View {
        Group {
            if let user = auth.signedInUser {
                let viewModel = ClassFormViewModel(
                    client: client,
                    type: .create(author: user),
                    onPublish: dismissPage
                )

                ClassForm(viewModel: viewModel)
            }
        }
    }

    private func dismissPage() {
        destination = .viewClasses
    }
}
