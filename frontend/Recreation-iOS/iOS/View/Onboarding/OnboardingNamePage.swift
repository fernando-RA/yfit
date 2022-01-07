import SwiftUI

struct OnboardingNamePage: View {
    @State var state: OnboardingNameState

    var actionName = "Save"
    let onSave: (OnboardingNameState) -> Void

    var body: some View {
        List {
            field("First", text: $state.firstName)
            field("Last", text: $state.lastName)
        }
        .listStyle(PlainListStyle())
        .navigationBarTitle("Enter name", displayMode: .inline)
        .navigationBarItems(trailing: actionButton)
    }

    private func field(_ placeholder: String, text: Binding<String>) -> some View {
        TextField(placeholder, text: text)
            .textFieldStyle(PlainTextFieldStyle())
            .disableAutocorrection(true)
    }

    private var actionButton: some View {
        Button("Next") {
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
