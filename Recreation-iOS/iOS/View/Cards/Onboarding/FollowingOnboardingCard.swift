//
//  FollowingOnboardingCard.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/7/21.
//

import SwiftUI
import OneSignal

struct FollowingOnboardingCard: View {
    @Environment(\.authManager) private var auth
    @Binding var isShowing: Bool

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 15)
                .fill(Color(asset: .bottomSheet))
            VStack {
                Image(asset: .followOnboardHero)
                    .resizable()
                    .scaledToFill()
                    .frame(width: nil, height: 217)
                    .clipped()
                Spacer()
                VStack {
                    VStack {
                        VStack {
                            Text("Siga Treinadores e seja")
                            Text("notificado sobre novas aulas")
                        }
                        .font(.system(size: 24).weight(.bold))
                        .frame(width: nil, height: 58, alignment: .leading)
                        .padding(.bottom, 5)

                        Text("Descubra quando seus Treinadores favoritos")
                            .font(.system(size: 16))
                        Text("postarem novas aulas")
                            .font(.system(size: 16))
                        }
                    .padding(.bottom, 31)
                    .multilineTextAlignment(.center)
                    Button("Ative as notificações") {
                        isShowing = false

                        OneSignal.promptForPushNotifications(userResponse: { accepted in
                            guard let userid = auth.signedInUser?.id else {
                                return
                            }
                        print("User accepted notifications: \(accepted)")
                            let externalUserId = "\(userid)" // You will supply the external user id to the OneSignal SDK

                            // Setting External User Id with Callback Available in SDK Version 3.0.0+
                            OneSignal.setExternalUserId(externalUserId, withSuccess: { results in
                                print("👇👇👇👇👇👇👇👇👇👇👇👇")
                                // The results will contain push and email success statuses
                                print("External user id update complete with results: ", results!.description)
                                // Push can be expected in almost every situation with a success status, but
                                // as a pre-caution its good to verify it exists
                                if let pushResults = results!["push"] {
                                    print("Set external user id push status: ", pushResults)
                                }
                                if let emailResults = results!["email"] {
                                    print("Set external user id email status: ", emailResults)
                                }
                                if let smsResults = results!["sms"] {
                                    print("Set external user id sms status: ", smsResults)
                                }
                            }, withFailure: {error in
                                print("Set external user id done with error: " + error.debugDescription)
                            })
                        })
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

struct FollowingOnboardingCard_Previews: PreviewProvider {
    static var previews: some View {
        FollowingOnboardingCard(isShowing: .constant(true))
            .padding(200)
            .background(Color.black)
    }
}
