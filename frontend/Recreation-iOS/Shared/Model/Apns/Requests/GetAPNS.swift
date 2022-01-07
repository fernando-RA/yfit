//
//  GetAPNS.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/4/21.
//

import Foundation

struct GetAPNS: Request {
    typealias ReturnType = Apns

    var path: String = "users/device/apns"
    var apiVersion: Int?
    var method: HTTPMethod = .get
}
