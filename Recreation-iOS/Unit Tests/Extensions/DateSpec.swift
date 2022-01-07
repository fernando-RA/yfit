import Quick
import Nimble
import Foundation
@testable import Recreation_iOS

final class DateSpec: BaseSpec {
    override func spec() {
        describe("formatted") {
            var subject: Date {
                let calendar = Calendar.current
                let components = DateComponents(calendar: calendar, month: 6, day: 9, hour: 8, minute: 30)
                return calendar.date(from: components)!
            }

            it("is formatted correctly") {
                expect(subject.formatted) == "Thursday, Jun 9"
            }
        }
    }
}
