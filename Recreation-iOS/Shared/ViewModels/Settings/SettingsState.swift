struct SettingsState {
    var contactInfo = ContactInfo()
    var isEditingContactInfo = false
    var error: IdentifiableError?
    var canEditContactInfo = false
}
