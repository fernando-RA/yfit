//
//  DeleteStripeAcct.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 9/17/21.
//

import Foundation

final class DeleteStripeAcct: Request {
    typealias ReturnType = String

    var method: HTTPMethod = .post
    var path: String = "payment/delete_account"
}
