import SwiftUI

extension Binding {
    static func notNil<A>(_ binding: Binding<A?>) -> Binding<Bool> {
        .init(
            get: { binding.wrappedValue != nil },
            set: { bool in
                guard bool == false else { return }
                binding.wrappedValue = nil
            })
    }
}

extension Binding where Value == String? {
    func wrapOptional() -> Binding<String> {
        .init(
            get: { wrappedValue ?? "" },
            set: { newValue in
                if newValue.isEmpty {
                    wrappedValue = nil
                } else {
                    wrappedValue = newValue
                }
            })
    }
}
