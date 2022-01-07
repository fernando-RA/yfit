import SwiftUI

struct Asset {
    enum Color: String, CaseIterable {
        case recGreen
        case lightGray
        case accentColor
        case systemBlue
        case buttonColor
        case checkoutConfirmationAllSet
        case darkGray
        case bottomSheet
        case offBackground
case bannerGrey
        case formBackground
        case trendingColor
        var name: String {
            "Colors/\(format(name: rawValue))"
        }
    }

    enum Image: String, CaseIterable {
        case checkCircle
        case facebookLogo
        case twitterLogo
        case instagramLogo
        case onboardingHero
        case followOnboardHero
        case googleLogo
        case logo
        case hiit
        case notificationHero
        case blueCheck
        case localPermissions
        var name: String {
            "Images/\(formattedName)"
        }

        private var formattedName: String {
            switch self {
            case .hiit:
                return "hiit"
            default:
                return format(name: rawValue)
            }
        }
    }

    private static func format(name: String) -> String {
        name.prefix(1).uppercased() + name.dropFirst()
    }
}

extension Color {
    init(asset: Asset.Color) {
        self.init(asset.name)
    }
}

extension Image {
    init(asset: Asset.Image) {
        self.init(asset.name)
    }
}
