//
//  ProfileFormAlert.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 9/19/21.
//

import SwiftUI

struct ProfileFormAlert: View {
    @StateObject var viewModel: EditProfileViewModel
    @Binding var showAlert: Bool
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 25.0)

                .foregroundColor(Color(asset: .bottomSheet))
            VStack {
                Spacer()
                Divider()
                    .edgesIgnoringSafeArea(.horizontal)
                Button("Completo") {
                    showAlert.toggle()
                }
                .font(.title2)
                .foregroundColor(.blue)
                .padding()
            }

            VStack {
                Text("Complete seu perfil para salvar")
                    .font(.title3)
                    .bold()
                    .padding(.top)
                    .padding(.bottom, 5)

                if viewModel.state.profilePictureURL == nil && viewModel.state.encodedProfilePicture == nil {
                    Text("Imagem do perfil")
                }

                if viewModel.state.firstName == "" {
                    Text("Primeiro nome")
                }

                if viewModel.state.lastName == "" {
                    Text("Ultimo nome")
                }

                if viewModel.state.bio == "" {
                    Text("Bio")
                }
                if !viewModel.state.stripePaymentsEnabled {
                    Text("Conta Stripe")
                }
                Spacer()
            }
            .padding(14)
        }
        .frame(width: 310, height: 235, alignment: .center)
    }
}

#if DEBUG
struct ProfileFormAlert_Previews: PreviewProvider {
    static var previews: some View {
        let viewModel = EditProfileViewModel(auth: AuthSessionManager.create(), client: InMemoryAPIClient()) {}
        ProfileFormAlert(viewModel: viewModel, showAlert: .constant(true) )
            .padding()
            .background(Color.black)
    }
}
#endif
