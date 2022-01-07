//
//  SharingButton.swift
//  SharingButton
//
//  Created by Mike  Van Amburg on 7/19/21.
//

import SwiftUI

struct SharingButton: View {
    var url: String
    var styleIsCircle: Bool = true
    var body: some View {
        Button(action: actionSheet) {
            if styleIsCircle {
                ZStack {
                    Circle()
                        .fill(style: FillStyle())
                        .frame(width: 40, height: 40, alignment: .center)
                            Image(systemName: "square.and.arrow.up")
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 20, height: 20)
                                .foregroundColor(.black)
                        }
                .foregroundColor(.white)
            } else {
                Image(systemName: "square.and.arrow.up")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 20, height: 20)
            }
        }
    }
    func actionSheet() {
           guard let urlShare = URL(string: url) else { return }
           let activityVC = UIActivityViewController(activityItems: [urlShare], applicationActivities: nil)
           UIApplication.shared.windows.first?.rootViewController?.present(activityVC, animated: true, completion: nil)
       }
}

#if DEBUG
struct SharingButton_Previews: PreviewProvider {
    static var previews: some View {
        SharingButton(url: "https://developer.apple.com/xcode/swiftui/").padding().background(Color.black)
    }
}
#endif
