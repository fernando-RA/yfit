import SwiftUI

struct CheckoutClassDetails: View {
    let trainerClass: TrainerClass

    var body: some View {
        VStack(alignment: .leading) {
            Text(trainerClass.author.fullName)
            Text(trainerClass.startTime.formattedDay)
            Text(trainerClass.formattedHours)
        }
        .font(.system(size: 16))
    }
}

#if DEBUG

struct CheckoutClassDetails_Previews: PreviewProvider {
    static var previews: some View {
        let trainerClass = TrainerClass.create()
        let view = CheckoutClassDetails(trainerClass: trainerClass)
        return PreviewGroup(preview: view)
    }
}

#endif
