import SwiftUI
import MapKit

struct MapView: View {
    @Environment(\.gps) private var gps

    let classes: [TrainerClass]

    @Binding var selectedClass: TrainerClass?
    @State private var trackingMode = MapUserTrackingMode.follow
    @State private var region: MKCoordinateRegion = .init()
    @Binding var isOpen: Bool
    var body: some View {
        map
            .onLoad {
                if UserDefaults.standard.bool(forKey: "didLaunchBefore") {
                    gps.startLocation()
                        }
            }
            .edgesIgnoringSafeArea(.all)
            .navigationBarHidden(true)
    }

    private var map: some View {
        Map(
            coordinateRegion: $region,
            interactionModes: isOpen ? [] : .all,
            showsUserLocation: true,
            userTrackingMode: $trackingMode,
            annotationItems: classes.filter { $0.type == .inPerson }
        ) { item in
            MapAnnotation(coordinate: item.location?.location.coordinate ?? .init()) {
                VStack {
                    LazyView {
                        NavigationLink(destination: ClassStoryView(trainerClass: item, viewType: .reservable, trailingBarItem: AnyView(
                            SharingButton(url: item.classLink ?? "", styleIsCircle: true)
                        ))) {
                            annotationImage(for: item)
                        }
                    }
                }
            }
        }
    }

    private func annotationImage(for trainerClass: TrainerClass) -> some View {
        CachedImage(url: trainerClass.author.profilePictureURL ?? trainerClass.featuredPhotoURL, height: 60, width: 60)
        .overlay(
            Circle().stroke(Color.white, lineWidth: 8)
        )
        .clipShape(Circle())
    }
}

#if DEBUG

struct MapView_Previews: PreviewProvider {
    static var previews: some View {
        let trainerClass = TrainerClass.create()

        let view = MapView(
            classes: [trainerClass],
            selectedClass: .constant(trainerClass), isOpen: .constant(true)
        )

        return PreviewGroup(preview: view)
    }
}

#endif
