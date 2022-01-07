//
//  Locals.swift
//  Recreation-iOS
//
//  Created by Mike  Van Amburg on 7/16/21.
//

import Foundation
import MapKit

struct Locals: Identifiable, Equatable {
    var id = UUID().uuidString
    var placemarker: CLPlacemark
}
