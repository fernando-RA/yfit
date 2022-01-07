import Foundation

extension DateInterval {
    var formattedDuration: String {
        duration.formatted
    }

    var formattedHours: String {
        let formatter = DateIntervalFormatter()
        formatter.dateStyle = .none
        formatter.timeStyle = .short
        return formatter.string(from: self) ?? ""
    }
}
