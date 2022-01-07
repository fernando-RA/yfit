//
//  GetAttendee.swift
//  Recreation-iOS
//
//  Created by Mike  Van Amburg on 8/9/21.
//

import Foundation
struct GetAttendee: Request {
    typealias ReturnType = Spot

    var method: HTTPMethod = .get
    var spot: Spot

    var path: String {
        "client-class/spot/\(spot.id)"
    }
}
