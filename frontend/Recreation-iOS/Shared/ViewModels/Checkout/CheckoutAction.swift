enum CheckoutAction: Equatable {
    case setup
    case editContactInfo
    case save(ContactInfo, Bool)
    case signupForClass
    case handlePayment(PaymentResult)
    case checkAvailabilities
}
