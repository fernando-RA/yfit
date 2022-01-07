//
//  FetchTrainersOtherClasses.swift
//  Recreation-iOS
//
//  Created by Mike  Van Amburg on 8/4/21.
//

import Foundation

struct FetchTrainersOtherClasses: Request {
    typealias ReturnType = OtherClassesResults

    let path = "trainer-classes-upcoming-page"
    let user: User

    var queryParams: [String: String]? {
        let params = ["trainer_id": "\(user.id)"]
        return params
    }
}
