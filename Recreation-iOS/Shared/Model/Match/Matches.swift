//
//  Matches.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/10/21.
//

import Foundation

struct Matches: Codable {
    var count: Int?
    var next: String?
    var previous: String?
    var results: [User]
}

struct MatchesID: Codable {
    var count: Int?
    var results: [Match]
}
