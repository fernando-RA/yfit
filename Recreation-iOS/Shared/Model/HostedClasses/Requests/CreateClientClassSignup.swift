//
//  CreateClientClassSignup.swift
//  Recreation-iOS
//
//  Created by Mike  Van Amburg on 7/18/21.
//

import Foundation

struct CreateClientClassSignup: Request {
    typealias ReturnType = ClientClassSignUp

    let method: HTTPMethod = .post
    let trainerClass: TrainerClass
    let signUp: ClientClassSignUp

    var path: String {
        "client-class/\(trainerClass.id)"
    }

    var bodyData: Data? {
        try? JSON.encoder.encode(signUp)
    }
}
