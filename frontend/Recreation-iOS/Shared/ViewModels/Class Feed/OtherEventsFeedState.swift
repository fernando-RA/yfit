//
//  OtherClassesFeedState.swift
//  Recreation-iOS
//
//  Created by Mike  Van Amburg on 8/4/21.
//

struct OtherEventsFeedState {
    var classes: [TrainerClass] = []
    var pages: [OtherClassesResults] = []
    var error: IdentifiableError?
    var showCheckout = false
    var classStagedForCheckout: TrainerClass?
}
