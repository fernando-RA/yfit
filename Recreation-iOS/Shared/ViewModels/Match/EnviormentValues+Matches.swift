//
//  EnviormentValues+Matches.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/11/21.
//

import SwiftUI

struct MatchesEnviormentKey: EnvironmentKey {
    static let defaultValue = MatchesViewModel(
        client: DefaultAPIClient.shared,
        auth: AuthSessionManager(client: DefaultAPIClient.shared, google: DefaultGoogleAuthenticator.shared))
}

extension EnvironmentValues {
    var matches: MatchesViewModel {
        get {
            self[MatchesEnviormentKey.self]
        }
        set {
            self[MatchesEnviormentKey.self] = newValue
        }
    }
}
