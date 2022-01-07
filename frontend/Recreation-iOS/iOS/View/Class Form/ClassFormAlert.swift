//
//  ClassFormAlert.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 9/28/21.
//

import SwiftUI

struct ClassFormAlert: View {
    @StateObject var viewModel: ClassFormViewModel
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
                Text("Preencha os campos a seguir para visualizar sua aula")
                    .font(.title3)
                    .bold()
                    .padding(.top)
                    .padding(.bottom, 5)
                    .multilineTextAlignment(.center)

                if viewModel.state.class.name == "" {
                    Text("Titulo da aula")
                }
                if viewModel.state.class.details == "" {
                    Text("Descrição da")
                }
                if viewModel.state.class.location == nil {
                    Text("Localização")
                }
                if viewModel.state.encodedFeaturedPhoto == nil {
                    Text("Foto em destaque")
                }
                if viewModel.state.class.equipment == ""{
                    Text("Equipamento necessário")
                }
                Spacer()
            }
            .padding(14)
        }
        .frame(width: 310, height: 245, alignment: .center)
    }
    }

#if DEBUG
struct ClassFormAlert_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: NavigationView {
            preview
        })
    }

    private static var preview: some View {
        let client = InMemoryAPIClient()
        let author = User.create()
        let viewModel = ClassFormViewModel(client: client, type: .create(author: author)) {}
        return ClassFormAlert(viewModel: viewModel, showAlert: .constant(true))
    }
}
#endif
