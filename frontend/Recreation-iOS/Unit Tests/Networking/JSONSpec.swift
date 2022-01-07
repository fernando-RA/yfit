import Quick
import Nimble
import Foundation
@testable import Recreation_iOS

final class JSONSpec: BaseSpec {
    override func spec() {
        describe("decoder") {
            context("when decoding dates") {
                let json = """
                    {
                        "date1" : "2022-06-10T13:22:11Z",
                        "date2" : "2021-07-15T22:20:01.912000Z"
                    }
                    """

                struct TestDates: Codable {
                    let date1: Date?
                    let date2: Date?
                }

                var subject: TestDates {
                    JSON.decode(json)
                }

                it("decodes all expected date formats") {
                    expect([subject.date1, subject.date2]).to(allPass { $0 != nil })
                }
            }
        }
    }
}
