import SwiftUI

struct OnboardingRouter<Destination: View>: View {
    @StateObject var viewModel: OnboardingViewModel

    let destination: Destination

    var body: some View {
        VStack {
            destinationNavigation
            profileRegistrationNavigation
        }
    }

    private var profileRegistrationNavigation: some View {
        VStack {
            NavigationLink(
                destination: LazyView {
                    nameForm
                },
                isActive: $viewModel.state.isShowingNameInputForm,
                label: { EmptyView() }
            )
            emptyNavigation
        }
    }

    private var nameForm: some View {
        VStack {
            OnboardingNamePage(
                state: viewModel.state.nameForm,
                actionName: "Registrar",
                onSave: { form in
                    viewModel.send(.updateUser(form))
                }
            )
            destinationNavigation
        }
        .navigationBarBackButtonHidden(true)
    }

    private var destinationNavigation: some View {
        VStack {
            NavigationLink(
                destination: destination,
                isActive: $viewModel.state.isShowingApplication,
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
