//
//  GetFollowing.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/10/21.
//

import Foundation

struct GetFollowing: Request {
    typealias ReturnType = Matches
    var path: String = "profile/following"
    var method: HTTPMethod = .get
}

struct GetFollowingIds: Request {
    typealias ReturnType = MatchesID
    var path: String = "match/following"
    var method: HTTPMethod = .get
}
