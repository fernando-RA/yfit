import Quick
import Nimble
@testable import Recreation_iOS

final class MoneySpec: BaseSpec {
    override func spec() {
        describe("formatted") {
            context("short style") {
                it("is formats negative amounts") {
                    expect((-1050).cents.formatted()) == "-$10.50"
                }

                it("it formats positive amounts") {
                    expect(1250.cents.formatted()) == "$12.50"
                }

                it("doesn't display zero decimals") {
                    expect(5000.cents.formatted()) == "$50"
                }
            }

            context("long style") {
                it("keeps decimals") {
                    expect(1000.cents.formatted(.long)) == "$10.00"
                }
            }
        }

        describe("encoding") {
            it("encodes the money correctly") {
                let money = 1050.cents
                let encoded = try? JSON.encoder.encode(money)
                let decoded = encoded.map { data in
                    try? JSON.decoder.decode(String.self, from: data)
                }

                expect(decoded) == "10.50"
            }
        }
    }
}
