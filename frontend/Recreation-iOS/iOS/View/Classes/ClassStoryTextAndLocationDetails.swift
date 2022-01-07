import SwiftUI
import MapKit
import Kingfisher

struct ClassStoryTextAndLocationDetails: View {
    @Environment(\.apiClient) var client
    @Environment(\.authManager) var sessionManager
    let trainerClass: TrainerClass
    let viewType: ClassViewType
    let onReservation: () -> Void

    var body: some View {
        classDetails
            .padding(.top)
    }

    private func mapView(for location: Location) -> some View {
        Map(
            coordinateRegion: .constant(location.region),
            interactionModes: [],
            showsUserLocation: false,
            userTrackingMode: nil,
            annotationItems: [trainerClass]
        ) { item in
            MapAnnotation(coordinate: location.location.coordinate) {
                VStack {
                    CachedImage(url: item.featuredPhotoURL, height: 60, width: 60)
                        .overlay(
                            Circle().stroke(Color.white, lineWidth: 8)
                        )
                        .clipShape(Circle())
                }
            }
        }
        .cornerRadius(20)
        .frame(width: nil, height: 250)
        .padding(.vertical, 30)
    }

    private var classDetails: some View {
        VStack(alignment: .leading) {
            ScrollView {
                VStack(spacing: 30) {
                    VStack(alignment: .leading) {
                        Text("Class Type")
                            .font(.callout)
                        switch trainerClass.tags.count {
                        case 0:
                            TagGrid(trainerClass: trainerClass)
                                .frame(maxHeight: 0)
                        case 1...4:
                            TagGrid(trainerClass: trainerClass)
                                .frame(maxHeight: 50)
                        default:
                            TagGrid(trainerClass: trainerClass)
                                .frame(idealHeight: 100)
                        }
                    }
                    .padding(.vertical, 25)
                    .padding(.bottom)
                    .padding(.top)
                    VStack(alignment: .leading) {
                        Text(trainerClass.details)
                            .fixedSize(horizontal: false, vertical: true)
                        StoryDetailsLabel(title: "What you need", details: trainerClass.equipment ?? "")
                        Text("Location")
                            .font(.callout)
                            .fontWeight(.bold)
                        if let location = trainerClass.location {
                            mapView(for: location)
                        }
                        VStack(alignment: .leading, spacing: nil) {
                            Text(trainerClass.location?.locationName ?? "")
                                .font(.title3)
                                .fontWeight(.bold)
                                .padding(.bottom)
                            Text(trainerClass.locationNotes ?? "")
                            StoryDetailsLabel(title: "Cancellation Policy", details: "Speak with your trainer before class")
                            StoryDetailsLabel(title: "Health and Safety",
                                              details: trainerClass.safetyProtocol ?? "")
                        }
                        .fixedSize(horizontal: false, vertical: true)
                    }
                    HStack {
                        Text("Upcoming classes from \(trainerClass.author.fullName)")
                        .font(.headline)
                        .bold()
                        Spacer()
                    }
                    ScrollView(.horizontal) {
                        otherClasses
                    }
                }
                .foregroundColor(.white)
                .padding()
            }

            if viewType == .reservable {
                reserveButton
            }
        }
    }

    private var reserveButton: some View {
        ReserveButton(class: trainerClass, action: onReservation)
            .padding(.bottom, 20)
            .padding(.horizontal)
    }

    private var otherClasses: some View {
        let trainerClassFeedViewModel = OtherEventsFromUserViewModel(client: client, user: trainerClass.author)
        let classFeedViewModel = EventsViewModel(client: client)
        let matchesVM = MatchesViewModel(client: client, auth: sessionManager)

        return OtherClassesFromTrainer(trainerClassFeedViewModel: trainerClassFeedViewModel, classFeedViewModel: classFeedViewModel, matchesVM: matchesVM, trainer: trainerClass)
    }
}

#if DEBUG

struct ClassStoryTextAndLocationDetails_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: preview)
    }

    private static var preview: some View {
        let trainerClass = TrainerClass.create()

        return ClassStoryTextAndLocationDetails(
            trainerClass: trainerClass,
            viewType: .reservable,
            onReservation: {}
        ) .background(Color.black)
    }
}

#endif
