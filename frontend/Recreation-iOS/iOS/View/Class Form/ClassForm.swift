import SwiftUI
import CoreLocation

struct ClassForm: View {
    @StateObject var viewModel: ClassFormViewModel
    @State private var featuredPhoto = UIImage()
    @Environment(\.gps) var gps
    @State var showDate = false
    @State var showCropingView = false
    @State var showFormAlert = false
    @State var showEmptyFeilds = false
    @State var showLocationSearch = true
    var body: some View {
        ZStack {
            emptyNavigation
            NavigationLink(destination:
                            CroppingView(encodedImage: $viewModel.state.encodedFeaturedPhoto, image: $featuredPhoto), isActive: $showCropingView) {
                Text("")
            }
            form
                .background(showCropingView ? Color.red : Color.clear)
            preview
            if viewModel.state.isLoading {
                LoadingPage()
            }
            if showFormAlert {
                Rectangle()
                    .frame(width: .infinity, height: .infinity, alignment: .center)
                    .edgesIgnoringSafeArea(.all)
                    .foregroundColor(.black.opacity(0.3))
                ClassFormAlert(viewModel: viewModel, showAlert: $showFormAlert)
            }
        }
        .onDisappear {
            hideKeyboard()
        }
        .navigationBarTitle(viewModel.state.formTitle, displayMode: .inline)
        .navigationBarItems(trailing: barButton)
        .navigationBarBackButtonHidden(viewModel.state.isLoading)
        .alert($viewModel.state.error)
    }

    private var form: some View {
        Form {
            Section(header: Text("Informações da aula").textCase(.none)) {
                classTitle
                classDescription
            }
            Section {
                NavigationLink(
                    destination: LocationPicker(viewModel: viewModel, showSheet: $showLocationSearch), label: {
                        Text(viewModel.state.class.location?.locationName ?? "Localização")
                    })
                ClassFormTextView("Notas de localização (opcional)", text: trainerClass.locationNotes.wrapOptional())
            }
            Section {
                    DateTimePicker(
                        date: trainerClass.startTime,
                        duration: trainerClass.durationTimeInterval
                    )
            }
            Section {
                HStack {
                    if viewModel.state.encodedFeaturedPhoto != nil {
                        PhotoPreview(photo: featuredPhoto)
                        Spacer()
                        ClassPhotoPicker(
                            encodedImage: $viewModel.state.encodedFeaturedPhoto,
                            image: $featuredPhoto,
                            showCropingView: $showCropingView,
                            hasImgUrl: false
                        )
                    } else if viewModel.state.class.featuredPhotoURL != nil {
                        CachedImage(url: viewModel.state.class.featuredPhotoURL, height: 73, width: 42 )
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                        Spacer()
                        ClassPhotoPicker(
                            encodedImage: $viewModel.state.encodedFeaturedPhoto,
                            image: $featuredPhoto,
                            showCropingView: $showCropingView,
                            hasImgUrl: true
                        )
                    } else {
                        ClassPhotoPicker(
                            encodedImage: $viewModel.state.encodedFeaturedPhoto,
                            image: $featuredPhoto, showCropingView: $showCropingView,
                            hasImgUrl: false
                        )
                        Spacer()
                    }
                }
            }

            Section(header: Text("Equipamento necessário").textCase(.none)) {
                equipment
            }

            Section(header: Text("Tags").textCase(.none)) {
                TagsPicker(selection: trainerClass.tags)
            }
            Section {
                PricePicker(price: trainerClass.price)
            }
            Section {
                AttendeePicker(
                    hasLimit: trainerClass.isAttendeeLimit,
                    count: trainerClass.attendLimitCount
                )
            }
            Section(header: Text("Protocolo de saúde").textCase(.none)) {
                ClassFormTextView("Protocolo de saúde", text: trainerClass.safetyProtocol.wrapOptional())
            }
        }
        .listStyle(GroupedListStyle())
    }

    private var classTitle: some View {
        TextField("Nome da aula", text: trainerClass.name)
    }

    private var classDescription: some View {
        ClassFormTextView("Descrição da aula", text: trainerClass.details)
    }

    private var equipment: some View {
        TextView(placeholder: "Garrafa de água, toalha, etc.", text: trainerClass.equipment.wrapOptional())
            .padding(.horizontal, -4)
    }

    private var barButton: some View {
        let action = viewModel.state.formAction

        return Button(action.name) {
            if viewModel.state.canPerformFormAction {
                viewModel.send(action)
            } else {
                self.showFormAlert.toggle()
            }
        }
        // .disabled(!viewModel.state.canPerformFormAction)
    }

    private var trainerClass: Binding<TrainerClass> {
        $viewModel.state.class
    }

    private var preview: some View {
        ClassPreview(
            class: viewModel.state.class,
            image: (viewModel.state.encodedFeaturedPhoto != nil) ? featuredPhoto : nil,
            isPresented: $viewModel.state.isShowingPreview,
            trailingBarItem: previewBarButton,
            isLoading: $viewModel.state.isLoading
        )
    }

    private var previewBarButton: some View {
        Button(action: {
            viewModel.send(.publish)
        }, label: {
            Text("Publicar")
                .padding(.horizontal)
                .padding(.vertical, 5)
                .foregroundColor(.black)
                .background(Color.white)
                .clipShape(Capsule())
        })
            .disabled(!viewModel.state.canPerformFormAction)
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

struct ClassForm_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: NavigationView {
            preview
        })
    }

    private static var preview: some View {
        let client = InMemoryAPIClient()
        let author = User.create()
        let viewModel = ClassFormViewModel(client: client, type: .create(author: author)) {}
        return ClassForm(viewModel: viewModel)
    }
}
#endif
