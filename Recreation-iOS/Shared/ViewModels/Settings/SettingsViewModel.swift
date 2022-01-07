import Combine

final class SettingsViewModel: ObservableObject {
    @Published var state = SettingsState()

    private let auth: AuthSessionManager
    private var cancellables = Set<AnyCancellable>()

    init(auth: AuthSessionManager) {
        self.auth = auth
        prefillContactInfo()
    }

    func save(_ contactInfo: ContactInfo, saveContactInfo: Bool) {
        auth
            .updateSignedInUser { user in
                user.update(with: contactInfo)
            }
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [weak self] _ in
                self?.state.isEditingContactInfo = false
            }
            .store(in: &cancellables)
    }

    private func prefillContactInfo() {
        guard let user = auth.signedInUser else { return }
        state.contactInfo = user.contactInfo
        state.canEditContactInfo = true
    }
}
