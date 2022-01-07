import SwiftUI

struct GPSEnvironmentKey: EnvironmentKey {
    static let defaultValue = GPS.shared
}

extension EnvironmentValues {
    var gps: GPS {
        get {
            self[GPSEnvironmentKey.self]
        }
        set {
            self[GPSEnvironmentKey.self] = newValue
        }
    }
}
