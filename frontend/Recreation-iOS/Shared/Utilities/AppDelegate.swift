//
//  AppDelegate.swift
//  Recreation-iOS
//
//  Created by Mike  Van Amburg on 9/12/21.
//

import UIKit
import UserNotifications
import SwiftUI
import OneSignal

class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        OneSignal.setLogLevel(.LL_VERBOSE, visualLevel: .LL_NONE)
        OneSignal.initWithLaunchOptions(launchOptions)
        OneSignal.setAppId("c27c554e-3e6b-4878-a860-54b5209dc4dd")

        return true
    }
}
