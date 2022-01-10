import SwiftUI

struct ConnectStripeRow: View {
    @StateObject var viewModel: EditProfileViewModel
    @Binding var state: EditProfileState

    let onTap: () -> Void

    var body: some View {
        Group {
            if state.stripePaymentsEnabled {
                triggerDestructiveAlert
            } else {
                button
            }
        }
    }

    private var button: some View {
        content
            .highPriorityGesture(
                TapGesture()
                    .onEnded { _ in
                        onTap()
                    }
            )
            .disabled(state.isLoadingStripe)
    }

    private var triggerDestructiveAlert: some View {
        content
            .highPriorityGesture(
                TapGesture()
                    .onEnded { _ in
                        state.showDestructiveAlert.toggle()
                    }
            )
            .disabled(state.isLoadingStripe)
            .alert(isPresented: $state.showDestructiveAlert) {
                Alert(title: Text("Deletar conta stripe?"), message: Text("Isso ira remover sua conta do stripe e voce tera que adicionar uma nova conta."), primaryButton: .destructive(Text("Delete"), action: {
                    viewModel.send(.userDeletsStripeAccount)
                }), secondaryButton: .default(Text("Cancelar")))
            }
    }
    private var content: some View {
        HStack(spacing: 10) {
            if state.isLoadingStripe {
                ProgressView()
            }

            Text("Stripe account")
                .foregroundColor(Color(asset: .accentColor))

            Spacer()

            Text(state.stripePaymentsEnabled ? "Conectado" : "Nao coneectado")
                .foregroundColor(.secondary)
        }
    }
}
