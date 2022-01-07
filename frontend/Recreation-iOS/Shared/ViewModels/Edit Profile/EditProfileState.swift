import Foundation
import SwiftUI

struct EditProfileState {
    var error: IdentifiableError?
    var accessToken: String?
    var stripeIsConnected = false
    var isLoadingStripe = false
    var stripeLink: URL?
    var firstName = ""
    var lastName = ""
    var bio = ""
    var instagramLink = ""
    var stripeAccountId = ""
    var userType: UserType = .trainer
    var isEditingWorkouts = false
    var possibleWorkouts: [WorkoutType] = []
    var selectedWorkouts: [WorkoutType] = []
    var encodedProfilePicture: String?
    var isUpdatingUser = false
    var showImgPicker = false
    var showImgActionSheet = false
    var sourceType: UIImagePickerController.SourceType = .camera
    var img: UIImage?
    var stripeNavlink = false
    var showProfile = false
    var showDestructiveAlert = false
    var stripePaymentsEnabled = false

    var user: User? {
        didSet {
            guard let user = user else { return }
            firstName = user.firstName
            lastName = user.lastName
            bio = user.bio
            instagramLink = URLComponents(string: self.user?.instagramLink ?? "" )?.path.replacingOccurrences(of: "/", with: "", options: NSString.CompareOptions.literal, range: nil) ?? ""
            selectedWorkouts = user.workoutTypes
            stripeAccountId = user.stripeAccountId ?? ""
        }
    }

    var canSave: Bool {
        if isUpdatingUser {
            return false
        } else {
            return nameIsFilled && isValidInput(bio) && stripePaymentsEnabled && profileImgIsFilled
        }
    }

    var profilePictureURL: URL? {
        user?.profilePictureURL
    }

    private var nameIsFilled: Bool {
        [firstName, lastName].allSatisfy(isValidInput)
    }

    private func isValidInput(_ input: String) -> Bool {
        !(input.isNull || input.isEmpty)
    }

    var profileImgIsFilled: Bool {
        profilePictureURL != nil || encodedProfilePicture != nil
    }

    enum UserType: String {
        case trainer, client
    }
}
