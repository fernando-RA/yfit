import Quick
import Nimble
@testable import Recreation_iOS

final class EditWorkoutTypeDifferSpec: BaseSpec {
    override func spec() {
        var subject: EditWorkoutTypeDiffer!

        let hiit = WorkoutType(id: 1, workoutType: "HIIT")
        let yoga = WorkoutType(id: 2, workoutType: "Yoga")
        let boxing = WorkoutType(id: 3, workoutType: "Boxing")

        beforeEach {
            let user = User.create(workoutTypes: [hiit, yoga])
            subject = .init(selectedWorkouts: [yoga, boxing], user: user)
        }

        describe("workoutsToAdd") {
            it("returns the correct value") {
                expect(subject.workoutsToAdd) == [boxing]
            }
        }

        describe("workoutsToRemove") {
            it("returns the correct value") {
                expect(subject.workoutsToRemove) == [hiit]
            }
        }
    }
}
