enum UserMenuOption: String, Identifiable {
    case upcomingClasses = "Upcoming"
    case pastClasses = "Past"
    case createClass = "Create a class"
    case viewClasses = "View your classes"
    case viewEarnings = "View earnings"
    case profile = "Profile"
    case payments = "Payments"
    case settings = "Settings"
    case faq = "FAQ"
    case contact = "Contact"
    case signOut = "Sign out"
    case signIn = "Sign in"
    case Followers = "Followers"
    case Following = "Following"

    var title: String {
        rawValue
    }

    var id: String {
        rawValue
    }
}
