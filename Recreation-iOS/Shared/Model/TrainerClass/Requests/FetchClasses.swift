//
//  FetchClientClasses.swift
//  Recreation-iOS
//
//  Created by Mike  Van Amburg on 7/30/21.
//

import Foundation

struct FetchClasses: Request {
    typealias ReturnType = ClassPage

    let path = "trainer-classes-upcoming-page"
    var limit: Int
    var offset: Int?

    var queryParams: [String: String]? {
        var params = ["limit": "\(limit)"]

        if let offset = offset {
            params["offset"] = "\(offset)"
        }
        return params
    }
}
