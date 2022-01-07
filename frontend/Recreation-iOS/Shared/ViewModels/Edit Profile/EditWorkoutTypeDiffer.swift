struct EditWorkoutTypeDiffer {
    let selectedWorkouts: [WorkoutType]
    let user: User

    var workoutsToAdd: [WorkoutType] {
        selectedWorkouts.filter { workout in
            !user.workoutTypes.contains(workout)
        }
    }

    var workoutsToRemove: [WorkoutType] {
        user.workoutTypes.filter { workout in
            !selectedWorkouts.contains(workout)
        }
    }
}
