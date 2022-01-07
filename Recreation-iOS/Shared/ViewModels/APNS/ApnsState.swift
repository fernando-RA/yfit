//
//  ApnsState.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/4/21.
//

import Foundation
import SwiftUI

struct ApnsState {
    var `apns`: Apns
    var id: Int = UUID().hashValue
    var name: String = ""
    var applicationId: String = UUID().uuidString
    var registrationId: String = ""
    var deviceId: String = UIDevice.current.identifierForVendor?.uuidString ?? ""
    var active: Bool = true
    var dateCreated: String = Date().description

    init() {
        self.apns = Apns(id: self.id, name: self.name, applicationId: self.applicationId, registrationId: self.registrationId, deviceId: self.deviceId, active: self.active, dateCreated: self.dateCreated)
    }
}
