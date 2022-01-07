import Foundation
import Combine

final class TrainerClassFeedViewModel: ObservableObject {
    @Published var state = TrainerClassFeedState()

    private let client: APIClient
    private let auth: AuthSessionManager
    private var cancellables = [AnyCancellable]()

    init(client: APIClient, auth: AuthSessionManager) {
        self.client = client
        self.auth = auth
        refreshFeed()
    }

    func createNewClass() {
        guard let user = auth.signedInUser else { return }
        state.presentedForm = .create(author: user)
    }

    func refreshFeed() {
        state.isLoadingClasses = true

        client
            .dispatch(FetchTrainerClassPage())
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                self?.state.isLoadingClasses = false
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [weak self] page in
                self?.resetFeed(page)
            }
            .store(in: &cancellables)
    }

    private func resetFeed(_ page: TrainerClassPage) {
        state.pages = [page]

        if state.upcomingClasses.isEmpty && !state.pastClasses.isEmpty {
            state.selectedSection = .past
        } else {
            state.selectedSection = .upcoming
        }
    }

    func fetchAttendeesGoing(trainer: TrainerClass) {
        client
            .dispatch(FetchAttendees(trainer: trainer))
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [self] page in
                state.attendeeList.removeAll()
                state.attendees.removeAll()
                append(page)
            }
            .store(in: &cancellables)
    }
    func updateAttendence(spot: Spot) {
        client
            .dispatch(UpdateAttendence(spot: spot))
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: {_ in }
            .store(in: &cancellables)
    }
    func fetchAttendee(spot: Spot) {
        client
            .dispatch(GetAttendee(spot: spot))
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [weak self] attendee in
                if let index = self?.state.attendees.firstIndex(where: {$0.id == attendee.id}) {
                    self?.state.attendees[index].didAttend = attendee.didAttend
                } else {
                self?.state.attendees.append(attendee)
                }
            }
            .store(in: &cancellables)
    }

    private func append(_ page: AttendeeList) {
        state.attendeeList.append(page)
        state.attendees.append(contentsOf: page.results.sorted {
            $0.firstName < $1.firstName
        })
    }

    func cancelClass(trainer: TrainerClass) {
        client
            .dispatch(CancelTrainerClassRequest(classId: trainer.id))
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { _ in
            }
            .store(in: &cancellables)
    }
}
