import Foundation

struct WorkoutType: Codable, Identifiable, Equatable {
    var id: Int
    let workoutType: String

    var name: String {
        workoutType
    }
}

struct GetWorkoutTypes: Request {
    typealias ReturnType = [WorkoutType]

    let path = "profile/list_workout_types"
}

struct AddWorkoutTypes: Request {
    typealias ReturnType = User

    let method: HTTPMethod = .post
    let path = "profile/add_workout_types"
    let workouts: [WorkoutType]

    var body: [String: Any]? {
        [
            "ids": workouts
                .map(\.id)
                .map(String.init)
                .joined(separator: ",")
        ]
    }
}

struct RemoveWorkoutTypes: Request {
    typealias ReturnType = User

    let method: HTTPMethod = .post
    let path = "profile/remove_workout_types"
    let workouts: [WorkoutType]

    var body: [String: Any]? {
        [
            "ids": workouts
                .map(\.id)
                .map(String.init)
                .joined(separator: ",")
        ]
    }
}

#if DEBUG

extension WorkoutType {
    static func create(id: Int = 1,
                       workoutType: String = "Yoga") -> Self {
        Self(
            id: id,
            workoutType: workoutType
        )
    }
}

#endif
