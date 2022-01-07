import Quick
import Nimble
import Foundation
@testable import Recreation_iOS

final class URLRequestSpec: BaseSpec {
    override func spec() {
        describe("curl") {
            var request: URLRequest!

            beforeEach {
                let url  = URL(string: "www.test.com")!
                request = .init(url: url)
                request.allHTTPHeaderFields = ["Authorization": "Token Sometoken"]
            }

            context("for requests without body") {
                it("returns the correct value") {
                    expect(request.curl) == "curl -i 'www.test.com' \\\n-X GET \\\n-H 'Authorization: Token Sometoken'"
                }
            }

            context("for requests with body") {
                beforeEach {
                    request.httpMethod = "POST"
                    request.httpBody = "{\"name\": \"Bob\"}".data(using: .utf8)
                }

                it("returns the correct value") {
                    expect(request.curl) == "curl -i 'www.test.com' \\\n-X POST \\\n"
                        + "-H 'Authorization: Token Sometoken' \\\n--data '{\"name\": \"Bob\"}'"
                }
            }
        }
    }
}
