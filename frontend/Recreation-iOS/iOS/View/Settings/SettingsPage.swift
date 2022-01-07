import SwiftUI

struct SettingsPage: View {
    @StateObject var viewModel: SettingsViewModel

    var body: some View {
        ZStack {
            editContactInfoNavLink
            list
        }
        .navigationBarTitle("Settings", displayMode: .inline)
    }

    private var list: some View {
        List {
            if viewModel.state.canEditContactInfo {
                Section {
                    Button("Edit contact information") {
                        viewModel.state.isEditingContactInfo = true
                    }
                }
            }
        }
    }

    private var editContactInfoNavLink: some View {
        Group {
            NavigationLink(
                destination: EditContactForm(
                    contactInfo: viewModel.state.contactInfo,
                    onSave: viewModel.save
                ),
                isActive: $viewModel.state.isEditingContactInfo,
                label: { EmptyView() }
            )
            emptyNavigation
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

struct SettingsPage_Previews: PreviewProvider {
    static var previews: some View {
        let viewModel = SettingsViewModel(auth: .create())

        return PreviewGroup(preview: NavigationView {
            SettingsPage(viewModel: viewModel)
        })
    }
}

#endif
