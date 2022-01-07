import Quick
import Nimble
import Foundation
@testable import Recreation_iOS

final class UserSpec: BaseSpec {
    override func spec() {
        describe("fullName") {
            it("returns the correct value") {
                let user = User.create(firstName: "Karl", lastName: "Rivest Harnois")

                expect(user.fullName) == "Karl Rivest Harnois"
            }
        }

        describe("initials") {
            it("returns the correct value") {
                let user = User.create(firstName: "Karl", lastName: "Rivest Harnois")

                expect(user.initials) == "KR"
            }
        }

        describe("decodable") {
            var subject: User?

            beforeEach {
                subject = JSON.decode(.user)
            }

            it("decodes the id") {
                expect(subject?.id) == 61
            }

            it("decodes the stripe customer id") {
                expect(subject?.stripeCustomerId) == "cus_1234"
            }

            it("decodes the workout types") {
                expect(subject?.workoutTypes) == [
                    .init(id: 3, workoutType: "Boxing"),
                    .init(id: 4, workoutType: "Yoga"),
                    .init(id: 5, workoutType: "HIIT"),
                    .init(id: 6, workoutType: "Meditation")
                ]
            }

            it("decodes the user type") {
                expect(subject?.userType) == .trainer
            }

            it("decodes the profile picture url") {
                expect(subject?.profilePictureURL?.absoluteString)
                    == "https://undercard-18898-staging.s3.amazonaws.com/test.jpg"
            }

            context("when receiving a null string") {
                it("decodes that to an empty string") {
                    expect(subject?.bio) == ""
                }
            }
        }

        describe("encodable") {
            var user: User!

            var result: [String: Any]? {
                let data = try? JSON.encoder.encode(user)

                return data.flatMap { data in
                    try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
                }
            }

            beforeEach {
                user = .create()
            }

            context("when a string value is empty") {
                beforeEach {
                    user.firstName = ""
                }

                it("encodes that as a null string") {
                    expect(result?["first_name"] as? String) == "null"
                }
            }

            context("when a string value is not empty") {
                beforeEach {
                    user.firstName = "Karl"
                }

                it("encodes the value") {
                    expect(result?["first_name"] as? String) == "Karl"
                }
            }

            context("when workout type is empty") {
                beforeEach {
                    user.workoutTypes = []
                }

                it("is not encoded") {
                    expect(result?.keys).toNot(contain("workout_types"))
                }
            }

            context("when workout type is not empty") {
                var encodedWorkoutTypes: [[String: Any]]? {
                    result?["workout_types"] as? [[String: Any]]
                }

                beforeEach {
                    user.workoutTypes = [
                        .create(workoutType: "Yoga")
                    ]
                }

                it("is not encoded") {
                    expect(result?.keys).toNot(contain("workout_types"))
                }
            }
        }
    }
}
