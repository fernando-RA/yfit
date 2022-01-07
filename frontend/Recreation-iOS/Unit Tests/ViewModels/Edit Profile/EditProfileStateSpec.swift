import Quick
import Nimble
import Foundation
@testable import Recreation_iOS

final class EditProfileStateSpec: BaseSpec {
    override func spec() {
        var subject: EditProfileState!

        beforeEach {
            subject = .init()
        }

        describe("canSave") {
            context("when name is not filled") {
                beforeEach {
                    subject.firstName = ""
                    subject.lastName = ""
                }

                it("is false") {
                    expect(subject.canSave) == false
                }
            }

            context("when name is filled") {
                beforeEach {
                    subject.firstName = "Karl"
                    subject.lastName = "Rivest Harnois"
                }

                context("when bio is not filled") {
                    beforeEach {
                        subject.bio = ""
                    }

                    it("is false") {
                        expect(subject.canSave) == false
                    }
                }

                context("when bio is filled") {
                    beforeEach {
                        subject.bio = "some bio"
                    }

                    context("when stripe account is not connected") {
                        beforeEach {
                            subject.stripePaymentsEnabled = false
                        }

                        it("is false") {
                            expect(subject.canSave) == false
                        }
                    }

                    context("when stripe account is connected") {
                        beforeEach {
                            subject.stripePaymentsEnabled = true
                        }
                        context("when profile image is filled") {
                            beforeEach {
                                subject.user?.profilePicture = nil
                                subject.encodedProfilePicture = nil
                            }
                            it("is false") {
                                expect(subject.profileImgIsFilled) == false
                                expect(subject.canSave) == false
                            }
                        }
                        context("when profile image is filled") {
                            beforeEach {
                                subject.user?.profilePicture = "www.test.com"
                                subject.encodedProfilePicture = ""
                            }
                            it("is true") {
                                expect(subject.profileImgIsFilled) == true
                                expect(subject.canSave) == true
                            }
                        }
                    }
                }
            }
        }
    }
}
