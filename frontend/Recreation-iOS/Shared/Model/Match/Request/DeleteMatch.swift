//
//  DeleteMatch.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/10/21.
//

import Foundation

struct DeleteMatch: Request {
    typealias ReturnType = Match

    var id: Int
    var method: HTTPMethod = .delete

    var path: String {
        "match/\(id)"
    }
}
