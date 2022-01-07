import Stripe

struct CheckoutState {
    let trainerClass: TrainerClass
    var contactInfo = ContactInfo()
    var paymentSession: PaymentSession?
    var signup: ClientClassSignUp?
    var error: IdentifiableError?
    var showContactInfoForm = false
    var showCheckoutConfirmation = false
    var agreeToWaiver = false
    var availabilitiesStatus: AvailabilitiesStatus = .pendingCheck
    var isLoading = false
    var saveContactInfo = true

    var totals: [PaymentLineItem] {
        [
            .init(label: .subtotal, amount: trainerClass.price),
            .init(label: .total, amount: trainerClass.price)
        ]
    }

    var sections: [CheckoutSection] {
        [
            .classInfo(trainerClass),
            .contactInfo,
            .cancellationPolicy,
            .waiver,
            .totals,
            .placeOrder
        ]
    }

    var canCompleteCheckout: Bool {
        let basePredicate = contactInfo.isFilled
            && agreeToWaiver
            && spotsAreRemaining
            && !isLoading

        return trainerClass.isFree ? basePredicate : basePredicate && isReadyToPay
    }

    private var spotsAreRemaining: Bool {
        availabilitiesStatus == .spotsRemaining
    }

    private var isReadyToPay: Bool {
        paymentSession != nil
    }
}
