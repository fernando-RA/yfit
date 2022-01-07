//
//  ClassCard.swift
//  Recreation-iOS
//
//  Created by Mike  Van Amburg on 8/4/21.
//

import SwiftUI

struct ClassCard: View {
    @Environment(\.colorScheme) var colorScheme
    @StateObject var viewModel: MatchesViewModel
    let trainerClass: TrainerClass
    let reserveAction: () -> Void

    var body: some View {
        VStack(spacing: 25) {
            NavigationLink(destination:
                            ClassStoryView(trainerClass: trainerClass, viewType: .reservable, trailingBarItem: AnyView(
                                SharingButton(url: trainerClass.classLink ?? "", styleIsCircle: true)
                            ))
            ) {
                featuredPhoto
            }
            emptyNavigation
            classDetails
        }
        .padding(.trailing, 6)
        .frame(width: 310)
    }

    private var trainer: some View {
        TrainerLabelView(trainer: trainerClass.author)
    }

    private var featuredPhoto: some View {
        ZStack(alignment: .topTrailing) {
            CachedImage(url: trainerClass.featuredPhotoURL, height: 300, width: 300)
                .cornerRadius(25)
            if trainerClass.trendingOverride == true {
            TrendingBadge()
                .padding(23)
            }
        }
    }

    private var classDetails: some View {
        ClassDetailsView(trainerClass: trainerClass, isReservableCard: false)
    }

    private var reserveButton: some View {
        Button(action: reserveAction) {
            ZStack {
                Capsule()
                    .stroke(colorScheme == .light ? Color.black : Color.white)
                    .frame(height: 48)

                Text(trainerClass.isSoldOut ? "Esgotado" : "Reservar")
                    .foregroundColor(colorScheme == .light ? .black : .white)
            }
        }
        .disabled(trainerClass.isSoldOut)
    }
    /*
     This is a hacky fix for a SwiftUI navigation bug.
     https://developer.apple.com/forums/thread/677333
     */
    private var emptyNavigation: some View {
        NavigationLink(destination: EmptyView()) {
            EmptyView()
        }
    }
}

// #if DEBUG
// struct ClassCard_Previews: PreviewProvider {
//        static var previews: some View {
//            PreviewGroup(preview: preview)
//        }
//
//        private static var preview: some View {
//            let trainerClass = TrainerClass.create()
//            return ClassCard(trainerClass: trainerClass, reserveAction: {})
//        }
// }
// #endif
