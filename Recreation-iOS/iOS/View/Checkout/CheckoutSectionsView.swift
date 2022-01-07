import SwiftUI

struct CheckoutSectionsView: View {
    @Environment(\.authManager) var client
    @ObservedObject var viewModel: CheckoutViewModel

    var body: some View {
        Group {
            ForEach(state.sections) { section in
                sectionView(for: section)
            }
        }
    }

    private func sectionView(for section: CheckoutSection) -> some View {
        Group {
            HStack {
                HStack(alignment: .top, spacing: 10) {
                    photo(for: section)

                    VStack(alignment: .leading, spacing: 10) {
                        CheckoutSectionTitle(section: section)
                        details(for: section)
                    }
                }

                section.accessoryAction.map { action in
                    Group {
                        Spacer()
                        editButton(for: action)
                    }
                }
            }
            .padding(.vertical, 10)
            .padding(.horizontal)

            Divider()
        }
    }

    private func details(for section: CheckoutSection) -> some View {
        Group {
            switch section {
            case .classInfo:
                CheckoutClassDetails(trainerClass: state.trainerClass)

            case .totals:
                CheckoutTotalsView(lineItems: state.totals)

            case .placeOrder:
                placeOrderButton

            case .contactInfo:
                if state.contactInfo.isFilled {
                    CheckoutContactInfoDetails(state: state.contactInfo)
                }

            case .cancellationPolicy:
                Text("Speak to your trainer before class.")
                    .font(.system(size: 16))

            case .waiver:
                WaiverDetails(isChecked: $viewModel.state.agreeToWaiver)
            }
        }
    }

    private func photo(for section: CheckoutSection) -> some View {
        Group {
            if case .classInfo(let trainerClass) = section {
               CachedImage(url: trainerClass.featuredPhotoURL, height: 180, width: 90)
                    .clipShape(RoundedRectangle(cornerRadius: 15))
            }
        }
    }

    private func editButton(for action: CheckoutAction) -> some View {
        Button((client.session.user == nil) ? "Add" : "Edit") {
            viewModel.send(action)
        }
    }

    private var placeOrderButton: some View {
        PlaceOrderButton(
            paymentProvider: viewModel.paymentProvider,
            labelType: state.availabilitiesStatus == .noSpotsLeft ? .noSpotsLeft : .placeOrder,
            isEnabled: state.canCompleteCheckout,
            onAction: viewModel.send
        )
    }

    private var state: CheckoutState {
        viewModel.state
    }
}
