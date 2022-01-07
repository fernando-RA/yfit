import SwiftUI

struct UserMenuRow: View {
    let option: UserMenuOption
    let onTap: (UserMenuOption) -> Void

    var body: some View {
        Button(action: {
            onTap(option)
        }, label: {
            content
        })
    }

    private var content: some View {
        HStack {
            Text(option.title)

            if hasChevron {
                Spacer()
                chevron
            }
        }
    }

    private var hasChevron: Bool {
        ![.signOut, .signIn].contains(option)
    }

    private var chevron: some View {
        Image(systemName: "chevron.right")
            .foregroundColor(.secondary)
    }
}
