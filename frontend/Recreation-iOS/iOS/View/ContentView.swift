import SwiftUI
import MapKit
import Sentry

struct ContentView: View {
    @Environment(\.matches) var matches
    @Environment(\.apiClient) var client
    @StateObject var viewModel: EventsViewModel
    @StateObject var gps: GPS
    @State var isOpen = false
    @State var selectedClass: TrainerClass?
    @State var firstTimeUser = false
    @State var isFollowingOnboardShowing = true
    @State var isShowingLocationPremissions = true

    var body: some View {
        LazyView {
            ZStack {
                MapView(classes: viewModel.state.classes, selectedClass: $selectedClass, isOpen: $isOpen)

                NavMapOverlayView()
                    .padding(.top, 60)
                    .padding(.horizontal)
                GeometryReader { geometry in
                    BottomSheetView(
                        isOpen: $isOpen,
                        maxHeight: geometry.size.height * 0.9
                    ) {
                        classFeed
                    }
                }
                if  !UserDefaults.standard.bool(forKey: "didLaunchBefore") {
                if isFollowingOnboardShowing == true || isShowingLocationPremissions == true {
                    Rectangle()
                        .fill(Color.black)
                        .opacity(0.5)
                        .frame(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height)
                        .edgesIgnoringSafeArea(.all)
                }

                    if isFollowingOnboardShowing && (gps.isUnAuthorized || gps.isUnAuthorized || gps.isAuthorized) {
                        FollowingOnboardingCard(isShowing: $isFollowingOnboardShowing)
                    }

                    if isShowingLocationPremissions {
                        LocationPermissionCard(isShowing: $isShowingLocationPremissions)
                    }
                }
            }
        }
        .alert(isPresented: $gps.state.invalidPermission) {
            Alert(
                title: Text("Serviços de localização'"),
                message: Text("Vá para Configurações e ative os serviços de localização para continuar usando nosso aplicativo. Usamos sua localização para ajudar a encontrar aulas em sua área"),
                primaryButton: .cancel(Text("Cancel")),
                secondaryButton: .default(Text("Settings"), action: {
                    if let url = URL(string: UIApplication.openSettingsURLString), UIApplication.shared.canOpenURL(url) {
                        UIApplication.shared.open(url, options: [:], completionHandler: nil)
                    }
                }))
        }
        .onLoad {
            viewModel.fetchNextPage()
            matches.fetchFollowingIdList()
            if !UserDefaults.standard.bool(forKey: "didLaunchBefore") {
                firstTimeUser = true
            }
        }
        .onDisappear {
            if !UserDefaults.standard.bool(forKey: "didLaunchBefore") {
                UserDefaults.standard.set(true, forKey: "didLaunchBefore")
            }
        }
        .edgesIgnoringSafeArea(.all)
        .navigationBarTitle("")
        .navigationBarHidden(true)
        .navigationBarBackButtonHidden(true)
    }

    private var classFeed: some View {
        ClassFeedView(viewModel: viewModel, isOpen: $isOpen)
    }
}

#if DEBUG

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        let viewModel = EventsViewModel(client: InMemoryAPIClient())
        let view = ContentView(viewModel: viewModel, gps: GPS.init(), selectedClass: TrainerClass.create(), firstTimeUser: true)
        return PreviewGroup(preview: view)
    }
}

#endif
