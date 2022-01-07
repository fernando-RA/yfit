import SwiftUI

struct ClassDetailsView: View {
    let trainerClass: TrainerClass
    var components: [StyleComponent] = StyleComponent.allCases
    var isReservableCard: Bool = true
    enum StyleComponent: CaseIterable {
        case price, location
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            HStack {
                Text(trainerClass.name)
                Spacer()
                if components.contains(.price) && isReservableCard {
                    classPrice
                }
            }
            .font( .title3.weight(.bold))
                if components.contains(.location) {
                    location
                        .font(.system(size: 14))
                }
                DateAndTimeLabel(trainerClass: trainerClass)
                    .font(.system(size: 14))
        }
    }

    private var location: some View {
        Group {
            trainerClass.location.map { location in
                Text(location.locationName)
            }
        }
    }
    private var classPrice: some View {
        Text(trainerClass.price.formatted())
    }
}

#if DEBUG

struct ClassDetailsInstaView_Previews: PreviewProvider {
    static var previews: some View {
        let `class` = TrainerClass.create(
            location: .create(locationName: "Parque Da Cidade Sarah Kubitschek"),
            name: "60 min Funcional"
        )
        return ClassDetailsView(trainerClass: `class`, isReservableCard: false)
    }
}

#endif
