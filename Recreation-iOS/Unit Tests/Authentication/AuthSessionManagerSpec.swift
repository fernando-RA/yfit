import Quick
import Nimble
import Combine
@testable import Recreation_iOS

final class AuthSessionManagerSpec: BaseSpec {
    override func spec() {
        var subject: AuthSessionManager!
        var google: InMemoryGoogleAuthenticator!
        var client: InMemoryAPIClient!

        beforeEach {
            client = .init()
            google = .init()
            subject = .create(client: client, google: google)
        }

        describe("session") {
            it("is a guess session initially") {
                expect(subject.session) == .guess
            }
        }

        describe("logout") {
            beforeEach {
                subject.session = .signedIn(User.create())
            }

            it("starts a guess session") {
                subject.logout()

                expect(subject.session) == .guess
            }
        }

        describe("loginWithApple") {
            let apiUser = User.create(id: 123456)
            var receivedUser: User?
            var cancellables = Set<AnyCancellable>()

            struct MockCredentials: AppleCredentials {
                let code: String

                func authorizationCode() throws -> String {
                    code
                }
            }

            var loginRequest: CreateAppleLogin? {
                client.lastPerformed(CreateAppleLogin.self)
            }

            var getUserRequest: GetCurrentUser? {
                client.lastPerformed(GetCurrentUser.self)
            }

            beforeEach {
                let login = Login(token: "token")
                client.respond(to: CreateAppleLogin.self, with: login)
                client.respond(to: GetCurrentUser.self, with: apiUser)

                let creds = MockCredentials(code: "test-code")

                subject
                    .loginWithApple(with: creds)
                    .sink(receiveCompletion: { _ in }) { user in
                        receivedUser = user
                    }
                    .store(in: &cancellables)
            }

            it("logs in with the correct code") {
                expect(loginRequest?.code).toEventually(equal("test-code"))
            }

            it("assigns the user token to the networking client") {
                expect(client.accessToken).toEventually(equal("token"))
            }

            it("gets the current user after login") {
                expect(getUserRequest).toEventuallyNot(beNil())
            }

            it("returns the user") {
                expect(receivedUser).toEventually(equal(apiUser))
            }

            it("updates the auth session") {
                expect(subject.session).toEventually(equal(.signedIn(apiUser)))
            }
        }
    }
}
