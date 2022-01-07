import Quick
import Nimble
import Foundation
@testable import Recreation_iOS

final class TrainerClassSpec: BaseSpec {
    override func spec() {
        describe("decodable") {
            var subject: TrainerClass!

            beforeEach {
                subject = JSON.decode(.trainerClass)
            }

            it("has the correct id") {
                expect(subject.id) == 791
            }

            it("decodes correct attendee limit") {
                expect(subject.attendLimitCount) == 10
            }

            it("decodes the name") {
                expect(subject.name) == "test"
            }

            it("decodes isAttendeeLimit") {
                expect(subject.isAttendeeLimit) == true
            }

            it("decodes price") {
                expect(subject.price) == 500.cents
            }

            it("decodes details string") {
                expect(subject.details) == "test details"
            }

            it("decodes the tags") {
                expect(subject.tags) == [.yoga, .boxing]
            }

            it("decodes class start time") {
                expect {
                    let calendar = Calendar.current
                    return calendar.dateComponents([.year, .month, .day], from: subject!.startTime)
                }
                .to(equal(DateComponents(year: 2021, month: 6, day: 16)))
            }

            it("decodes the duration") {
                expect(subject.duration) == 30
            }

            it("decodes the location") {
                expect(subject?.location) == Location(
                    lat: 40.712775299999997,
                    lng: -74.005972799999995,
                    locationName: "NYC, NY, USA"
                )
            }

            it("decodes the author") {
                expect(subject.author.id) == 61
            }

            it("decodes the canceled") {
                expect(subject.canceled) == false
            }

            context("when class has an empty location") {
                beforeEach {
                    subject = JSON.decode(.trainerClassWithNoLocation)
                }

                it("has a nil location") {
                    expect(subject.location).to(beNil())
                }
            }
        }
    }
}
