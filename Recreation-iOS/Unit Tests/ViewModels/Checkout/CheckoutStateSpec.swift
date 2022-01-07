import Quick
import Nimble
@testable import Recreation_iOS

final class CheckoutStateSpec: BaseSpec {
    override func spec() {
        describe("availabilitiesStatus") {
            var state: CheckoutState!

            beforeEach {
                let `class` = TrainerClass.create()
                state = .init(trainerClass: `class`)
            }

            it("is pending check initially") {
                expect(state.availabilitiesStatus) == .pendingCheck
            }
        }

        describe("isLoading") {
            it("is false initially") {
                expect(CheckoutState(trainerClass: .create()).isLoading) == false
            }
        }

        describe("canCompleteCheckout") {
            var trainerClass: TrainerClass!
            var state: CheckoutState!

            func fillContactInfo() {
                state.contactInfo.firstName = "Karl"
                state.contactInfo.lastName = "Rivest Harnois"
                state.contactInfo.email = "test@test.com"
            }

            func createPaymentSession() {
                state.paymentSession = .create()
            }

            context("for free classes") {
                beforeEach {
                    trainerClass = .create(price: 0.cents)
                    state = .init(trainerClass: trainerClass)
                }

                context("when contact info is not filled") {
                    beforeEach {
                        state.contactInfo = .init()
                    }

                    it("is false") {
                        expect(state.canCompleteCheckout) == false
                    }
                }

                context("when contact info is filled") {
                    beforeEach {
                        fillContactInfo()
                    }

                    context("when not agreeing with waiver") {
                        beforeEach {
                            state.agreeToWaiver = false
                        }

                        it("is false") {
                            expect(state.canCompleteCheckout) == false
                        }
                    }

                    context("when agreeing with waiver") {
                        beforeEach {
                            state.agreeToWaiver = true
                        }

                        context("when class has no spots left") {
                            beforeEach {
                                state.availabilitiesStatus = .noSpotsLeft
                            }

                            it("is false") {
                                expect(state.canCompleteCheckout) == false
                            }
                        }

                        context("when class is pending the availability check") {
                            beforeEach {
                                state.availabilitiesStatus = .pendingCheck
                            }

                            it("is false") {
                                expect(state.canCompleteCheckout) == false
                            }
                        }

                        context("when class has spots left") {
                            beforeEach {
                                state.availabilitiesStatus = .spotsRemaining
                            }

                            it("is true") {
                                expect(state.canCompleteCheckout) == true
                            }
                        }
                    }
                }
            }

            context("for paid classes") {
                beforeEach {
                    trainerClass = .create(price: 1000.cents)
                    state = .init(trainerClass: trainerClass)
                }

                context("when contact info is not filled") {
                    beforeEach {
                        state.contactInfo = .init()
                    }

                    it("is false") {
                        expect(state.canCompleteCheckout) == false
                    }
                }

                context("when contact info is filled but payment session is not created yet") {
                    beforeEach {
                        fillContactInfo()
                    }

                    it("is false") {
                        expect(state.canCompleteCheckout) == false
                    }
                }

                context("when payment session is created but contact info is not filled") {
                    beforeEach {
                        state.contactInfo = .init()
                        createPaymentSession()
                    }

                    it("is false") {
                        expect(state.canCompleteCheckout) == false
                    }
                }

                context("when contact info is filled and the payment session is created") {
                    beforeEach {
                        fillContactInfo()
                        createPaymentSession()
                    }

                    context("when not agreeing with waiver") {
                        beforeEach {
                            state.agreeToWaiver = false
                        }

                        it("is false") {
                            expect(state.canCompleteCheckout) == false
                        }
                    }

                    context("when agreeing with waiver") {
                        beforeEach {
                            state.agreeToWaiver = true
                        }

                        context("when class has no spots left") {
                            beforeEach {
                                state.availabilitiesStatus = .noSpotsLeft
                            }

                            it("is false") {
                                expect(state.canCompleteCheckout) == false
                            }
                        }

                        context("when class is pending the availability check") {
                            beforeEach {
                                state.availabilitiesStatus = .pendingCheck
                            }

                            it("is false") {
                                expect(state.canCompleteCheckout) == false
                            }
                        }

                        context("when class has spots left") {
                            beforeEach {
                                state.availabilitiesStatus = .spotsRemaining
                            }

                            it("is true") {
                                expect(state.canCompleteCheckout) == true
                            }
                        }
                    }
                }
            }
        }
    }
}
