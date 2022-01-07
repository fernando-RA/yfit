//
//  UpdateMatch.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/10/21.
//

import Foundation

struct UpdateMatch: Request {
    typealias ReturnType = Match

    var `match`: Match
    var method: HTTPMethod = .put

    var path: String {
        "match/\(match.id)"
    }

    var bodyData: Data? {
        try? JSON.encoder.encode(match)
    }
}
