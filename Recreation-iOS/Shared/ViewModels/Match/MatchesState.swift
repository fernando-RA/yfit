//
//  MatchesState.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/10/21.
//

import Foundation

struct MatchesState {
    let id = UUID().hashValue
    let date = DateFormatter().string(from: Date())
    var error: IdentifiableError?
    var match: Match?
    var followersResults: [Matches] = []
    var followers: [User] = []
    var followedResults: [Matches] = []
    var followed: [User] = []
    var followingResults: [MatchesID] = []
    var following: [Match] = []
}
