import Quick
import Nimble
@testable import Recreation_iOS

final class OnboardingViewModelSpec: BaseSpec {
    override func spec() {
        var subject: OnboardingViewModel!
        var client: InMemoryAPIClient!
        var google: InMemoryGoogleAuthenticator!
        var authManager: AuthSessionManager!

        beforeEach {
            client = .init()
            google = .init()
            authManager = .create(client: client, google: google)
            subject = .init(client: client, authManager: authManager, googleAuthenticator: google)
        }

        context("on Google sign in") {
            let creds = GoogleCredentials(accessToken: "some-token")

            var loginRequest: CreateGoogleLogin? {
                client.lastPerformed(CreateGoogleLogin.self)
            }

            beforeEach {
                let login = Login(token: "some-token")
                client.respond(to: CreateGoogleLogin.self, with: login)

                let user = User.create(firstName: "Karl", lastName: "Rivest Harnois")
                client.respond(to: GetCurrentUser.self, with: user)

                google.credentialsPublisher.send(creds)
            }

            it("fires a login request") {
                expect(loginRequest?.credentials).toEventually(equal(creds))
            }

            it("retrieves the newly logged in user") {
                expect(client.lastPerformed(GetCurrentUser.self)).toEventuallyNot(beNil())
            }

            it("proceeds to the next step") {
                expect(subject.state.isShowingApplication).toEventually(beTrue())
            }
        }

        describe("isShowingApplication") {
            it("is false by default") {
                expect(subject.state.isShowingApplication) == false
            }

            context("on logout") {
                beforeEach {
                    authManager.session = .signedIn(User.create())
                    subject.state.isShowingApplication = true

                    authManager.logout()
                }

                it("goes back to the onboarding") {
                    expect(subject.state.isShowingApplication).toEventually(beFalse())
                }
            }
        }

        describe("close") {
            beforeEach {
                subject.send(.close)
            }

            it("closes the onboarding") {
                expect(subject.state.isShowingApplication) == true
            }
        }

        describe("handleAuthorization") {
            var user: User!

            var state: OnboardingState {
                subject.send(.handleAuthorization(user))
                return subject.state
            }

            context("for recurring user") {
                beforeEach {
                    user = .create(firstName: "Karl", lastName: "Rivest Harnois")
                }

                it("closes the onboarding") {
                    expect(state.isShowingApplication) == true
                }
            }

            context("for newly created user without names") {
                beforeEach {
                    user = .create(firstName: "", lastName: "")
                }

                it("shows the profile registration form") {
                    expect(state.isShowingNameInputForm) == true
                }

                it("does not close the onboarding") {
                    expect(state.isShowingApplication) == false
                }
            }
        }

        describe("updateUser") {
            let newUser = User.create(lastName: "getrec")
            let registeredUser = User.create(lastName: "Rivest Harnois")

            let form = OnboardingNameState(firstName: "Karl", lastName: "Rivest Harnois")

            var request: UpdateUser? {
                client.lastPerformed(UpdateUser.self)
            }

            beforeEach {
                authManager.session = .signedIn(newUser)
                client.respond(to: UpdateUser.self, with: registeredUser)
                subject.send(.updateUser(form))
            }

            it("performs the correct request") {
                expect(request).toNot(beNil())
            }

            it("updates the user's first name") {
                expect(request?.user.firstName) == "Karl"
            }

            it("updates the user's last name") {
                expect(request?.user.lastName) == "Rivest Harnois"
            }

            it("closes the onboarding after the registration") {
                expect(subject.state.isShowingApplication)
                    .toEventually(beTrue())
            }

            it("updates the authenticated user after the registration") {
                expect(authManager.session.user)
                    .toEventually(equal(registeredUser))
            }
        }
    }
}
