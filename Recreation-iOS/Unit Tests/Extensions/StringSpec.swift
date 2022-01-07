import Quick
import Nimble
@testable import Recreation_iOS

final class StringSpec: BaseSpec {
    override func spec() {
        describe("isValidEmail") {
            context("when email is valid") {
                it("is true") {
                    expect("some@validemail.com".isValidEmail) == true
                }
            }

            context("when email is invalid") {
                it("is false") {
                    expect("invalid email".isValidEmail) == false
                }
            }
        }

        describe("money") {
            context("for numbers") {
                it("returns the correct value") {
                    expect("1212".money) == 1212.cents
                }
            }

            context("for numbers with separators") {
                it("returns the correct value") {
                    expect("12,233.50".money) == 1223350.cents
                }
            }

            context("for numbers with currency symbols") {
                it("returns the correct value") {
                    expect("$40.50".money) == 4050.cents
                }
            }

            context("for words") {
                it("is nil") {
                    expect("hello".money).to(beNil())
                }
            }
        }
    }
}
