import Quick
import Nimble
@testable import Recreation_iOS

final class ClassFormViewModelSpec: BaseSpec {
    override func spec() {
        var subject: ClassFormViewModel!
        var client: InMemoryAPIClient!
        var didPublish = false

        func createSubject(_ type: ClassFormType) {
            subject = .init(client: client, type: type, onPublish: {
                didPublish = true
            })
        }

        beforeEach {
            didPublish = false
            client = .init()
        }

        describe("publish") {
            let classResponse = TrainerClass.create(id: 5)

            beforeEach {
                client.respond(to: CreateClass.self, with: classResponse)
                client.respond(to: SetFeaturedPhoto.self, with: classResponse)
            }

            context("for new classes") {
                let user = User.create(id: 15)
                let encodedPhoto = "some-encoded-photo"

                var createdClass: TrainerClass? {
                    client.lastPerformed(CreateClass.self)?.class
                }

                beforeEach {
                    createSubject(.create(author: user))
                    subject.state.encodedFeaturedPhoto = encodedPhoto
                    subject.send(.publish)
                }

                it("creates the class") {
                    expect(createdClass).toEventuallyNot(beNil())
                }

                it("sets the publishing date on the class") {
                    expect(createdClass?.publishedAt).toEventuallyNot(beNil())
                }

                it("updates the photo") {
                    expect {
                        client
                            .lastPerformed(SetFeaturedPhoto.self)?
                            .encodedPhoto
                    }
                    .toEventually(equal(encodedPhoto))
                }

                it("calls the completion handler") {
                    expect(didPublish).toEventually(beTrue())
                }
            }
        }
    }
}
