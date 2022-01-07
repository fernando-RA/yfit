struct CheckoutDependencies {
    let paymentProvider: PaymentProvider
    let auth: AuthSessionManager
    let client: APIClient
}
