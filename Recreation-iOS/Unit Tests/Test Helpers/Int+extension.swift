import Foundation

extension Int {
    func times(_ handler: @escaping () -> Void) {
        guard self > 0 else { return }

        for _ in 0..<self {
            handler()
        }
    }
}
