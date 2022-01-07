//
//  MatchViewModelSpec.swift
//  Unit Tests
//
//  Created by Mike  Van Amburg on 10/20/21.
//

import Quick
import Nimble
import Foundation

@testable import Recreation_iOS

final class MatchViewModelSpec: BaseSpec {
    override func spec() {
        var subject: MatchesViewModel!
        var client: InMemoryAPIClient!
        var google: InMemoryGoogleAuthenticator!
        var authManager: AuthSessionManager!

        beforeEach {
            client = .init()
            google = .init()
            authManager = .create(client: client, google: google)

            subject = .init(client: client, auth: authManager)
        }

        describe("follow user") {
        let user = User.create(id: 23)
        let owner = User.create(id: 33)

        beforeEach {
            subject.createMatch(userId: user.id, trainerId: owner.id)
        }

        it("Should be created") {
            let followedUser = subject.state.following.contains(where: {$0.id == 0})

            expect(followedUser).toNot(beNil())
                }
        }
    }
}
