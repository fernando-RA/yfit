//
//  PostMatch.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/10/21.
//

import Foundation

struct PostMatch: Request {
    typealias ReturnType = Match

    var path = "match"
    var method: HTTPMethod = .post
    var match: Match

    var bodyData: Data? {
        try? JSON.encoder.encode(match)
    }
}
