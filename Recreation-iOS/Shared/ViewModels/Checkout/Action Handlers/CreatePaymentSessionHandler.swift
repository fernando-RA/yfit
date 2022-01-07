import Foundation
import Combine
import SwiftUI

struct CreatePaymentSessionHandler {
    @Binding var state: CheckoutState
    @Binding var cancellables: Set<AnyCancellable>

    let dependencies: CheckoutDependencies

    func updateState() {
        guard !state.trainerClass.isFree,
              state.paymentSession == nil
              else { return }

        dependencies.client
            .dispatch(CreatePaymentSession(
                amount: state.trainerClass.price,
                trainerClass: state.trainerClass,
                client: dependencies.auth.session.user
            ))
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: handleError, receiveValue: updateSession)
            .store(in: &cancellables)
    }

    private func updateSession(_ session: PaymentSession) {
        state.paymentSession = session
        createPaymentSheet(from: session)

        guard var user = dependencies.auth.signedInUser else { return }
        user.stripeCustomerId = session.customerId
        dependencies.auth.session = .signedIn(user)

        dependencies.client
            .dispatch(UpdateStripeCustomer(user: user))
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { completion in
                    guard case .failure(let error) = completion else { return }
                    state.error = error.identifiable
                },
                receiveValue: { _ in }
            )
            .store(in: &cancellables)
    }

    private func createPaymentSheet(from session: PaymentSession) {
        dependencies.paymentProvider.createPaymentSheet(from: session)
    }

    private func handleError(_ completion: Subscribers.Completion<NetworkRequestError>) {
        guard case .failure(let error) = completion else { return }
        if error.isUnexpected {
            state.error = PaymentSessionError().identifiable
        } else {
            state.error = error.identifiable
        }
    }

    struct PaymentSessionError: LocalizedError {
        var errorDescription: String? {
            "Could not create the Stripe payment session."
        }
    }
}
