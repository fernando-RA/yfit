import SwiftUI

struct EditProfilePage: View {
    @StateObject var viewModel: EditProfileViewModel
    @State var showPicker = false
    @State var showFormAlert = false
    @State var showEmptyFeilds = false
    var body: some View {
        ZStack {
            NavigationLink(
                destination: Picker,
                isActive: $showPicker,
                label: {
                    Text("")
                })
            content
            if viewModel.state.isUpdatingUser {
                LoadingPage()
            }
            if showFormAlert {
                Rectangle()
                    .frame(width: .infinity, height: .infinity, alignment: .center)
                    .edgesIgnoringSafeArea(.all)
                    .foregroundColor(.black.opacity(0.3))
            }
            if showFormAlert {
                ProfileFormAlert(viewModel: viewModel, showAlert: $showFormAlert)
            }
        }
        .onAppear {
                viewModel.send(.getStripeAccount)
            viewModel.state.showProfile = false
        }
        .navigationBarTitle("Trainer Profile", displayMode: .inline)
        .navigationBarItems(trailing: saveButton)
        .navigationBarBackButtonHidden(viewModel.state.isUpdatingUser)
        .alert($viewModel.state.error)
    }

    private var content: some View {
        ZStack {
            workoutPickerNavLink
            connectStripeViewNavLink
            form
        }
    }

    private var form: some View {
        Form {
            Section(header: Spacer(minLength: 0)) {
                HStack {
                    Spacer()
                    EditProfileImg(viewModel: viewModel, showImgPicker: $showPicker)
                    Spacer()
                }
            }
            .onTapGesture(perform: {
                viewModel.state.showImgActionSheet.toggle()
            })
            .listRowBackground(Color(asset: .formBackground))

            Section(header: Text("Your info").textCase(.none)) {
                textField("First name", text: $viewModel.state.firstName)
                textField("Last name", text: $viewModel.state.lastName)
            }

            Section {
                HStack {
                    Text("instagram.com/")
                        .padding(.trailing, -6)
                    textField("yourhandle (optional)", text: $viewModel.state.instagramLink)
                }
            }

            Section(header: Text("Activity types (optional)").textCase(.none)) {
                workoutPicker
            }

            Section(header: Text("About me").textCase(.none)) {
                ZStack(alignment: .topLeading) {
                    if viewModel.state.bio.isEmpty {
                        Text("Enter your bio")
                            .foregroundColor(Color.primary.opacity(0.25))
                            .padding(EdgeInsets(top: 7, leading: 4, bottom: 0, trailing: 0))
                    }
                    TextEditor(text: $viewModel.state.bio)
                        .frame(height: 129)
                }

                .frame(height: 131)
            }

            Section(header: Text("Payments").textCase(.none), footer: Text("We use Stripe to securely process payments and make sure you get paid. Create an account or log in to connect.").textCase(.none)) {
                ConnectStripeRow(viewModel: viewModel, state: $viewModel.state, onTap: {
                    viewModel.state.stripeNavlink = true
                })
            }
        }

        .background(Color(asset: .formBackground).edgesIgnoringSafeArea(.bottom))
        .onAppear {
            UITableView.appearance().backgroundColor = .clear
        }
    }

    private var workoutPicker: some View {
        HStack(spacing: 10) {
            if viewModel.state.selectedWorkouts.isEmpty {
                Text("Select")
            } else {
                Text(viewModel.state.selectedWorkouts.map(\.name).joined(separator: ", "))
            }
            Spacer()
            Image(systemName: "chevron.right")
                .opacity(0.25)
        }
        .foregroundColor(.primary)
        .highPriorityGesture(
            TapGesture()
                .onEnded { _ in
                    viewModel.send(.editWorkouts)
                }
        )
    }

    private var saveButton: some View {
        Button("Save") {
            hideKeyboard()
            if viewModel.state.canSave {
                viewModel.send(.save)
                return
            } else {
                self.showFormAlert.toggle()
                self.showEmptyFeilds.toggle()
                return
            }
        }
    }

    private func textField(_ placeholder: String, text: Binding<String>) -> some View {
        TextField(placeholder, text: text)
            .disableAutocorrection(true)
    }

    private var workoutPickerNavLink: some View {
        VStack {
            NavigationLink(
                destination: EditProfileWorkoutView(viewModel: viewModel),
                isActive: $viewModel.state.isEditingWorkouts,
                label: { EmptyView() })
            emptyNavigation
        }
    }

    private var connectStripeViewNavLink: some View {
        VStack {
            NavigationLink(
                destination:
                    ConnectStripeView(viewModel: viewModel),
                isActive: $viewModel.state.stripeNavlink,
                label: { EmptyView() })
            emptyNavigation
        }
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

    private var Picker: some View {
        ImagePicker(isPresented: $showPicker, showCropTool: .constant(false), sourceType: viewModel.state.sourceType, onSelection: { image in
            viewModel.state.img = image
            viewModel.state.encodedProfilePicture = viewModel.state.img?.base64Encoded
        })
        .edgesIgnoringSafeArea(.all)
        .navigationBarHidden(true)
    }
}

#if DEBUG

struct EditProfilePage_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: preview)
    }

    private static var preview: some View {
        let client = InMemoryAPIClient()
        let auth = AuthSessionManager.create()

        auth.session = .signedIn(User.create(
            firstName: "Karl",
            lastName: "Rivest Harnois",
            userType: .trainer
        ))

        let viewModel = EditProfileViewModel(auth: auth, client: client) {}

        return NavigationView {
            EditProfilePage(viewModel: viewModel)
        }
    }
}

#endif
