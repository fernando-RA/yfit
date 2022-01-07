//
//  UpdateAttendence.swift
//  Recreation-iOS
//
//  Created by Mike  Van Amburg on 8/9/21.
//

import Foundation

struct UpdateAttendence: Request {
    typealias ReturnType = Spot

    var method: HTTPMethod = .put
    var `spot`: Spot

    var path: String {
        "client-class/spot/\(spot.id)"
    }
    var bodyData: Data? {
        try? JSON.encoder.encode(`spot`)
    }
}
