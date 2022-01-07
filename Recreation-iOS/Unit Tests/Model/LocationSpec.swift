import Quick
import Nimble
@testable import Recreation_iOS

final class LocationSpec: BaseSpec {
    override func spec() {
        describe("location") {
            let subject = Location.create(lat: 10, lng: -5).location

            it("has the correct latitude") {
                expect(subject.coordinate.latitude) == 10
            }

            it("has the correct longitude") {
                expect(subject.coordinate.longitude) == -5
            }
        }

        describe("region") {
            let subject = Location.create(lat: 75, lng: 50).region

            it("has the correct latitude") {
                expect(subject.center.latitude) == 75
            }

            it("has the correct longitude") {
                expect(subject.center.longitude) == 50
            }
        }
    }
}
