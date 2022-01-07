import Foundation
import Combine

final class ClassFormViewModel: ObservableObject {
    @Published var state: ClassFormState

    private let client: APIClient
    private let onPublish: () -> Void
    private var cancellables = Set<AnyCancellable>()

    init(client: APIClient, type: ClassFormType, onPublish: @escaping () -> Void) {
        self.client = client
        self.state = .init(type: type)
        self.onPublish = onPublish
    }

    func send(_ action: ClassFormAction) {
        switch action {
        case .preview:
            state.isShowingPreview = true

        case .publish:
            state.isLoading = true

            publishClass()
                .receive(on: DispatchQueue.main)
                .sink { [weak self] completion in
                    self?.state.isLoading = false
                    guard case .failure(let error) = completion else { return }
                    self?.state.error = error.identifiable
                } receiveValue: { [weak self] in
                    self?.onPublish()
                }
                .store(in: &cancellables)
        }
    }

    private func publishClass() -> AnyPublisher<Void, Error> {
        switch state.type {
        case .edit:
            return updateClass()
                .flatMap(uploadPhotoIfNeeded)
                .eraseToAnyPublisher()

        case .create, .duplicate:
            return createClass()
                .flatMap(uploadPhotoIfNeeded)
                .eraseToAnyPublisher()
        }
    }

    private func updateClass() -> AnyPublisher<TrainerClass, Error> {
        client
            .dispatch(UpdateClass(class: state.class))
            .mapError { $0 as Error }
            .eraseToAnyPublisher()
    }

    private func createClass() -> AnyPublisher<TrainerClass, Error> {
        state.class.publishedAt = .now

        return client
            .dispatch(CreateClass(class: state.class))
            .mapError { $0 as Error }
            .eraseToAnyPublisher()
    }

    private func uploadPhotoIfNeeded(for trainerClass: TrainerClass) -> AnyPublisher<Void, Error> {
        guard let encoded = state.encodedFeaturedPhoto else {
            return .just(Void())
        }
        return client
            .dispatch(SetFeaturedPhoto(encodedPhoto: encoded, class: trainerClass))
            .map { _ in }
            .mapError { $0 as Error }
            .eraseToAnyPublisher()
    }
}
