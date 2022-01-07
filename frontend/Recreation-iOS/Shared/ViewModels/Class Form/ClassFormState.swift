import Foundation

struct ClassFormState {
    let type: ClassFormType

    var error: IdentifiableError?
    var `class`: TrainerClass
    var isLoading = false
    var encodedFeaturedPhoto: String?
    var isShowingPreview = false

    var isFilled: Bool {
        `class`.name.isFilled
            && `class`.details.isFilled
            && `class`.equipment.isFilled
            && hasFeaturedPhoto
            && `class`.location != nil
    }

    var formTitle: String {
        "\(type.isEditing ? "Edit" : "Create") Class"
    }

    var formAction: ClassFormAction {
        switch type {
        case .edit:
            return .publish
        case .duplicate, .create:
            return .preview
        }
    }

    var canPerformFormAction: Bool {
        isFilled && !isLoading
    }

    init(type: ClassFormType) {
        self.type = type

        switch type {
        case .create(let author):
            self.class = Self.newClass(for: author)

        case .duplicate(let copiedClass):
            self.class = copiedClass
            self.class.canceled = false

        case .edit(let editedClass):
            self.class = editedClass
        }
    }

    private var hasFeaturedPhoto: Bool {
        `class`.featuredPhoto != nil || encodedFeaturedPhoto != nil
    }

    private static func newClass(for author: User) -> TrainerClass {
        var new = TrainerClass(
            id: 0,
            type: .inPerson,
            featuredPhoto: nil,
            location: nil,
            duration: 0,
            attendLimitCount: 5,
            name: "",
            isAttendeeLimit: true,
            price: 1500.cents,
            details: "",
            startTime: .init(),
            clients: 0,
            author: author,
            tags: [],
            safetyProtocol: "All equipment is sanitized before class",
            equipment: nil,
            locationNotes: nil,
            cancellationPolicy: "flexible",
            canceled: false
        )
        new.durationTimeInterval = 30.minutes
        return new
    }
}
