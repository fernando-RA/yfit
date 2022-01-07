//
//  AttendeeView.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 7/18/21.
//

import SwiftUI

struct AttendeeView: View {
    @StateObject var viewModel: TrainerClassFeedViewModel
    @State var isClicked = false
    @Binding var showSheet: Bool
    var body: some View {
        VStack {
            HStack {
                Button(action: {showSheet = false}, label: {
                    Image(systemName: "chevron.left")
                })
                Spacer()
                Text("Attendees")
                Spacer()
            }
            .padding()
            List(viewModel.state.attendees, id: \.self) { clients in
                HStack {
                    VStack(alignment: .leading) {
                        Text("\(clients.firstName) \(clients.lastName)")
                        Text(clients.emailAddress)
                            .font(.caption)
                    }
                    Spacer()
                    Button(action: {
                            viewModel.state.firstName = clients.firstName
                            viewModel.state.lastName = clients.lastName
                            viewModel.state.emailAddress = clients.emailAddress
                            if clients.didAttend == nil || clients.didAttend == false {
                            viewModel.state.didAttend = true
                            } else {
                                viewModel.state.didAttend = false
                            }
                        viewModel.updateAttendence(spot: Spot(id: clients.id, firstName: clients.firstName, lastName: clients.lastName, emailAddress: clients.emailAddress, didAttend: viewModel.state.didAttend))
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                            viewModel.fetchAttendee(spot: clients)
                        }
                    }, label: {
                        Image(systemName: "checkmark.circle.fill")
                            .font(Font.largeTitle.weight(.semibold))
                            .foregroundColor(clients.didAttend ?? false ? .green : .gray)
                    })
                }
                .padding(.vertical)
            }
        }
    }
}

#if DEBUG
struct AttendeeView_Previews: PreviewProvider {
    static var previews: some View {
        AttendeeView(viewModel: TrainerClassFeedViewModel(client: InMemoryAPIClient.init(), auth: AuthSessionManager.create()), showSheet: .constant(true))
    }
}
#endif
