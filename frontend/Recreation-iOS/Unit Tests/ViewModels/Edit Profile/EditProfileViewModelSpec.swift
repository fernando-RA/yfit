import Quick
import Nimble
import Foundation
@testable import Recreation_iOS

final class EditProfileViewModelSpec: BaseSpec {
    override func spec() {
        var subject: EditProfileViewModel!
        var auth: AuthSessionManager!
        var client: InMemoryAPIClient!
        var didCompleteEditProfile = false

        func createSubject() {
            subject = .init(auth: auth, client: client, completionHandler: {
                didCompleteEditProfile = true
            })
        }

        beforeEach {
            client = .init()
            auth = .create(client: client)
            createSubject()
        }

        afterEach {
            didCompleteEditProfile = false
        }

        describe("init") {
            var user: User! {
                didSet {
                    auth.session = .signedIn(user)
                }
            }

            beforeEach {
                user = .create(firstName: "Karl", lastName: "Rivest Harnois", bio: "some bio")
                client.assign(accessToken: "some-token")
                createSubject()
            }

            it("sets the access token") {
                expect(subject.state.accessToken) == "some-token"
            }

            it("prefills the first name") {
                expect(subject.state.firstName) == "Karl"
            }

            it("prefills the last name") {
                expect(subject.state.lastName) == "Rivest Harnois"
            }

            it("prefills the bio") {
                expect(subject.state.bio) == "some bio"
            }

            context("when user has no stripe account") {
                beforeEach {
                    user.stripeAccountId = nil
                    createSubject()
                }

                it("flags that stripe is not connected") {
                    expect(subject.state.stripeIsConnected) == false
                }
            }

            context("when user has a stripe account") {
                beforeEach {
                    user.stripeAccountId = "1234"
                }

                context("when user is a client") {
                    beforeEach {
                        user.userType = .client
                        createSubject()
                    }

                    it("flags that stripe is not connected") {
                        expect(subject.state.stripeIsConnected) == false
                    }
                }

                context("when user is a trainer") {
                    beforeEach {
                        user.userType = .trainer
                        createSubject()
                    }

                    it("flags that stripe not connected") {
                        expect(subject.state.stripePaymentsEnabled) == false
                    }
                }
            }
        }

        describe("connectStripeAccount") {
            beforeEach {
                let link = StripeAccountCreationLink(url: "www.test.com")
                client.respond(to: CreateStripeAccount.self, with: link)
                subject.send(.connectStripeAccount)
            }

            it("shows the stripe account creation form") {
                expect(subject.state.stripeLink?.absoluteString).toEventually(equal("www.test.com"))
            }
        }

        describe("save") {
            var updateUserRequest: UpdateUser? {
                client.lastPerformed(UpdateUser.self)
            }

            var addWorkoutRequest: AddWorkoutTypes? {
                client.lastPerformed(AddWorkoutTypes.self)
            }

            var removeWorkoutRequest: RemoveWorkoutTypes? {
                client.lastPerformed(RemoveWorkoutTypes.self)
            }

            beforeEach {
                let currentUser = User.create(bio: "", workoutTypes: [.create(workoutType: "Boxing")], userType: .client)
                auth.session = .signedIn(currentUser)

                subject.state.bio = "some bio"
                subject.state.selectedWorkouts = [.create(workoutType: "Yoga")]

                let apiUser = User.create(bio: "some bio", workoutTypes: [.create(workoutType: "Yoga")])
                client.respond(to: AddWorkoutTypes.self, with: apiUser)
                client.respond(to: RemoveWorkoutTypes.self, with: apiUser)
                client.respond(to: UpdateUser.self, with: apiUser)

                subject.send(.save)
            }

            it("adds the new workouts") {
                expect(addWorkoutRequest?.workouts.map(\.name)).toEventually(equal(["Yoga"]))
            }

            it("removes the old workouts") {
                expect(removeWorkoutRequest?.workouts.map(\.name)).toEventually(equal(["Boxing"]))
            }

            it("sends the bio as part of the payload") {
                expect(updateUserRequest?.user.bio).toEventually(equal("some bio"))
            }

            it("sends the workout types to the as part of the payload") {
                expect(updateUserRequest?.user.workoutTypes.map(\.name)).toEventually(equal(["Yoga"]))
            }

            it("registers the user as a trainer") {
                expect(updateUserRequest?.user.userType).toEventually(equal(.trainer))
            }

            it("updates the authenticated user") {
                expect(auth.signedInUser?.bio).toEventually(equal("some bio"))
            }

            it("updates the authenticated user's workouts") {
                expect(auth.signedInUser?.workoutTypes.map(\.name)).toEventually(equal(["Yoga"]))
            }

            it("completes the form") {
                expect(didCompleteEditProfile).toEventually(beTrue())
            }
        }

        describe("handleStripeFormUrl") {
            var request: UpdateUser? {
                client.lastPerformed(UpdateUser.self)
            }

            beforeEach {
                let user = User.create(userType: .client)
                auth.session = .signedIn(user)
            }

            context("on failure") {
                beforeEach {
                    let url = URL(string: "www.test.com/user_failed")!
                    subject.send(.handleStripeFormUrl(url))
                }

                it("dismisses the stripe account creation form") {
                    expect(subject.state.stripeLink).to(beNil())
                }

                it("does not update the user") {
                    expect(request).to(beNil())
                }
            }

            context("on success") {
                beforeEach {
                    let url = URL(string: "www.test.com/user_created")!
                    subject.send(.handleStripeFormUrl(url))
                }

                it("dismisses the stripe account creation form") {
                    expect(subject.state.stripeLink).to(beNil())
                }

                it("does not update the user") {
                    expect(request).to(beNil())
                }

                it("flags that stripe is now connected") {
                    expect(subject.state.stripeIsConnected) == true
                }
            }
        }
    }
}
