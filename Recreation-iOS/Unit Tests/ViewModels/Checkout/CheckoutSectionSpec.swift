import Quick
import Nimble
@testable import Recreation_iOS

final class CheckoutSectionSpec: BaseSpec {
    override func spec() {
        describe("accessoryAction") {
            it("has the correct contact info action") {
                expect(CheckoutSection.contactInfo.accessoryAction) == .editContactInfo
            }
        }
    }
}
