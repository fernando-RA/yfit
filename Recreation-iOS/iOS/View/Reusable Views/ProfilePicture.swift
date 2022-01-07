import SwiftUI

struct ProfilePicture: View {
    @Environment(\.colorScheme) var colorScheme

    let user: User
    var size: Size

    enum Size: CGFloat {
        case small = 36
        case big = 80

        var initialsFontSize: CGFloat {
            switch self {
            case .small:
                return 12
            case .big:
                return 32
            }
        }
    }

    var body: some View {
        CachedImage(url: user.profilePictureURL, fallback: AnyView(defaultImage), height: size.rawValue, width: size.rawValue)
            .clipShape(Circle())
    }

    private var defaultImage: some View {
        ZStack {
            Circle()
                .foregroundColor(defaultImageColor)
                .frame(width: size.rawValue, height: size.rawValue)
            Text(user.initials)
                .font(.system(size: size.initialsFontSize, weight: .semibold))
                .foregroundColor(.white)
        }
    }

    private var defaultImageColor: Color {
        colorScheme == .dark ? Color(.darkGray) : Color(.lightGray)
    }
}
