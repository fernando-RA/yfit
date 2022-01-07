import SwiftUI

struct EditContactForm: View {
    @State var contactInfo: ContactInfo
    @State var saveContactInfo: Bool = true

    let onSave: (ContactInfo, Bool) -> Void

    var body: some View {
        VStack(spacing: 8) {
            textField(input: $contactInfo.firstName, placeHolder: "Primeiro Nome")
            textField(input: $contactInfo.lastName, placeHolder: "Ultimo Nome")
            textField(input: $contactInfo.email, placeHolder: "Endereço de email")
                .autocapitalization(.none)
            textField(input: $contactInfo.phoneNumber, placeHolder: "Telefone (opcional)")

            Spacer()
            saveButton
        }
        .padding()
        .navigationBarTitle("Informações de contato", displayMode: .inline)
    }

    private var saveButton: some View {
        Button(action: {
            if contactInfo.firstName != "" && contactInfo.lastName != "" {
                saveContactInfo = false
            }
            onSave(contactInfo, saveContactInfo)
        }, label: {
            Text("Salvar e continuar")
        })
        .buttonStyle(MainButtonStyle())
        .disabled(!contactInfo.isFilled)
        .opacity(contactInfo.isFilled ? 1 : 0.3)
    }

    private func textField(input: Binding<String>, placeHolder: String) -> some View {
        TextField(placeHolder, text: input)
            .disableAutocorrection(true)
            .modifier(
                TextFieldModifier(
                    borderColor: .secondary,
                    horizontalPadding: 12,
                    verticalPadding: 12
                )
            )
    }
}

#if DEBUG

struct EditContactForm_Previews: PreviewProvider {
    static var previews: some View {
        let contactInfo = ContactInfo(
            email: "teste@teste.com",
            firstName: "Nome",
            lastName: "Sobrenome")

        let preview = NavigationView {
            EditContactForm(contactInfo: contactInfo, saveContactInfo: true, onSave: { _, _  in })
        }
        return PreviewGroup(preview: preview)
    }
}

#endif
