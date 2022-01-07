import SwiftUI

struct UserMenuHeader: View {
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.presentationMode) var presentationMode: Binding<PresentationMode>
    let user: User?

    var body: some View {
        VStack {
            HStack {
                Button(action: {
                    presentationMode.wrappedValue.dismiss()
                }) {
                   Image(systemName: "chevron.left")
                    .font(Font.title3.weight(.semibold))
                }
                .padding([.leading, .top])
                Spacer()
            }
            HStack {
                if let user = user {
                    profilePicture(for: user)
                }
                label
                Spacer()
            }
            .padding()
        }
    }

    private func profilePicture(for user: User) -> some View {
        ProfilePicture(user: user, size: .big)
    }

    private var label: some View {
        Text(user?.fullName ?? "Menu")
                .font(.title2)
    }
}
