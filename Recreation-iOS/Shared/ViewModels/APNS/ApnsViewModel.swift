//
//  ApnsViewModel.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/4/21.
//

import Foundation
import Combine

class ApnsViewModel: ObservableObject {
    @Published var state = ApnsState()
    private let client: APIClient
    private var cancellables = [AnyCancellable]()

    init(client: APIClient) {
        self.client = client
    }

    func getAPNS() {
        client
            .dispatch(GetAPNS())
            .receive(on: DispatchQueue.main)
            .sink { _ in
            } receiveValue: { response in
                self.state.registrationId = response.registrationId
            }
            .store(in: &cancellables)
    }

    func postAPNS() {
        client
            .dispatch(PostAPNS(apns: Apns(id: state.id, name: state.name, applicationId: state.applicationId, registrationId: state.registrationId, deviceId: state.deviceId, active: state.active, dateCreated: state.dateCreated)))
            .receive(on: DispatchQueue.main)
            .sink { _ in
            } receiveValue: { response in
                self.state.registrationId = response.registrationId
            }
            .store(in: &cancellables)
    }
}
