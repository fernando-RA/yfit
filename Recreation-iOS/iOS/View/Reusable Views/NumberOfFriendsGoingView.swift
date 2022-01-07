//
//  SwiftUIView.swift
//  Recreation-iOS (iOS)
//
//  Created by Stephanie Ballard on 5/26/21.
//

import SwiftUI

struct NumberOfFriendsGoingView: View {
    @State var numberOfFriendsGoing: Int

    var body: some View {
        VStack {
            HStack {
                switch numberOfFriendsGoing {
                case 1:
                    Image("ChrissyCardView")
                        .resizable()
                        .scaledToFill()
                        .frame(width: 20, height: 20, alignment: .center)
                        .clipShape(Circle())
                        .padding(-7)
                    Text("  \(numberOfFriendsGoing) friend is going").font(.system(size: 12))
                case 2:
                    Image("ChrissyCardView")
                        .resizable()
                        .scaledToFill()
                        .frame(width: 20, height: 20, alignment: .center)
                        .clipShape(Circle())
                        .padding(-7)
                    Image("ChrissyCardView")
                        .resizable()
                        .scaledToFill()
                        .frame(width: 20, height: 20, alignment: .center)
                        .clipShape(Circle())
                        .padding(-7)
                    Text("  \(numberOfFriendsGoing) friends going").font(.system(size: 12))
                case 3...250:
                    Image("ChrissyCardView")
                        .resizable()
                        .scaledToFill()
                        .frame(width: 20, height: 20, alignment: .center)
                        .clipShape(Circle())
                        .padding(-7)
                    Image("ChrissyCardView")
                        .resizable()
                        .scaledToFill()
                        .frame(width: 20, height: 20, alignment: .center)
                        .clipShape(Circle())
                        .padding(-7)
                    Image("ChrissyCardView")
                        .resizable()
                        .scaledToFill()
                        .frame(width: 20, height: 20, alignment: .center)
                        .clipShape(Circle())
                        .padding(-7)
                    Text("\(numberOfFriendsGoing) friends going").font(.system(size: 12))
                default:
                    Image("")
                    Text("")
                }
                Spacer()
            }
        }
    }
}
