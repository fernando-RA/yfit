//
//  GetStripeAcct.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 9/17/21.
//

import Foundation

class GetStripeAcct: Request {
    typealias ReturnType = StripeAccount

    var method: HTTPMethod = .get
    var path: String = "payment/get_stripe_account"
}
