import SwiftUI

struct ClassFeedView: View {
    @StateObject var viewModel: EventsViewModel
    @Environment(\.apiClient) var client
    @Environment(\.authManager) var sessionManager

    @Binding var isOpen: Bool

    var body: some View {
        if viewModel.state.classes.isEmpty {
            Spacer()
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: Color.green))
                .frame(width: 100, height: 100, alignment: .center)
            Spacer()
        } else {
            ZStack {
                        if isOpen {
                            scrollingClassList
                        } else {
                            nonScrollingClassList
                        }
                        checkoutNavigation
                    }
                    .alert($viewModel.state.error)
        }
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
                state.classStagedForCheckout.map(checkout)
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
        return CheckoutView(viewModel: viewModel, isPresented: self.$viewModel.state.showCheckout)
    }

    private var scrollingClassList: some View {
        ScrollView(.vertical) {
            PullToRefresh(coordinateSpaceName: "pullToRefresh") {
                viewModel.resetClasses()
                viewModel.fetchNextPage()
                }
            if let count = state.totalClassCount {
                Text("\(count) Aulas para você").font(.title)
            }

            LazyVStack {
                ForEach(state.classes) { trainerClass in
                        classRow(for: trainerClass)
                    .foregroundColor(.primary)
                }
                .animation(.none)
                if viewModel.hasMoreClasses {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: Color.clear))
                        .onAppear {
                            viewModel.fetchNextPage()
                        }
                }
            }
            .animation(.none)
        }
        .coordinateSpace(name: "pullToRefresh")
    }

    private var nonScrollingClassList: some View {
        VStack {
            if let count = state.totalClassCount {
                Text("\(count) Aulas para você").font(.title)
            }
            LazyVStack {
                ForEach(state.classes) { trainerClass in
                        classRow(for: trainerClass)
                            .id(trainerClass.id)
                    .foregroundColor(.primary)
                }
                if viewModel.hasMoreClasses {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: Color.green))
                        .onAppear {
                            viewModel.fetchNextPage()
                        }
                }
            }
        }
    }
    private func classRow(for trainerClass: TrainerClass) -> some View {
        return ReservableClassCard(
           trainerClass: trainerClass,
            reserveAction: {
                viewModel.reserve(trainerClass)
            }
        )
    }

    private var state: EventsFeedState {
        viewModel.state
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

struct ClassCardFeedView_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: preview)
    }

    private static var preview: some View {
        let viewModel = EventsViewModel(client: InMemoryAPIClient())
        return ClassFeedView(viewModel: viewModel, isOpen: .constant(true))
    }
}

#endif
