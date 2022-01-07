import SwiftUI

struct ReservableClassCard: View {
    @Environment(\.colorScheme) var colorScheme
    var showTrainer: Bool = true
    let trainerClass: TrainerClass
    let reserveAction: () -> Void

    var body: some View {
        VStack {
            if showTrainer {
                trainer
                    .padding(.bottom, 17)
            }
            NavigationLink(destination:
                            ClassStoryView(trainerClass: trainerClass, viewType: .reservable, trailingBarItem: AnyView(
                                SharingButton(url: trainerClass.classLink ?? "", styleIsCircle: true)
                            ))
            ) {
                featuredPhoto
                    .frame(width: 345, height: 345, alignment: .center)
            }
            emptyNavigation
            classDetails
                .padding(.top, 24)
                .padding(.bottom, 32)
            reserveButton
                .padding(.bottom, 52)
            Divider().frame(height: 8)
        }
        .padding(.top, 34)
        .frame(width: 345, height: nil, alignment: .center)
    }

    private var trainer: some View {
        TrainerLabelView(trainer: trainerClass.author)
    }

    private var featuredPhoto: some View {
        ZStack(alignment: .topTrailing) {
            CachedImage(url: trainerClass.featuredPhotoURL, height: 345, width: 345)
                .cornerRadius(25)
            if trainerClass.trendingOverride == true {
            TrendingBadge()
                .padding(23)
            }
        }
    }

    private var classDetails: some View {
        ClassDetailsView(trainerClass: trainerClass)
    }

    // Todo: add this to a buttonstyle
    private var reserveButton: some View {
        Button(action: reserveAction) {
            ZStack {
                Capsule()
                    .stroke(colorScheme == .light ? Color.black : Color.white)
                    .frame(height: 48)

                Text(trainerClass.isSoldOut ? "Esgotado" : "Reservar")
                    .font(Font.body.weight(.bold))
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

#if DEBUG

struct ClassCardView_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: preview)
    }

    private static var preview: some View {
        let trainerClass = TrainerClass.create()
        return ReservableClassCard(trainerClass: trainerClass, reserveAction: {})
    }
}

#endif
