import Foundation

extension TimeInterval: Identifiable {
    public var id: Double {
        self
    }

    var formatted: String {
        let formatter = DateComponentsFormatter()
        formatter.unitsStyle = .abbreviated
        formatter.zeroFormattingBehavior = .dropAll
        formatter.allowedUnits = [.day, .hour, .minute, .second]
        return formatter.string(from: self) ?? ""
    }

    func and(_ interval: TimeInterval) -> TimeInterval {
        self + interval
    }
}

extension Int {
    var minutes: TimeInterval {
        .init(self * 60)
    }

    var hour: TimeInterval {
        .init(self * 60 * 60)
    }

    var hours: TimeInterval {
        hour
    }
}
