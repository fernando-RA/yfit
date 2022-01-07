import Foundation
import Combine

struct AvailabilitiesCheck {
    let client: APIClient

    func perform(_ state: CheckoutState) -> AnyPublisher<AvailabilitiesStatus, Error> {
        let trainerClass = state.trainerClass

        guard trainerClass.isAttendeeLimit else {
            return .just(.spotsRemaining)
        }

        guard trainerClass.hasSpotsLeft else {
            return .just(.noSpotsLeft)
        }

        return client
            .dispatch(GetClass(id: trainerClass.id))
            .map { latestClass in
                latestClass.hasSpotsLeft ? .spotsRemaining : .noSpotsLeft
            }
            .mapError { $0 as Error }
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
}
