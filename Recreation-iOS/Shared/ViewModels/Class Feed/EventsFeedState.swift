import Foundation

struct EventsFeedState {
    var classes: [TrainerClass] = []
    var pages: [ClassPage] = []
    var error: IdentifiableError?
    var showCheckout = false
    var classStagedForCheckout: TrainerClass?

    var lastPage: ClassPage? {
        pages.last
    }

    var totalClassCount: Int? {
        lastPage?.count
    }

    var hasNextPage: Bool {
        guard let limit = totalClassCount else {
            return true
        }
        return classes.count < limit
    }
}
