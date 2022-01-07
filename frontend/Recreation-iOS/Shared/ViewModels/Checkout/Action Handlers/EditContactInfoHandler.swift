import SwiftUI
import Combine

struct EditContactInfoHandler {
    @Binding var state: CheckoutState
    @Binding var cancellables: Set<AnyCancellable>

    let auth: AuthSessionManager
    let client: APIClient

    func updateState(contactInfo: ContactInfo, saveContactInfo: Bool) {
        state.contactInfo = contactInfo
        state.showContactInfoForm = false

        guard var user = auth.signedInUser else {
            return
        }
        guard saveContactInfo else {
            return
        }
        user.update(with: contactInfo)
        auth.session = .signedIn(user)

        client
            .dispatch(UpdateContactInformation(user: user))
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { completion in
                guard case .failure(let error) = completion else { return }
                state.error = error.identifiable
            }, receiveValue: { _ in })
            .store(in: &cancellables)
    }
}
