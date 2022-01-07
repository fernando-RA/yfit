#if DEBUG

import SwiftUI

struct PreviewContext: Identifiable {
    let device: PreviewDevice
    let colorScheme: ColorScheme

    var id: String {
        device.id + String(describing: colorScheme)
    }

    var displayName: String {
        "\(colorSchemeDisplayName) \(device.name)"
    }

    static let all = PreviewDevice.list.reduce([]) { accumulation, device in
        accumulation + ColorScheme.allCases.map { scheme in
            PreviewContext(device: device, colorScheme: scheme)
        }
    }

    private var colorSchemeDisplayName: String {
        switch colorScheme {
        case .dark:
            return "Dark Mode"
        case .light:
            return "Light Mode"
        @unknown default:
            return "Unknown"
        }
    }
}

#endif
