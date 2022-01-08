//
//  OtherClassesFromTrainer.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 8/2/21.
//

import SwiftUI

struct OtherReservableClassesFromTrainer: View {
    @Environment(\.apiClient) var client
    @Environment(\.authManager) var sessionManager

    @ObservedObject var viewModel: OtherEventsFromUserViewModel
    @StateObject var classFeedViewModel: EventsViewModel
    var body: some View {
        ZStack {
            VStack {
                HStack {
                    Text("Próximas aulas de \(viewModel.user.fullName)")
                        .font(.system(size: 14, weight: .bold, design: .rounded))
                    Spacer()
                }.padding(.horizontal)
                    ForEach(viewModel.state.classes) { otherclass in
                        classRow(for: otherclass)
                    }
            }
                    checkoutNavigation
                }
                .alert($viewModel.state.error)
        .onLoad {
            viewModel.fetchOtherReservableClasses()
        }
    }

    private func classRow(for trainerClass: TrainerClass) -> some View {
        let matchesVM = MatchesViewModel(client: client, auth: sessionManager)
        return ReservableClassCard(showTrainer: false, trainerClass: trainerClass, reserveAction: {
            viewModel.reserve(trainerClass)
        })
    }

    private var checkoutNavigation: some View {
        VStack {
            NavigationLink(destination: checkout, isActive: $viewModel.state.showCheckout) {
                EmptyView()
            }
            emptyNavigation
        }
    }

    private var checkout: some View {
        LazyView {
            Group {
                viewModel.state.classStagedForCheckout.map(checkout)
            }
        }
    }

    private func checkout(for trainerClass: TrainerClass) -> some View {
        let viewModel = CheckoutViewModel(
            trainerClass: trainerClass,
            dependencies: .init(
                paymentProvider: StripePaymentProvider(),
                auth: sessionManager,
                client: client
            )
        )
        return CheckoutView(viewModel: viewModel, isPresented: self.$classFeedViewModel.state.showCheckout)
    }

    /*
     This is a hacky fix for a SwiftUI navigation bug.
     https://developer.apple.com/forums/thread/677333
     */
    private var emptyNavigation: some View {
        NavigationLink(destination: EmptyView()) {
            EmptyView()
        }
    }
}

#if DEBUG
struct OtherReservableClassesFromTrainer_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: preview)
    }

    private static var preview: some View {
        let trainerClassFeedViewmodel = OtherEventsFromUserViewModel(client: InMemoryAPIClient(), user: User.create())
        let classFeedViewModel = EventsViewModel(client: InMemoryAPIClient())
        return OtherReservableClassesFromTrainer(viewModel: trainerClassFeedViewmodel, classFeedViewModel: classFeedViewModel)
    }
}
#endif
