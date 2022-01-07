import SwiftUI

struct ClassStoryVideoOverlayView: View {
    @Environment(\.matches) var matches
    let trainerClass: TrainerClass
    let viewType: ClassViewType
    let onReserveTap: () -> Void

    var body: some View {
        ZStack {
            VStack {
                if trainerClass.trendingOverride == true {
                HStack {
                    TrendingBadge()
                        .padding(.bottom, 5)
                    Spacer()
                }
                }
                trainer
                classDetails
                if viewType == .reservable {
                    reserveButton
                }
            }
            .padding()
        }
    }

    private var trainer: some View {
        TrainerLabelView(trainer: trainerClass.author, color: Color(.white), followingColor: Color.white)
            .foregroundColor(.white)
    }

    private var classDetails: some View {
        ClassDetailsView(trainerClass: trainerClass, components: [.location])
            .foregroundColor(.white)
    }

    private var reserveButton: some View {
        ReserveButton(class: trainerClass, action: onReserveTap)
    }
}

#if DEBUG

struct ClassStoryVideoOverlayView_Previews: PreviewProvider {
    static var previews: some View {
        let trainerClass = TrainerClass.create()
        let view = ClassStoryVideoOverlayView(trainerClass: trainerClass, viewType: .reservable, onReserveTap: {})
            .background(Color.black)
        return PreviewGroup(preview: view)
    }
}

#endif
