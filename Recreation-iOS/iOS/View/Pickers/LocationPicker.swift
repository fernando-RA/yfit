import SwiftUI
import CoreLocation
import MapKit

struct LocationPicker: View {
    @Environment(\.presentationMode) private var presentationMode
    @StateObject var gps = GPS()
    @StateObject var viewModel: ClassFormViewModel
    @State var region: MKCoordinateRegion = .init()
    @State private var locationName = ""
    @State private var coordinates: CLLocationCoordinate2D?
    @Binding var showSheet: Bool

    var body: some View {
        ZStack {
            if !gps.state.annotation.isEmpty {
                map
                    .edgesIgnoringSafeArea(.all)
            } else {
                VStack {
                    Rectangle()
                        .frame(width: .infinity, height: .infinity)
                        .foregroundColor(Color(asset: .offBackground))
                }
                .edgesIgnoringSafeArea(.top)
            }
            VStack {
                Spacer()
                HStack {
                    Button(action: {showSheet.toggle()}, label: {
                        ZStack {
                            Circle()
                                .foregroundColor(Color(asset: .bottomSheet))
                                .frame(width: 48, height: 48, alignment: .center)
                            Image(systemName: "magnifyingglass")
                                .foregroundColor(.primary)
                                .font(.custom("", size: 25))
                        }
                    })
                    Spacer()
                }
                .padding()
                ZStack {
                    RoundedRectangle(cornerRadius: 25.0)
                        .foregroundColor(Color(asset: .bottomSheet))
                        .frame(width: nil, height: 200)
                    if !gps.state.annotation.isEmpty {
                        VStack(alignment: .leading) {
                            Text(gps.state.local?.placemarker.name ?? "")
                                .font(.title3)
                                .bold()
                                .padding(.horizontal, 10)
                            HStack {
                                Text(gps.state.local?.placemarker.subThoroughfare ?? "")
                                Text(gps.state.local?.placemarker.thoroughfare ?? "")
                            }
                            .padding(.horizontal, 10)
                            HStack {
                                Text(gps.state.local?.placemarker.locality ?? "")
                                Text(gps.state.local?.placemarker.administrativeArea ?? "")
                                Text(gps.state.local?.placemarker.postalCode ?? "")
                            }
                            .padding(.horizontal, 10)
                            Button(action: {
                                createOrUpdateLocation()
                                presentationMode.wrappedValue.dismiss()
                            }, label: {
                                Text("Confirm")
                                    .bold()
                            })
                                .buttonStyle(RecGreenButtonStyle())
                                .padding()
                        }
                    } else {
                        Text("Tap the search icon to enter a location")
                    }
                }
            }
            .edgesIgnoringSafeArea(.bottom)
            GeometryReader { geo in
                SearchSheet(isOpen: $showSheet, maxHeight: geo.size.height) {
                    searchForm.padding(.top, -20)
                }
            }
            .ignoresSafeArea(.keyboard, edges: .bottom)
        }
        .onDisappear {
            showSheet = true
        }
        .navigationBarHidden(true)
        .navigationBarBackButtonHidden(true)
    }

    private var map: some View {
        Map(
            coordinateRegion: $gps.state.selectedRegion,
            interactionModes: [.all],
            showsUserLocation: false,
            userTrackingMode: nil,
            annotationItems: gps.state.annotation
        ) { item in
            MapPin(coordinate: item.placemarker.location?.coordinate ?? gps.state.currentLocation?.coordinate ?? .init(), tint: Color(asset: .recGreen))
        }
    }

    var searchForm: some View {
        VStack(alignment: .leading) {
            VStack {
                ZStack {
                    HStack {
                        Button {
                            hideKeyboard()
                            showSheet.toggle()
                            presentationMode.wrappedValue.dismiss()
                        } label: {
                            Text("Cancel")
                        }
                        Spacer()
                    }
                    Text("Add a location")
                        .font(.title3)
                }
                VStack {
                    HStack {
                        Image(systemName: "magnifyingglass")
                        TextField("search", text: $gps.state.searchedLocal)
                    }
                    .background(Color(.secondarySystemBackground))
                    .padding(5)
                    .background(Color(.secondarySystemBackground))
                    .overlay(
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(lineWidth: 10)
                            .foregroundColor(Color(.secondarySystemBackground))
                    )
                    .padding()
                }
                Divider()
            }
            .padding()
            if !gps.state.classes.isEmpty && gps.state.searchedLocal != "" {
                VStack {
                    ScrollView {
                        ForEach(gps.state.classes) { location in
                            VStack {
                                Text(location.placemarker.name ?? "")
                                HStack {
                                    Text(location.placemarker.subThoroughfare ?? "")
                                        .font(.footnote)
                                    Text(location.placemarker.thoroughfare ?? "")
                                        .font(.footnote)
                                }
                                HStack {
                                    Text(location.placemarker.locality ?? "")
                                    Text(location.placemarker.administrativeArea ?? "")
                                    Text(location.placemarker.postalCode ?? "")
                                }.font(.footnote)
                            }
                            .onTapGesture {
                                gps.selectLocal(local: location)
                                hideKeyboard()
                                showSheet.toggle()
                            }
                            Divider()
                        }
                    }
                    .padding()
                }
            }
            Spacer()
        }
        .edgesIgnoringSafeArea([.horizontal, .top])
        .onChange(of: self.gps.state.searchedLocal) { value in
            let delay = 0.1
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                if value == self.gps.state.searchedLocal {
                    self.gps.searchQuery()
                }
            }
        }
    }

    private func createOrUpdateLocation() {
        guard let local = gps.state.local else {
            return
        }
        guard let name = local.placemarker.name else {
            return
        }
        guard let streetNumber = local.placemarker.subThoroughfare else {
            return
        }
        guard let street = local.placemarker.thoroughfare else {
            return
        }
        let setTocationName = "\(name), \(streetNumber) \(street)"
        let location = Location(
            lat: local.placemarker.location?.coordinate.latitude ?? 0,
            lng: local.placemarker.location?.coordinate.longitude ?? 0,
            locationName: setTocationName
        )
        viewModel.state.class.location = location
    }
}
