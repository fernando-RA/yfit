import Foundation

struct TrainerClassFeedState {
    var error: IdentifiableError?
    var selectedClass: TrainerClass?
    var canceledClass: TrainerClass?
    var selectedClient: ClientClassSignUp?
    var presentedForm: ClassFormType?
    var selectedSection = MyClassesSection.upcoming
    var pages: [TrainerClassPage] = []
    var clients: [ClientPage] = []
    var isLoadingClasses = false
    var firstName = ""
    var lastName = ""
    var emailAddress = ""
    var didAttend: Bool?
    var updateFeed: Bool = false
    let paidClients = [ "not_paid", "paid", "canceled", "failed", "refunded", "pending_capture"]
    var attendeeList: [AttendeeList] = []
    var allClasses: [TrainerClass] {
        pages.flatMap(\.results)
    }

    var pastClasses: [TrainerClass] {
        allClasses.filter { $0.startTime < .now || $0.canceled}
    }

    var upcomingClasses: [TrainerClass] {
        allClasses.filter { $0.startTime >= .now && $0.canceled == false }
    }

    var clientsList: [ClientClassSignUp] {
        clients.flatMap(\.results)
    }
    var attendees: [Spot] = []

    var clientsGoing: [ClientClassSignUp] {
        guard let payment = selectedClient?.paymentstatus else {
            return clientsList
        }
       return clientsList.filter {_ in
            paidClients.contains(payment)
        }
    }
    var spot: Spot? {
        didSet {
            guard let spot = spot else { return }
            firstName = spot.firstName
            lastName = spot.lastName
            emailAddress = spot.emailAddress
            didAttend = spot.didAttend
        }
    }// todo: make init for speed
}

extension Array where Element: Hashable {
    func removingDuplicates() -> [Element] {
        var addedDict = [Element: Bool]()

        return filter {
            addedDict.updateValue(true, forKey: $0) == nil
        }
    }

    mutating func removeDuplicates() {
        self = self.removingDuplicates()
    }
}
