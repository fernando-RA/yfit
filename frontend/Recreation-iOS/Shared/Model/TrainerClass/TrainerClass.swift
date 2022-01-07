import Foundation
import SwiftUI

struct TrainerClass: Identifiable, Codable, Equatable {
    let id: Int
    var type: ClassType
    var featuredPhoto: String?
    @FailableDecodable var location: Location?
    var duration: Int
    var attendLimitCount: Int
    var name: String
    var isAttendeeLimit: Bool
    var price: Money
    var details: String
    var startTime: Date
    let clients: Int
    @SkipEncoding var author: User
    @RemoveNilValuesDecodable var tags: [ClassTag]
    var safetyProtocol: String?
    var equipment: String?
    var locationNotes: String?
    var cancellationPolicy: String
    var publishedAt: Date?
    var classLink: String?
    var canceled: Bool
    var trendingOverride: Bool?
    enum ClassType: String, Codable {
        case inPerson = "in_person"
        case virtual = "virtual"
    }

    var hasSpotsLeft: Bool {
        guard isAttendeeLimit else {
            return true
        }
        return clients < attendLimitCount
    }

    var isSoldOut: Bool {
        !hasSpotsLeft
    }

    var durationInMinutes: Int {
        get { duration }
        set { duration = newValue }
    }

    var durationTimeInterval: TimeInterval {
        get { TimeInterval(durationInMinutes * 60) }
        set { durationInMinutes = Int(newValue / 60) }
    }

    var featuredPhotoURL: URL? {
        get { featuredPhoto.flatMap(URL.init(string:)) }
        set { featuredPhoto = newValue?.absoluteString }
    }

    var formattedDuration: String {
        dateInterval.formattedDuration
    }

    var formattedHours: String {
        dateInterval.formattedHours
    }

    var storyVideoURL: URL? {
        URL(string: "https://bit.ly/swswift")
    }

    var feedVideoURL: URL? {
        URL(string: "https://bit.ly/swswift")
    }

    var isFree: Bool {
        price.isFree
    }

    var totalEarned: Money {
        price * clients
    }

    private var dateInterval: DateInterval {
        .init(start: startTime, duration: durationTimeInterval)
    }
}

#if DEBUG

extension TrainerClass {
    static func create(id: Int = 0,
                       type: ClassType = .inPerson,
                       featuredPhoto: String? = "<featured_photo>",
                       location: Location? = nil,
                       duration: Int = 30,
                       attendLimitCount: Int = 10,
                       name: String = "60 min Vinyasa",
                       isAttendeeLimit: Bool = true,
                       price: Money = 1000.cents,
                       details: String = "<details>",
                       startTime: Date = .init(),
                       clients: Int = 0,
                       author: User = .create(),
                       tags: [ClassTag] = [],
                       safetyProtocol: String? = nil,
                       equipment: String? = nil,
                       locationNotes: String? = nil,
                       cancellationPolicy: String = "<cancellation_policy>",
                       publishedAt: Date? = nil,
                       canceled: Bool = false) -> Self {
        Self(
            id: id,
            type: type,
            featuredPhoto: featuredPhoto,
            location: location,
            duration: duration,
            attendLimitCount: attendLimitCount,
            name: name,
            isAttendeeLimit: isAttendeeLimit,
            price: price,
            details: details,
            startTime: startTime,
            clients: clients,
            author: author,
            tags: tags,
            safetyProtocol: safetyProtocol,
            equipment: equipment,
            locationNotes: locationNotes,
            cancellationPolicy: cancellationPolicy,
            publishedAt: publishedAt,
            canceled: canceled
        )
    }
}

#endif
