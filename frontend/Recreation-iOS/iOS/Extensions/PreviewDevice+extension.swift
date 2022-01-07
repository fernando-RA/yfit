#if DEBUG

import SwiftUI

extension PreviewDevice: Identifiable {
    public var id: String {
        rawValue
    }

    var name: String {
        rawValue
    }

    static let list = [
        "iPhone 12 Max",
        "iPhone SE (2nd generation)"
    ]
    .map { name in
        PreviewDevice(rawValue: name)
    }
}

#endif
