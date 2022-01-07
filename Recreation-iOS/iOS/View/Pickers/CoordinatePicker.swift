import SwiftUI
import MapKit
import Combine

struct CoordinatePicker: UIViewRepresentable {
    @Binding var coordinates: CLLocationCoordinate2D?
    @Environment(\.gps) private var gps

    func makeCoordinator() -> Coordinator {
        .init(coordinates: $coordinates, gps: gps)
    }

    func makeUIView(context: Context) -> MKMapView {
        context.coordinator.map
    }

    func updateUIView(_ uiView: MKMapView, context: Context) {}

    final class Coordinator: NSObject, MKMapViewDelegate {
        let map = MKMapView()

        @Binding private var coordinates: CLLocationCoordinate2D?

        private let pin = MKPointAnnotation()
        private var cancellables = Set<AnyCancellable>()

        init(coordinates: Binding<CLLocationCoordinate2D?>, gps: GPS) {
            self._coordinates = coordinates
            super.init()
            map.delegate = self

            if let coordinates = self.coordinates {
                mapSetup(coordinates: coordinates)
            } else if let location = gps.state.currentLocation {
                /*
                 If coordinates haven't been selected yet we start with the user's
                 location as defaults.
                 */
                mapSetup(coordinates: location.coordinate)
            } else {
                /*
                 Use central park as default coordinates if user location authorization
                 is denied and coordinates are not selected yet.
                 */
                mapSetup(coordinates: .centralPark)
            }
        }

        func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
            let pin = MKPinAnnotationView(annotation: annotation, reuseIdentifier: "pin")
            pin.isDraggable = true
            pin.pinTintColor = UIColor(Color(asset: .accentColor))
            pin.animatesDrop = true
            return pin
        }

        func mapView(_ mapView: MKMapView, annotationView view: MKAnnotationView, didChange newState: MKAnnotationView.DragState, fromOldState oldState: MKAnnotationView.DragState) {
            guard let newCoordinates = view.annotation?.coordinate else {
                return
            }
            coordinates = newCoordinates
        }

        private func mapSetup(coordinates: CLLocationCoordinate2D) {
            guard !pinIsOnMap else { return }
            self.coordinates = coordinates
            setRegion(to: coordinates)
            addPin(on: coordinates)
        }

        private var pinIsOnMap: Bool {
            map.annotations.contains { $0 === pin }
        }

        private func setRegion(to coordinates: CLLocationCoordinate2D) {
            let span = MKCoordinateSpan(latitudeDelta: 0.1, longitudeDelta: 0.1)
            let region = MKCoordinateRegion(center: coordinates, span: span)
            map.setRegion(region, animated: true)
        }

        private func addPin(on coordinates: CLLocationCoordinate2D) {
            pin.coordinate = coordinates
            map.addAnnotation(pin)
        }
    }
}
