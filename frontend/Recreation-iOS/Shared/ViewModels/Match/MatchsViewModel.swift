//
//  MatchsViewModel.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/10/21.
//

import Foundation
import Combine

final class MatchesViewModel: ObservableObject {
    @Published var state = MatchesState()

    private let client: APIClient
    private let auth: AuthSessionManager
    private var cancellables = [AnyCancellable]()

    init(client: APIClient, auth: AuthSessionManager) {
        self.client = client
        self.auth = auth
    }

    func fetchMatch(match: Match) {
        guard state.match != nil else {
            return
        }
        client
            .dispatch(GetMatch(match: match))
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [self] response in
                state.match = response
                print(self.state.match ?? "Match is nil")
                // Todo: what do we do with this call
            }
            .store(in: &cancellables)
    }

    func createMatch(userId: Int?, trainerId: Int) {
        guard let id = userId else {
            return
        }
        self.state.following.append(Match(id: 0, created: Date(), user: trainerId, owner: id))
        client
            .dispatch(PostMatch(match: Match(user: trainerId, owner: id)))
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { _ in }
            .store(in: &cancellables)
    }

    private func updateMatch(match: Match) -> AnyPublisher<Match, Error> {
        return client
            .dispatch(UpdateMatch(match: match))
            .mapError { $0 as Error }
            .eraseToAnyPublisher()
    }

    func deleteMatch(match: Int) {
        self.state.following = self.state.following.filter {$0.id != match}
        return client
            .dispatch(DeleteMatch(id: match))
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [weak self] results in
                print(results)
            }
            .store(in: &cancellables)
    }

    func fetchFollowing() {
        state.followedResults.removeAll()
        state.followed.removeAll()

        client
            .dispatch(GetFollowing())
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [weak self] results in
                self?.appendFollowing(results)
            }
            .store(in: &cancellables)
    }

    private func appendFollowing(_ page: Matches) {
        state.followedResults.append(page)
        state.followed.append(contentsOf: page.results)
    }

    func fetchFollowers() {
        state.followersResults.removeAll()
        state.followers.removeAll()

        client
            .dispatch(GetFollowers())
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [weak self] results in
                self?.appendFollowers(results)
            }
            .store(in: &cancellables)
    }

    private func appendFollowers(_ page: Matches) {
        state.followersResults.append(page)
        state.followers.append(contentsOf: page.results)
    }

    func fetchFollowingIdList() {
        client
            .dispatch(GetFollowingIds())
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [weak self] results in
                self?.appendFollowingList(results)
            }
            .store(in: &cancellables)
    }

    private func appendFollowingList(_ page: MatchesID) {
        state.followingResults.append(page)
        state.following.append(contentsOf: page.results)
    }
    func resetFollowingList() {
        state.following.removeAll()
        state.followingResults.removeAll()
    }
}
