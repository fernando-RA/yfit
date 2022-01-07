struct UserMenuState {
    var sections: [UserMenuSection] = []
    var destination: UserMenuOption?
    var isShowingRequiredProfile: Bool = false

    var title: String {
        user?.fullName ?? "Menu"
    }

    var user: User? {
        didSet {
            if let user = user {
                updateSections(for: user)
            } else {
                updateSectionsForGuest()
            }
        }
    }

    private mutating func updateSectionsForGuest() {
        sections = [
            .init(type: .account, options: [.signIn])
//            .init(type: .about, options: [.faq, .contact])
        ]
    }

    private mutating func updateSections(for user: User) {
        sections = [
            .init(type: .classes, options: [.Followers, .Following]),
            .init(type: .training, options: trainingOptions(for: user)),
            .init(type: .account, options: [/*.payments, */.settings, .signOut])
//            .init(type: .about, options: [.faq, .contact])
        ]
    }

    private func trainingOptions(for user: User) -> [UserMenuOption] {
        if user.userType == .trainer {
            return [.createClass, .profile, .viewClasses/*, .viewEarnings*/]
        } else {
            return [.createClass, .profile]
        }
    }
}
