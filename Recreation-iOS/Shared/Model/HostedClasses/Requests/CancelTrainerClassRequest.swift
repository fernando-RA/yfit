//
//  CancelTrainerClassRequest.swift
//  Recreation-iOS
//
//  Created by Mike  Van Amburg on 7/28/21.
//

import Foundation

struct CancelTrainerClassRequest: Request {
    typealias ReturnType = TrainerClass
    var method: HTTPMethod = .post

    var classId: Int
    var path: String {
        "trainer-class/\(classId)/cancel_training"
    }
}
