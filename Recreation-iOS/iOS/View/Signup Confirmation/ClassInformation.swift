import SwiftUI

struct ClassInformation: View {
    let trainerClass: TrainerClass
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(trainerClass.name)
                .font(.system(size: 24))
                .bold()
            DateAndTimeLabel(trainerClass: trainerClass)
            locationNotes
        }
        .foregroundColor(.white)
    }

    private var locationNotes: some View {
        Group {
            trainerClass.location.map { location in
                Text(location.locationName)
                    .font(.system(size: 12))
            }
        }
    }
}
