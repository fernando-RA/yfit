import SwiftUI

struct NavMapOverlayView: View {
    @Environment(\.authManager) var auth
    var body: some View {
        VStack {
            HStack {
                menuNavLink
                Spacer()
            }
            Spacer()
                    }
        .background(Color.clear)
    }
    private var menuNavLink: some View {
        VStack {
            NavigationLink(destination: menu) {
                menuIcon
            }
            emptyNavigation
        }
    }

    private var menu: some View {
        let viewModel = UserMenuViewModel(auth: auth)
        return UserMenu(viewModel: viewModel)
    }

    private var menuIcon: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 5)
                .frame(width: 50, height: 50, alignment: .center)
                .foregroundColor(Color(asset: .bottomSheet))

            Image(systemName: "line.horizontal.3")
                .font(.title3)
                .foregroundColor(.gray)
        }
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

struct NavMapOverlayView_Previews: PreviewProvider {
    static var previews: some View {
        NavMapOverlayView()
            .background(Color.gray)
    }
}

#endif
