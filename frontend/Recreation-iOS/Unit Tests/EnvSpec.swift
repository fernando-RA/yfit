import Quick
import Nimble
@testable import Recreation_iOS

final class EnvSpec: BaseSpec {
    override func spec() {
        describe("shouldLaunchApp") {
            it("is false when running unit tests") {
                expect(Env.shouldLaunchApp) == false
            }
        }

        describe("secret") {
            it("has an api base url") {
                expect(Env.secret(.apiBaseURL)) != ""
            }

            it("has a Stripe publishable key") {
                expect(Env.secret(.stripePublishableKey)) != ""
            }

            it("has a merchant id") {
                expect(Env.secret(.applePayMerchantId)) != ""
            }

            it("has a google client id") {
                expect(Env.secret(.googleClientId)) != ""
            }
        }
    }
}
