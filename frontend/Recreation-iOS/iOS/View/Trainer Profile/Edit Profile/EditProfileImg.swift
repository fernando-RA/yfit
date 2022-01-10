import SwiftUI

struct EditProfileImg: View {
    @ObservedObject var viewModel: EditProfileViewModel

    @State var showSheet: Bool = false
    @Binding var showImgPicker: Bool
    @State var sourceType: UIImagePickerController.SourceType = .camera
    @State var img: UIImage?

    var body: some View {
        ZStack {
            VStack {
                if viewModel.state.img != nil {
                    ZStack {
                        Image(uiImage: viewModel.state.img!)
                            .resizable()
                            .scaledToFill()
                            .frame(width: 80, height: 80, alignment: .center)
                        VStack {
                            Spacer()
                            ZStack {
                                Rectangle()
                                    .frame(width: 92, height: 27, alignment: .center)
                                    .foregroundColor(Color(asset: .bannerGrey))
                                Text("Editar")
                                    .foregroundColor(.white)
                                    .font(.custom("", size: 14))
                            }
                        }
                    }
                    .clipShape(Circle())
                    .frame(width: 80, height: 80)
                } else {
                    ZStack {
                        if viewModel.state.profilePictureURL != nil {
                            featuredPhoto
                        } else {
                            Rectangle()
                                .foregroundColor(.gray)
                        }
                        VStack {
                            Spacer()
                            ZStack {
                                Rectangle()
                                    .frame(width: 92, height: 27, alignment: .center)
                                    .foregroundColor(Color(asset: .bannerGrey))
                                Text("Editar")
                                    .foregroundColor(.white)
                                    .font(.custom("", size: 14))
                            }
                        }
                    }
                    .clipShape(Circle())
                    .frame(width: 80, height: 80, alignment: .center)
                }
            }
            .actionSheet(isPresented: $viewModel.state.showImgActionSheet) {
                ActionSheet(title: Text("Adicione uma foto de perfil"),
                            message: nil,
                            buttons: [.default(Text("Camera"), action: {
                                showImgPicker.toggle()
                                viewModel.state.sourceType = .camera
                                print(viewModel.state.sourceType)
                            }),
                            .default(Text("Biblioteca de fotos"), action: {
                showImgPicker.toggle()
                                viewModel.state.sourceType = .photoLibrary
                            }),
                            .cancel()
                            ])
            }
        }
    }

    private var featuredPhoto: some View {
        CachedImage(url: viewModel.state.profilePictureURL, height: 80, width: 80)
            .aspectRatio(contentMode: .fill)
            .cornerRadius(25)
    }

    private var emptyNavigation: some View {
        NavigationLink(destination: EmptyView()) {
            EmptyView()
        }
    }
}

#if DEBUG
struct EditProfileImg_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: preview)
    }

    private static var preview: some View {
        let client = InMemoryAPIClient()
        let viewModel = EditProfileViewModel(auth: .create(), client: client) {}

        return NavigationView {
            EditProfileImg(viewModel: viewModel, showImgPicker: .constant(false))
        }
    }
}

#endif
