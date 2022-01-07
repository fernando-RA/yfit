import Foundation

enum EditProfileAction {
    case save
    case getStripeAccount
    case connectStripeAccount
    case deleteStripeAccount
    case userDeletsStripeAccount
    case handleStripeFormUrl(URL)
    case toggleWorkoutSelection(WorkoutType)
    case editWorkouts
    case getUserAcct
    case changeAcctType
}
