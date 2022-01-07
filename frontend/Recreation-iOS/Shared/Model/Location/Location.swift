import MapKit
import Contacts

struct Location: Equatable, Codable {
    var lat: Double
    var lng: Double
    var locationName: String

    var latitude: Double {
        lat
    }

    var longitude: Double {
        lng
    }

    var coordinates: CLLocationCoordinate2D {
        get {
            .init(latitude: lat, longitude: lng)
        }
        set {
            lat = newValue.latitude
            lng = newValue.longitude
        }
    }

    var location: CLLocation {
        CLLocation(latitude: latitude, longitude: longitude)
    }

    var region: MKCoordinateRegion {
        MKCoordinateRegion(
            center: location.coordinate,
            latitudinalMeters: regionRadius,
            longitudinalMeters: regionRadius
        )
    }

    private var regionRadius: CLLocationDistance {
        100
    }
}

#if DEBUG

extension Location {
    static func create(lat: Double = 40.5,
                       lng: Double = 50.7,
                       locationName: String = "NYC, NY, USA") -> Self {
        Self(
            lat: lat,
            lng: lng,
            locationName: locationName
        )
    }
}

#endif
