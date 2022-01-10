//
//  ConnectStripeView.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 9/18/21.
//

import SwiftUI

struct ConnectStripeView: View {
    @Environment(\.presentationMode) var presentationMode: Binding<PresentationMode>
    @StateObject var viewModel: EditProfileViewModel

    var body: some View {
        ZStack {
            stripeNavLink
            VStack(alignment: .leading) {
                Text("Stripe se conecta a sua conta bancaria e permite que voce recba pagementos atraves dela.")
                    .font(.system(size: 20))
                    .fontWeight(.semibold)
                    .padding(.bottom, 16)
                    .padding(.top, 37)
                VStack(alignment: .leading, spacing: 10) {
                    Text("Dicas para conectar sua propria conta stripe:")

                    VStack(alignment: .leading) {
                        HStack(alignment: .top) {
                            Text("1.")
                            Text("Personal trainers: insira") +
                                Text(" “Individual”").bold() +
                                Text(" para Tipo de conta.")
                        }
                        HStack(alignment: .top) {
                            Text("2.")
                            Text("Enter a ") + Text("Site ou conta de midia social").bold() + Text(" para o site de negócios. Por exemplo, www.instagram.com/username")
                        }
                        HStack(alignment: .top) {
                            Text("3.")
                            Text("Tenha em maos seu") + Text("cartão de débito ").bold() + Text("ou ") + Text("dados da conta bancária").bold() + Text("prontos.")
                        }
                    }
                    .padding(.leading, 7)
                }
                .font(.system(size: 16))

                Button(action: {
                    viewModel.state.isLoadingStripe = true
                    viewModel.send(.connectStripeAccount)
                }, label: {
                    ZStack {
                        Capsule()
                            .foregroundColor(Color(asset: .recGreen))
                            .frame(width: 355, height: 40, alignment: .center/*@END_MENU_TOKEN@*/)
                        if viewModel.state.isLoadingStripe {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: Color.black))
                        } else if viewModel.state.stripePaymentsEnabled {
                            Text("Stripe está conectado")
                                .fontWeight(.bold)
                                .foregroundColor(.black)
                        } else {
                            Text("Conectar ao Stripe")
                            .fontWeight(.bold)
                            .foregroundColor(.black)
                    }
                    }
                })
                .disabled(viewModel.state.stripePaymentsEnabled)
                .padding(.top, 29)
                Spacer()
            }
            .padding(.horizontal, 16)

            .navigationTitle("Conta stripe")
            .onAppear {
                if viewModel.state.showProfile {
                    presentationMode.wrappedValue.dismiss()
                }
                viewModel.send(.getUserAcct)
                DispatchQueue.main.async {
                viewModel.send(.getStripeAccount)
                }
            }
        }
    }

    private var stripeNavLink: some View {
        VStack {
            NavigationLink(
                destination: stripeWebView,
                isActive: .notNil($viewModel.state.stripeLink),
                label: { EmptyView() })
           // emptyNavigation
        }
    }

    private var stripeWebView: some View {
        Group {
            if let url = viewModel.state.stripeLink {
                WebView(url: url, token: viewModel.state.accessToken) { url in
                    viewModel.send(.handleStripeFormUrl(url))
                }
            }
        }
        .onDisappear {
            viewModel.state.showProfile = true
        }
    }
}

#if DEBUG

struct ConnectStripeView_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: preview)
    }

    private static var preview: some View {
        let client = InMemoryAPIClient()
        let auth = AuthSessionManager.create()

        auth.session = .signedIn(User.create(
            firstName: "Karl",
            lastName: "Rivest Harnois",
            userType: .trainer
        ))

        let viewModel = EditProfileViewModel(auth: auth, client: client) {}

        return NavigationView {
            ConnectStripeView(viewModel: viewModel)
        }
    }
}

#endif
