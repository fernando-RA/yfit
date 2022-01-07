//
//  GetFollowers.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/10/21.
//

import Foundation

struct GetFollowers: Request {
    typealias ReturnType = Matches
    var path: String = "profile/followers"
    var method: HTTPMethod = .get
}
