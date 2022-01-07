import Foundation
import Combine

final class EventsViewModel: ObservableObject {
    @Published var state = EventsFeedState()

    private var perPage = 40
    var finalPage = 0
    var hasMoreClasses = true
    private let client: APIClient
    private var cancellables = [AnyCancellable]()

    init(client: APIClient) {
        self.client = client
    }

    func fetchNextPage() {
        guard state.hasNextPage else { return }

        if state.totalClassCount != nil {
            if (state.classes.count + perPage ) >= state.totalClassCount! {
                finalPage = state.totalClassCount! - state.classes.count - 1}
            guard finalPage != 0 else {
                hasMoreClasses = false
                return
            }
        } else {
            finalPage = perPage
        }

        client
            .dispatch(FetchClasses(limit: finalPage, offset: state.lastPage?.offset))
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [weak self] page in
                self?.append(page)
            }
            .store(in: &cancellables)
    }

    func reserve(_ trainerClass: TrainerClass) {
        state.classStagedForCheckout = trainerClass
        state.showCheckout = true
    }

    private func append(_ page: ClassPage) {
        state.pages.append(page)
        state.classes.append(contentsOf: page.results)
    }
    func resetClasses() {
        state.pages.removeAll()
        state.classes.removeAll()
    }
}
