enum ClassFormType: Equatable {
    case create(author: User)
    case edit(TrainerClass)
    case duplicate(TrainerClass)

    var isEditing: Bool {
        switch self {
        case .edit:
            return true
        case .create, .duplicate:
            return false
        }
    }

    var baseClass: TrainerClass? {
        switch self {
        case .create:
            return nil
        case .edit(let trainerClass):
            return trainerClass
        case .duplicate(let trainerClass):
            return trainerClass
        }
    }
}
