//
//  FetchAttendees.swift
//  Recreation-iOS
//
//  Created by Mike  Van Amburg on 8/8/21.
//

import Foundation

struct AttendeeList: Codable {
    let results: [Spot]
}

struct FetchAttendees: Request {
    typealias ReturnType = AttendeeList

    let trainer: TrainerClass
    var method: HTTPMethod = .get
    var path: String {
        "client-class/\(trainer.id)/attendees"
    }
}
