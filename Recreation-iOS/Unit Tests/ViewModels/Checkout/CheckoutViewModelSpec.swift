import Quick
import Nimble
@testable import Recreation_iOS

final class CheckoutViewModelSpec: BaseSpec {
    override func spec() {
        var subject: CheckoutViewModel!
        var paymentProvider: InMemoryPaymentProvider!
        var authManager: AuthSessionManager!
        var client: InMemoryAPIClient!

        var state: CheckoutState {
            subject.state
        }

        func createSubject(`class`: TrainerClass) {
            subject = .init(
                trainerClass: `class`,
                dependencies: .init(
                    paymentProvider: paymentProvider,
                    auth: authManager,
                    client: client
                )
            )
        }

        beforeEach {
            client = .init()
            paymentProvider = .init()
            authManager = .create(client: client)
            createSubject(class: .create(price: 2000.cents))
        }

        describe("init") {
            context("for signed up session") {
                beforeEach {
                    let user = User.create(
                        firstName: "Karl",
                        lastName: "Rivest Harnois",
                        email: "karl@test.com"
                    )
                    authManager.session = .signedIn(user)
                    createSubject(class: .create())
                }

                it("fills the first name") {
                    expect(state.contactInfo.firstName) == "Karl"
                }

                it("doesn't fill the last name") {
                    expect(state.contactInfo.lastName) == "Rivest Harnois"
                }

                it("doesn't fill the email") {
                    expect(state.contactInfo.email) == "karl@test.com"
                }
            }
        }

        describe("contactInfo") {
            beforeEach {
                subject.state.contactInfo = .init(
                    email: "karl@testtest.com",
                    firstName: "Karl",
                    lastName: "Rivest Harnois"
                )
            }

            context("when configured properly") {
                it("is filled") {
                    expect(state.contactInfo.isFilled) == true
                }
            }

            context("when email is invalid") {
                beforeEach {
                    subject.state.contactInfo.email = "karl@tes"
                }

                it("is not filled") {
                    expect(state.contactInfo.isFilled) == false
                }
            }

            context("when first name is missing") {
                beforeEach {
                    subject.state.contactInfo.firstName = ""
                }

                it("is not filled") {
                    expect(state.contactInfo.isFilled) == false
                }
            }

            context("when last name is missing") {
                beforeEach {
                    subject.state.contactInfo.lastName = ""
                }

                it("is not filled") {
                    expect(state.contactInfo.isFilled) == false
                }
            }
        }

        describe("totals") {
            it("has the correct line items") {
                expect(state.totals) == [
                    PaymentLineItem(label: .subtotal, amount: 2000.cents),
                    PaymentLineItem(label: .total, amount: 2000.cents)
                ]
            }
        }

        describe("sections") {
            let trainerClass = TrainerClass.create(id: 234)

            beforeEach {
                createSubject(class: trainerClass)
            }

            it("has the correct order") {
                expect(state.sections) == [
                    .classInfo(trainerClass),
                    .contactInfo,
                    .cancellationPolicy,
                    .waiver,
                    .totals,
                    .placeOrder
                ]
            }
        }

        describe("setup") {
            let session = PaymentSession.create(clientSecret: "1", customerId: "2")

            beforeEach {
                client.respond(to: CreatePaymentSession.self, with: session)
            }

            describe("create session request") {
                let user = User.create(stripeCustomerId: "<some-id>")

                var request: CreatePaymentSession? {
                    client.lastPerformed(CreatePaymentSession.self)
                }

                context("when class is free") {
                    beforeEach {
                        authManager.session = .signedIn(user)
                        createSubject(class: .create(price: 0.cents))
                        subject.send(.setup)
                    }

                    it("does not create a payment intent") {
                        expect(request).to(beNil())
                    }
                }

                context("when class is not free") {
                    let trainerClass = TrainerClass.create(price: 5050.cents)

                    beforeEach {
                        authManager.session = .signedIn(user)
                        createSubject(class: trainerClass)
                        subject.send(.setup)
                    }

                    it("performs the correct request") {
                        expect(request).toNot(beNil())
                    }

                    it("uses the correct amount") {
                        expect(request?.amount) == 5050.cents
                    }

                    it("uses the correct class") {
                        expect(request?.trainerClass) == trainerClass
                    }

                    it("uses the correct user if any") {
                        expect(request?.client) == user
                    }

                    it("persists the created session") {
                        expect(state.paymentSession).toEventually(equal(session))
                    }
                }
            }

            describe("updating the user stripe customer id") {
                let updateUserResponse = User.create(stripeCustomerId: "api-customer-id")

                var request: UpdateStripeCustomer? {
                    client.lastPerformed(UpdateStripeCustomer.self)
                }

                beforeEach {
                    let authenticatedUser = User.create(stripeCustomerId: nil)
                    authManager.session = .signedIn(authenticatedUser)

                    client.respond(to: UpdateStripeCustomer.self, with: updateUserResponse)

                    subject.send(.setup)
                }

                it("performs the correct request") {
                    expect(request).toEventuallyNot(beNil())
                }

                it("sends the new stripe customer id") {
                    expect(request?.user.stripeCustomerId)
                        .toEventually(equal(session.customerId))
                }

                it("updates the auth session with the new user") {
                    expect(authManager.signedInUser?.stripeCustomerId).toEventually(equal("2"))
                }
            }

            context("for guess sessions") {
                beforeEach {
                    authManager.session = .guess
                    subject.send(.setup)
                }

                it("doesn't fill the first name") {
                    expect(state.contactInfo.firstName).to(beEmpty())
                }

                it("doesn't fill the last name") {
                    expect(state.contactInfo.lastName).to(beEmpty())
                }

                it("doesn't fill the email") {
                    expect(state.contactInfo.email).to(beEmpty())
                }
            }
        }

        describe("editContactInfo") {
            beforeEach {
                subject.send(.editContactInfo)
            }

            it("shows the form") {
                expect(state.showContactInfoForm) == true
            }
        }

        describe("save") {
            let updatedContactInfo = ContactInfo(
                email: "SaraG12@gmail.com",
                firstName: "Sara",
                lastName: "Smith"
            )

            beforeEach {
                let `class` = TrainerClass.create(attendLimitCount: 5, isAttendeeLimit: true, clients: 2)
                createSubject(class: `class`)

                subject.state.showContactInfoForm = true
                subject.state.availabilitiesStatus = .pendingCheck

                client.respond(to: GetClass.self, with: `class`)
            }

            describe("contact information") {
                beforeEach {
                    subject.send(.save(updatedContactInfo, true))
                }

                it("persists the new contact information") {
                    expect(state.contactInfo) == updatedContactInfo
                }

                it("dismisses the contact info form") {
                    expect(state.showContactInfoForm) == false
                }
            }

            it("checks for availabilities") {
                subject.send(.save(updatedContactInfo, true))

                expect(state.availabilitiesStatus).toEventually(equal(.spotsRemaining))
            }
        }

        describe("handlePayment") {
            context("on success") {
                let signup = ClientClassSignUp.create()

                beforeEach {
                    client.respond(to: CreateClientClassSignup.self, with: signup)
                    subject.send(.handlePayment(.completed))
                }

                it("shows the confirmation page") {
                    expect(state.showCheckoutConfirmation).toEventually(beTrue())
                }

                it("signs up to the class") {
                    expect(client.lastPerformed(CreateClientClassSignup.self)).toNot(beNil())
                }

                it("keeps the signup in memory") {
                    expect(state.signup).toEventually(equal(signup))
                }
            }

            context("on failure") {
                let error = "payment form is having issues".equatable

                beforeEach {
                    subject.send(.handlePayment(.failed(error)))
                }

                it("displays the error") {
                    expect(state.error?.equatable) == error
                }

                it("does not signup for the class") {
                    expect(client.lastPerformed(CreateClientClassSignup.self)).to(beNil())
                }
            }

            context("on cancelation") {
                beforeEach {
                    subject.send(.handlePayment(.canceled))
                }

                it("does not signup for the class") {
                    expect(client.lastPerformed(CreateClientClassSignup.self)).to(beNil())
                }
            }
        }
    }
}
