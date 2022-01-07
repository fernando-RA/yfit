//
//  GetMatch.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/10/21.
//

import Foundation

struct GetMatch: Request {
    typealias ReturnType = Match

    var `match`: Match
    var method: HTTPMethod = .get

    var path: String {
        "match/\(match.id)"
    }
}
