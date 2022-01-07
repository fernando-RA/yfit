import SwiftUI

struct UserMenu: View {
    @Environment(\.matches) var matches
    @StateObject var viewModel: UserMenuViewModel

    var body: some View {
        content
            .onAppear {
                matches.fetchFollowers()
                matches.fetchFollowing()
            }
            .navigationBarTitle(Text(""), displayMode: .inline)
            .alert(isPresented: $viewModel.state.isShowingRequiredProfile) {
                setupProfileAlert
            }
            .navigationBarBackButtonHidden(true)
            .navigationBarHidden(true)
                .onAppear {
                    UITableView.appearance().backgroundColor = .systemGroupedBackground
                }
    }

    private var setupProfileAlert: Alert {
        let setupButton = Alert.Button.default(Text("Setup"), action: {
            viewModel.handleSelection(.profile)
        })

        return Alert(
            title: Text("Setup profile"),
            message: Text("In order to create your first class you have to setup your profile"),
            primaryButton: .cancel(),
            secondaryButton: setupButton)
    }

    private var content: some View {
        ZStack {
            UserMenuRouter(destination: $viewModel.state.destination)

            VStack {
                UserMenuHeader(user: viewModel.state.user ?? nil)
                List {
                    ForEach(viewModel.state.sections, content: sectionView)
                }
            }
        }
    }

    private func sectionView(for section: UserMenuSection) -> some View {
        Section(header: sectionHeader(section)) {
            ForEach(section.options, content: row)
        }
    }

    private func sectionHeader(_ section: UserMenuSection) -> some View {
        Text(section.title)
            .font(.system(size: 14, weight: .regular))
            .foregroundColor(.secondary)
    }

    private func row(for option: UserMenuOption) -> some View {
        UserMenuRow(option: option, onTap: viewModel.handleSelection)
    }
}

#if DEBUG

struct UserMenu_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: preview)
    }

    private static var preview: some View {
        let auth = AuthSessionManager.create()
        let viewModel = UserMenuViewModel(auth: auth)

        let user = User.create(
            firstName: "Karl",
            lastName: "Rivest Harnois",
            userType: .trainer
        )

        auth.session = .signedIn(user)

        return NavigationView {
            UserMenu(viewModel: viewModel)
        }
    }
}

#endif
