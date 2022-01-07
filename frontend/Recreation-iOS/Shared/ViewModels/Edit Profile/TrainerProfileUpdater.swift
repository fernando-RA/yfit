import Combine
import Foundation

struct TrainerProfileUpdater {
    let state: EditProfileState
    let auth: AuthSessionManager
    let client: APIClient

    func save() -> AnyPublisher<Void, Error> {
        addNewWorkouts()
            .flatMap(updateRemovedWorkouts)
            .flatMap(updateUser)
            .map { _ in }
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }

    private func addNewWorkouts() -> AnyPublisher<Void, Error> {
        guard let diff = workoutDiff, !diff.workoutsToAdd.isEmpty else {
            return .just(Void())
        }
        return dispatch(AddWorkoutTypes(workouts: diff.workoutsToAdd))
    }

    private func updateRemovedWorkouts() -> AnyPublisher<Void, Error> {
        guard let diff = workoutDiff, !diff.workoutsToRemove.isEmpty else {
            return .just(Void())
        }
        return dispatch(RemoveWorkoutTypes(workouts: diff.workoutsToRemove))
    }

    private func updateUser() -> AnyPublisher<User, Error> {
        auth
            .updateSignedInUser { user in
                if state.userType == .trainer {
                    user.userType = .trainer
                } else {
                    user.userType = .client
                }
                user.firstName = state.firstName
                user.lastName = state.lastName
                user.bio = state.bio
                user.profilePicture = state.encodedProfilePicture
                user.workoutTypes = state.selectedWorkouts
                user.stripeAccountId = state.stripeAccountId

                if state.instagramLink.isEmpty {
                    user.instagramLink = nil
                } else {
                    user.instagramLink = "https://www.instagram.com/" + state.instagramLink
                }
            }
    }

    private func dispatch<R: Request>(_ request: R) -> AnyPublisher<Void, Error> {
        client
            .dispatch(request)
            .map { _ in }
            .mapError { $0 as Error }
            .eraseToAnyPublisher()
    }

    private var workoutDiff: EditWorkoutTypeDiffer? {
        auth.signedInUser.map { user in
            .init(selectedWorkouts: state.selectedWorkouts, user: user)
        }
    }
}
