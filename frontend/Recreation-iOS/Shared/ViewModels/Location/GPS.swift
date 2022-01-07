import CoreLocation
import MapKit

final class GPS: NSObject, ObservableObject {
    static let shared = GPS()

    @Published var state = GPSState()
    private let manager = CLLocationManager()

    override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBest
    }

    var isAuthorized: Bool {
        let status = manager.authorizationStatus
        #if os(iOS)
        return status == .authorizedAlways || status == .authorizedWhenInUse
        #endif

        #if os(macOS)
        return status == .authorizedAlways || status == .authorized
        #endif
    }

    var isUnAuthorized: Bool {
        let status = manager.authorizationStatus
        return status == .denied
    }

    var unDecidedAuthorization: Bool {
        let status = manager.authorizationStatus
        return status == .notDetermined
    }

    func startLocation() {
        if isAuthorized {
            manager.startUpdatingLocation()
        } else if isUnAuthorized {
            state.invalidPermission = true
        } else {
            manager.requestWhenInUseAuthorization()
        }
    }

    func searchQuery() {
        state.classes.removeAll()

        let request = MKLocalSearch.Request()
        request.naturalLanguageQuery = state.searchedLocal
        MKLocalSearch(request: request).start { response, _  in
            guard let results = response else { return }
            self.state.classes = results.mapItems.compactMap({ item in
                return Locals(placemarker: item.placemark)
            })
        }
    }

    func selectLocal(local: Locals) {
        state.annotation.removeAll()
        state.searchedLocal = ""
        guard let coordinate = local.placemarker.location?.coordinate else {
            return
        }
        let pointAnnotation = MKPointAnnotation()
        pointAnnotation.coordinate = coordinate
        state.searchedLocal = local.placemarker.name ?? ""
        state.selectedLocal = local.placemarker.location ?? .init()
        state.selectedRegion = MKCoordinateRegion(center: local.placemarker.location!.coordinate, latitudinalMeters: 1000, longitudinalMeters: 1000)
        let chosenLocal = Locals(id: local.id, placemarker: local.placemarker)
        state.annotation.append(chosenLocal)
        state.local = Locals(id: local.id, placemarker: local.placemarker)
    }
}

extension GPS: CLLocationManagerDelegate {
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        if isAuthorized {
            manager.startUpdatingLocation()
        }
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        guard let clError = error as? CLError else { return }

        switch clError {
        case CLError.denied:
            print("Access denied")
            startLocation()
        default:
            print("Catching location error: \(clError)")
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        state.currentLocation = locations.last
        state.currentRegion = MKCoordinateRegion(center: state.currentLocation?.coordinate ?? .init(), latitudinalMeters: 1000, longitudinalMeters: 1000)
    }
}
