import SwiftUI
import Combine

struct SignupForClassHandler {
    @Binding var state: CheckoutState
    @Binding var cancellables: Set<AnyCancellable>

    let dependencies: CheckoutDependencies

    func updateState() {
        state.isLoading = true

        let request = CreateClientClassSignup(trainerClass: state.trainerClass, signUp: signup)

        dependencies.client
            .dispatch(request)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: handleCompletion,
                receiveValue: { signup in
                    state.signup = signup
                    state.showCheckoutConfirmation = true
                }
            )
            .store(in: &cancellables)
    }

    private var signup: ClientClassSignUp {
        .init(
            id: UUID().hashValue,
            spots: spots,
            paymentIntentId: state.paymentSession?.paymentIntentId,
            trainerClass: state.trainerClass.id,
            spotsCount: spots.count,
            firstName: state.contactInfo.firstName,
            lastName: state.contactInfo.lastName,
            emailAddress: state.contactInfo.email,
            phoneNumber: state.contactInfo.phoneNumber,
            subscribeToEmails: true,
            agreeToSafetyWaver: true,
            user: client?.id
        )
    }

    private var spots: [Spot] {
        [
            Spot(
                id: UUID().hashValue,
                firstName: state.contactInfo.firstName,
                lastName: state.contactInfo.lastName,
                emailAddress: state.contactInfo.email,
                didAttend: nil
            )
        ]
    }

    private var client: User? {
        dependencies.auth.signedInUser
    }

    private struct SignupError: LocalizedError {
        var errorDescription: String? {
            "Could not signup to the class. Please contact support."
        }
    }

    private func handleCompletion( completion: Subscribers.Completion<NetworkRequestError>) {
        state.isLoading = false

        guard case .failure(let error) = completion else { return }
        if error.isUnexpected {
            state.error = SignupError().identifiable
        } else {
            state.error = error.identifiable
        }
    }
}
