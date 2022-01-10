import SwiftUI

struct OtherClassesView: View {
    let trainerClass: TrainerClass

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("MAIS AULAS DE \(trainerClass.author.firstName)")
                .textCase(.uppercase)
                .foregroundColor(Color(asset: Asset.Color.lightGray))
                .font(.system(size: 12))
            otherClassPhoto
            HStack {
                Text(trainerClass.name)
                Spacer()
                Text(trainerClass.price.formatted)
            }
            .font(.system(size: 20, weight: .semibold))
            VStack(alignment: .leading, spacing: 8) {
                Text(trainerClass.location?.locationName ?? "")
                Text(trainerClass.startTime.formatted)
            }.font(.system(size: 14))
            HStack {
                Spacer()
                Image(systemName: "ellipsis")
                    .foregroundColor(.white)
                Spacer()
            }
        }
        .foregroundColor(.white)
    }

    private var otherClassPhoto: some View {
        Group {
            trainerClass.featuredPhotoURL.map { url in
                CachedImage(url: url)
                    .scaledToFill()
                    .frame(width: UIScreen.main.bounds.width - 30, height: 380)
                    .cornerRadius(36)
            }
        }
    }
}
