//
//  FetchClientClass.swift
//  Recreation-iOS
//
//  Created by Mike  Van Amburg on 7/18/21.
//

import Foundation

struct ClientPage: Codable {
    let results: [ClientClassSignUp]
}

struct FetchHostedClasses: Request {
    typealias ReturnType = ClientPage

    let method: HTTPMethod = .get
    let trainerClass: TrainerClass
    var path: String {
        "client-class/\(trainerClass.id)"
    }
}
