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
                Text("Stripe connects to your bank account so you can get paid.")
                    .font(.system(size: 20))
                    .fontWeight(.semibold)
                    .padding(.bottom, 16)
                    .padding(.top, 37)
                VStack(alignment: .leading, spacing: 10) {
                    Text("Tips to connect with Stripe:")

                    VStack(alignment: .leading) {
                        HStack(alignment: .top) {
                            Text("1.")
                            Text("Solo trainers: enter") +
                                Text(" “Individual”").bold() +
                                Text(" for Type of business")
                        }
                        HStack(alignment: .top) {
                            Text("2.")
                            Text("Enter a ") + Text("website or social account").bold() + Text(" for Business website. Eg, www.instagram.com/username ")
                        }
                        HStack(alignment: .top) {
                            Text("3.")
                            Text("Have your ") + Text("debit card ").bold() + Text("or ") + Text("account and routing numbers ").bold() + Text("ready.")
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
                            Text("Stripe is connected")
                                .fontWeight(.bold)
                                .foregroundColor(.black)
                        } else {
                            Text("Connect to Stripe")
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

            .navigationTitle("Stripe account")
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
