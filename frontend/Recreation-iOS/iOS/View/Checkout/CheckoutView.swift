import SwiftUI

struct CheckoutView: View {
    @StateObject var viewModel: CheckoutViewModel
    @Binding var isPresented: Bool

    var body: some View {
        ZStack {
            ScrollView {
                content
            }
            if viewModel.state.isLoading {
                LoadingPage()
            }
        }
        .alert($viewModel.state.error)
        .onLoad {
            viewModel.send(.setup)
        }
        .navigationBarTitle("Confirmar e concluir pagamento", displayMode: .inline)
        .navigationBarBackButtonHidden(viewModel.state.isLoading)
    }

    private var content: some View {
        VStack(alignment: .leading, spacing: 10) {
            sections
            Spacer()
            contactInfoFormNavLink
            confirmationNavLink
        }
    }

    private var sections: some View {
        CheckoutSectionsView(viewModel: viewModel)
    }

    private var contactInfoFormNavLink: some View {
        VStack {
            NavigationLink(
                destination: contactInfoForm,
                isActive: $viewModel.state.showContactInfoForm,
                label: { EmptyView() }
            )
            emptyNavigation
        }
    }

    private var contactInfoForm: some View {
        EditContactForm(contactInfo: viewModel.state.contactInfo, onSave: { contactInfo, saveContactInfo in
            viewModel.send(.save(contactInfo, saveContactInfo))
        })
    }

    private var confirmationNavLink: some View {
        VStack {
            NavigationLink(
                destination: confirmationPage,
                isActive: $viewModel.state.showCheckoutConfirmation,
                label: { EmptyView() }
            )
            emptyNavigation
        }
    }

    private var confirmationPage: some View {
        SignupConfirmationPage(trainerClass: viewModel.state.trainerClass, contactInfo: viewModel.state.contactInfo, isPresented: $isPresented)
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

struct QuickCheckoutView_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: preview)
    }

    private static var preview: some View {
        let viewModel = CheckoutViewModel(
            trainerClass: .create(price: 2000.cents),
            dependencies: .init(
                paymentProvider: InMemoryPaymentProvider(),
                auth: .create(),
                client: InMemoryAPIClient()
            )
        )

        return NavigationView {
            CheckoutView(viewModel: viewModel, isPresented: .constant(true))
        }
    }
}

#endif
