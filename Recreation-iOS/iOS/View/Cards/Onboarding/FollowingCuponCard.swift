//
//  FollowingCuponCard.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/7/21.
//

import SwiftUI

struct FollowingCuponCard: View {
    @Binding var isShowing: Bool
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 15)
                .fill(Color(asset: .bottomSheet))
            VStack {
                Image(asset: .notificationHero)
                    .resizable()
                    .scaledToFill()
                    .frame(width: 285, height: 217)
                    .clipped()
                Spacer()
                VStack {
                    Text("Siga 2 ou mais Personal Trainers para ganhar 25% de desconto na sua próxima aula!")
                        .font(.system(size: 20))
                        .fontWeight(.semibold)
                        .padding(.top, 22)
                    .multilineTextAlignment(.center)
                    .frame(width: 210)
                    Button("Concluído") {
                        isShowing.toggle()
                    }
                    .buttonStyle(RecGreenButtonStyle(width: 239, height: 40))
                    .padding(.top, 37)
                    .padding(.bottom, 24)
                }
            }
        }
        .frame(width: 285, height: 434, alignment: .center)
    }
}

struct FollowingCuponCard_Previews: PreviewProvider {
    static var previews: some View {
        FollowingCuponCard(isShowing: .constant(true))
    }
}
