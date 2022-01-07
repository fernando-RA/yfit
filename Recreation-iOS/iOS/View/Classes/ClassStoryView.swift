import SwiftUI
import AVKit
import MapKit

struct ClassStoryView: View {
    @Environment(\.presentationMode) var presentationMode: Binding<PresentationMode>
    @Environment(\.authManager) var auth
    @Environment(\.apiClient) var client
    @State var isOpen: Bool = false
    @State private var isPresentingCheckout = false

    let trainerClass: TrainerClass
    let viewType: ClassViewType
    var image: UIImage?
    var trailingBarItem: AnyView?

    var body: some View {
        LazyView {
            GeometryReader { geometry in
                checkoutNavLink
                classPhoto
                gradientView()
                topDetailsView
                StoryBottomSheet(
                    isOpen: $isOpen,
                    maxHeight: geometry.size.height * 0.96
                ) {
                    ClassStoryTextAndLocationDetails(trainerClass: trainerClass, viewType: viewType, onReservation: {
                        isPresentingCheckout = true
                    })
                    .padding(.bottom)
                }
            }
        }
            .navigationBarBackButtonHidden(true)
            .edgesIgnoringSafeArea(.all)
            .navigationBarHidden(true)
    }

    private var classPhoto: some View {
        Group {
                if let image = image {
                    Image(uiImage: image)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height, alignment: .center)
            } else {
                CachedImage(url: trainerClass.featuredPhotoURL, height: UIScreen.main.bounds.height, width: UIScreen.main.bounds.width)
            }
        }
        .ignoresSafeArea()
    }

    private var topDetailsView: some View {
        let viewModel = MatchesViewModel(client: client, auth: auth)
        return VStack {
            HStack {
                closeButton
                Spacer()
                trailingBarItem
            }
            .padding(20)
            Spacer()
            ClassStoryVideoOverlayView(trainerClass: trainerClass, viewType: viewType, onReserveTap: {
                isPresentingCheckout = true
            })
        }
        .padding(.top, 30)
        .padding(.bottom, 60)
        .foregroundColor(.white)
    }

    private var closeButton: some View {
        Button(action: {
            presentationMode.wrappedValue.dismiss()
        }) {
            ZStack {
                Circle()
                    .fill(style: FillStyle())
                    .frame(width: 40, height: 40, alignment: .center)
                Image(systemName: "xmark").foregroundColor(.black).frame(width: 14, height: 14, alignment: .center)
            }
        }
    }

    private var checkoutNavLink: some View {
        VStack {
            NavigationLink(
                destination: LazyView { checkout },
                isActive: $isPresentingCheckout,
                label: { EmptyView() })
            emptyNavigation
        }
    }

    private var checkout: some View {
        let viewModel = CheckoutViewModel(trainerClass: trainerClass, dependencies: .init(
            paymentProvider: StripePaymentProvider(),
            auth: auth,
            client: client
        ))
        return CheckoutView(viewModel: viewModel, isPresented: $isPresentingCheckout)
    }

    private func gradientView() -> some View {
        return Rectangle()
            .fill(
                LinearGradient(gradient: Gradient(colors: [.clear, .black]), startPoint: .center, endPoint: .bottom)
            )
            .ignoresSafeArea()
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

struct ClassDetailView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            ClassStoryView(trainerClass: .create(), viewType: .reservable, image: UIImage.init())
        }
    }
}

#endif
