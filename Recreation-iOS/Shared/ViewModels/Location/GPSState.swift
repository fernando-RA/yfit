//
//  GPSState.swift
//  Recreation-iOS
//
//  Created by Mike  Van Amburg on 7/16/21.
//

import Foundation
import MapKit

struct GPSState {
    var currentLocation: CLLocation? = .init()
    var currentRegion: MKCoordinateRegion = .init()
    var selectedRegion: MKCoordinateRegion = .init()
    var selectedLocal: CLLocation = .init()
    var searchedLocal: String = ""
    var classes: [Locals] = []
    var annotation: [Locals] = []
    var local: Locals?
    var invalidPermission = false
}
