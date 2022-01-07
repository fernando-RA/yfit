//
//  MatchSpec.swift
//  Unit Tests
//
//  Created by Mike  Van Amburg on 10/20/21.
//

import Quick
import Nimble
import Foundation
@testable import Recreation_iOS

final class MatchSpec: BaseSpec {
    override func spec() {
        describe("decodable") {
            var subject: Match!

            beforeEach {
                subject = JSON.decode(.match)
            }

            it("has the correct id") {
                expect(subject.id) == 97
            }

            it("decodes created") {
                expect {
                    let calendar = Calendar.current
                    return calendar.dateComponents([.year, .month, .day], from: subject!.created!)
                }
                .to(equal(DateComponents(year: 2021, month: 6, day: 16)))
            }
            it("has corrct user") {
                expect(subject.user) == 291
            }
            it("has corrct owner") {
                expect(subject.user) == 291
            }
        }
    }
}
