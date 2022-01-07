//
//  Match.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/10/21.
//

import Foundation

/*
 Convention:
     owner: follower user_id
     user: followed (trainer) user_id
 */
struct Match: Codable {
    var id: Int?
    var created: Date?
    var user: Int
    var owner: Int
}
