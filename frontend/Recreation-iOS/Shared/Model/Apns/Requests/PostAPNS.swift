//
//  PostAPNS.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/4/21.
//

import Foundation

struct PostAPNS: Request {
    typealias ReturnType = Apns

    var `apns`: Apns
    var path: String = "users/device/apns"
    var apiVersion: Int?
    var method: HTTPMethod = .post

    var bodyData: Data? {
        try? JSON.encoder.encode(apns)
    }
}
