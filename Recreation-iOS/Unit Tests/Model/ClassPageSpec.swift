import Quick
import Nimble
import Foundation
@testable import Recreation_iOS

final class ClassPageSpec: BaseSpec {
    override func spec() {
        describe("decodable") {
            var json: String!

            let trainers = [
                Fixture.trainerClass.json,
                Fixture.trainerClass.json
            ]
            .joined(separator: ",")

            var subject: ClassPage? {
                JSON.decode(json)
            }

            beforeEach {
                json = """
                    {
                        "results" : [\(trainers)],
                        "offset" : 10,
                        "count" : 7
                    }
                    """
            }

            it("decodes the count") {
                expect(subject?.count) == 7
            }

            it("decodes the offset") {
                expect(subject?.offset) == 10
            }

            context("when there's a limit") {
                beforeEach {
                    json = """
                        {
                            "results" : [\(trainers)],
                            "offset" : 10,
                            "count" : 7,
                            "limit": 5
                        }
                        """
                }

                it("decodes the limit") {
                    expect(subject?.limit) == 5
                }
            }
        }
    }
}
