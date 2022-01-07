//
//  OtherClassesFromTrainer.swift
//  Recreation-iOS
//
//  Created by Mike  Van Amburg on 8/4/21.
//

import SwiftUI

struct OtherClassesFromTrainer: View {
    @StateObject var trainerClassFeedViewModel: OtherEventsFromUserViewModel
    @StateObject var classFeedViewModel: EventsViewModel
    @StateObject var matchesVM: MatchesViewModel
    var trainer: TrainerClass
    var body: some View {
        VStack {
            HStack {
                ForEach(trainerClassFeedViewModel.state.classes) { otherclass in
                    classRow(for: otherclass)
                }
            }
        }
        .onLoad {
            trainerClassFeedViewModel.fetchOtherClasses(trainer)
        }
    }

    private func classRow(for trainerClass: TrainerClass) -> some View {
        ClassCard(viewModel: matchesVM, trainerClass: trainerClass, reserveAction: {
            classFeedViewModel.reserve(trainerClass)
        })
    }
}
#if DEBUG
struct OtherClassesFromTrainer_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: preview)
    }

    private static var preview: some View {
        let trainerClassFeedViewmodel = OtherEventsFromUserViewModel(client: InMemoryAPIClient(), user: User.create())
        let classFeedViewModel = EventsViewModel(client: InMemoryAPIClient())
        let matches = MatchesViewModel(client: InMemoryAPIClient(), auth: AuthSessionManager(client: InMemoryAPIClient(), google: InMemoryGoogleAuthenticator()))
        return OtherClassesFromTrainer(trainerClassFeedViewModel: trainerClassFeedViewmodel, classFeedViewModel: classFeedViewModel, matchesVM: matches, trainer: .create())
    }
}
#endif
