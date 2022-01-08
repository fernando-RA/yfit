import SwiftUI

struct OnboardingNamePage: View {
    @State var state: OnboardingNameState

    var actionName = "Salvar"
    let onSave: (OnboardingNameState) -> Void

    var body: some View {
        List {
            field("Nome", text: $state.firstName)
            field("Sobrenome", text: $state.lastName)
        }
        .listStyle(PlainListStyle())
        .navigationBarTitle("Insira seu nome", displayMode: .inline)
        .navigationBarItems(trailing: actionButton)
    }

    private func field(_ placeholder: String, text: Binding<String>) -> some View {
        TextField(placeholder, text: text)
            .textFieldStyle(PlainTextFieldStyle())
            .disableAutocorrection(true)
    }

    private var actionButton: some View {
        Button("Próximo") {
            onSave(state)
        }
        .disabled(!state.isFilled)
    }
}

#if DEBUG

struct OnboardingNamePage_Previews: PreviewProvider {
    static var previews: some View {
        let preview = NavigationView {
            OnboardingNamePage(state: OnboardingNameState(firstName: "", lastName: ""), onSave: { _ in })
        }
        return PreviewGroup(preview: preview)
    }
}

#endif
