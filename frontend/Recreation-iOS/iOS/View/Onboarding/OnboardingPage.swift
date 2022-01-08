import SwiftUI

struct OnboardingPage<Destination: View>: View {
    @ObservedObject var viewModel: OnboardingViewModel
    @State var isActive = true
    let destination: Destination

    var body: some View {
        if #available(iOS 15.0, *) {
        NavigationView {
            ZStack(alignment: .center) {
                router
                    .zIndex(-1)
                heroImage
                    .zIndex(1)
                if !isActive {
                    VStack {
                        HStack {
                            Spacer()
                            skipButton
                        }
                        .animation(.easeInOut)
                        Spacer()

                        loginButtons
                            .animation(.easeIn)
                    }
                    .zIndex(1)
                    .padding()
                }
                VStack {
                    Spacer()
                    OnboardingLabels()
                    if isActive {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: Color.black))
                            .frame(width: 100, height: 100, alignment: .center)
                            .padding(.top)
                    }
                    Spacer()
                    Spacer()
                }
                .zIndex(1)
                .padding()
            }
            .foregroundColor(.white)
            .navigationBarTitle("")
            .navigationBarHidden(true)
            .alert($viewModel.state.error)
            .onAppear {
                isActive = true
                DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                    isActive.toggle()
                }
            }
        }
        .accentColor( .green)
        .navigationViewStyle(StackNavigationViewStyle())
        } else {
            NavigationView {
                ZStack(alignment: .center) {
                    router
                        .zIndex(-1)
                    heroImage
                        .zIndex(1)
                    if !isActive {
                        VStack {
                            HStack {
                                Spacer()
                                skipButton
                            }
                            .animation(.easeInOut)
                            Spacer()

                            loginButtons
                                .animation(.easeIn)
                        }
                        .zIndex(1)
                        .padding()
                    }
                    VStack {
                        Spacer()
                        OnboardingLabels()
                        if isActive {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: Color.black))
                                .frame(width: 100, height: 100, alignment: .center)
                                .padding(.top)
                        }
                        Spacer()
                        Spacer()
                    }
                    .zIndex(1)
                    .padding()
                }
                .foregroundColor(.white)
                .navigationBarTitle("")
                .navigationBarHidden(true)
                .alert($viewModel.state.error)
                .onAppear {
                    isActive = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                        isActive.toggle()
                    }
                }
            }
            .accentColor( .green)
        }
    }

    private var heroImage: some View {
        Image(asset: .onboardingHero)
            .resizable()
            .edgesIgnoringSafeArea(.all)
    }

    private var loginButtons: some View {
        VStack(alignment: .center, spacing: 12) {
            GoogleOnboardingButton()
            AppleOnboardingButton(delegate: viewModel)
        }
    }

    private var skipButton: some View {
        Button("Pular") {
            viewModel.send(.close)
        }
    }

    private var router: some View {
        OnboardingRouter(
            viewModel: viewModel,
            destination: destination
        )
    }
}

#if DEBUG

struct SignInPage_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: preview)
    }

    private static var preview: some View {
        let client = InMemoryAPIClient()
        let google = InMemoryGoogleAuthenticator()
        let viewModel = OnboardingViewModel(client: client, authManager: .create(), googleAuthenticator: google)
        return OnboardingPage(viewModel: viewModel, destination: EmptyView())
    }
}

#endif
