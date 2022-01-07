//
//  LocationPermissionCard.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/8/21.
//

import SwiftUI
import CoreLocation
struct LocationPermissionCard: View {
    @Binding var isShowing: Bool
    @Environment(\.gps) var gps
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 15)
                .fill(Color(asset: .bottomSheet))
            VStack {
                Image(asset: .localPermissions)
                    .resizable()
                    .scaledToFill()
                    .frame(width: 336, height: 217)
                    .clipped()
                Spacer()
                VStack {
                    VStack {
                        VStack {
                            Text("Encontre as aulas fitess")
                            Text("mais próximas de você")
                        }
                        .font(.system(size: 24).weight(.bold))
                        .frame(width: nil, height: 58, alignment: .leading)
                        .padding(.bottom, 5)

                        Text("Agende treinos em locais")
                            .font(.system(size: 16))
                        Text("próximos de você")
                            .font(.system(size: 16))
                        }
                    .padding(.bottom, 31)
                    .multilineTextAlignment(.center)
                    Button("Ative Localização do dispositivo") {
                        isShowing = false
                        gps.startLocation()
                        }
                    .buttonStyle(RecGreenButtonStyle(width: 248, height: 40))
                    .padding(.bottom, 24)
                }
                .padding(.top, 18)
            }
    }
        .frame(width: 336, height: 434, alignment: .center)
    }
}

#if DEBUG
struct LocationPermissionCard_Previews: PreviewProvider {
    static var previews: some View {
        LocationPermissionCard(isShowing: .constant(true))
    }
}
#endif
