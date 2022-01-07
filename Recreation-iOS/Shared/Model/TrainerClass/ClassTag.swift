enum ClassTag: String, Codable, CaseIterable {
    case boxing = "Boxing"
    case yoga = "Yoga"
    case hiit = "HIIT"
    case meditation = "Meditation"
    case cardio = "Cardio"
    case beginner = "Beginner"
    case intermediate = "Intermediate"
    case advanced = "Advanced"
    case goodForAllLevels = "Good for all levels"
    case intense = "Intense"
    case relaxing = "Relaxing"
    case mobility = "Mobility"
    case sculpt = "Sculpt"

    var name: String {
        rawValue
    }
}

extension ClassTag: Identifiable {
    var id: String {
        name
    }
}
