//
//  OtherClassesFeedViewModel.swift
//  Recreation-iOS
//
//  Created by Mike  Van Amburg on 8/4/21.
//

import Foundation
import Combine

final class OtherEventsFromUserViewModel: ObservableObject {
    @Published var state = OtherEventsFeedState()
    var user: User
    private let client: APIClient
    private var cancellables = [AnyCancellable]()

    init(client: APIClient, user: User) {
        self.client = client
        self.user = user
    }

    func fetchOtherClasses(_ trainerClass: TrainerClass) {
        client
            .dispatch(FetchTrainersOtherClasses(user: user))
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [weak self] page in
                self?.appendOtherClassResults(page, selectedClass: trainerClass)
            }
            .store(in: &cancellables)
    }
    func fetchOtherReservableClasses() {
        client
            .dispatch(FetchTrainersOtherClasses(user: user))
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                guard case .failure(let error) = completion else { return }
                self?.state.error = error.identifiable
            } receiveValue: { [weak self] page in
                self?.appendOtherReservableClassResults(page)
            }
            .store(in: &cancellables)
    }

    func reserve(_ trainerClass: TrainerClass) {
        state.classStagedForCheckout = trainerClass
        state.showCheckout = true
    }

    private func appendOtherClassResults(_ page: OtherClassesResults, selectedClass: TrainerClass) {
        state.pages.append(page)
        state.classes.append(contentsOf: page.results)
        state.classes.removeAll { classId in
            return classId.id == selectedClass.id
          }
    }
    private func appendOtherReservableClassResults(_ page: OtherClassesResults) {
        state.pages.append(page)
        state.classes.append(contentsOf: page.results)
    }
    func resetClasses() {
        state.pages.removeAll()
        state.classes.removeAll()
    }
}
