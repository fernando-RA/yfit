//
//  OnboardingCard.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 9/30/21.
//

import SwiftUI
import UserNotifications

// Todo: delete this view
struct OnboardingCard: View {
    @Binding var firstTimeUser: Bool
    let center = UNUserNotificationCenter.current()
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
                    Text("Ative as notificações")
                        .font(.system(size: 20))
                        .fontWeight(.semibold)
                        .padding(.bottom, 11)
                        .padding(.top, 2)
                    VStack {
                        Text("Avisaremos quando houver uma aula chegando ou quando uma nova atividade estiver acontecendo em sua área.")
                            .multilineTextAlignment(.center)
                            .font(.system(size: 14))
                        Text("Que tal?")
                            .font(.system(size: 14))
                    }
//                    .frame(width: 234, height: 68)
                    Button("Permitir") {
                        firstTimeUser = false
                        center.requestAuthorization(options: [.alert, .sound, .badge]) { _, _ in
                            DispatchQueue.main.async {
                                UIApplication.shared.registerForRemoteNotifications()
                            }
                        }
                    }
                    .buttonStyle(RecGreenButtonStyle(width: 239, height: 40))
                    .padding(.top, 22)
                    .padding(.bottom, 24)
                }
            }
        }
        .frame(width: 285, height: 434, alignment: .center)
    }
}

struct OnboardingCard_Previews: PreviewProvider {
    static var previews: some View {
        OnboardingCard(firstTimeUser: .constant(true))
            .padding()
            .background(Color.primary)
    }
}
