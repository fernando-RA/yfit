import SwiftUI

struct OnboardingLabels: View {
    var body: some View {
        VStack(alignment: .center) {
            Image(asset: .logo)
                .padding()
            Text("Encontre sua próxima")
                .font(.system(size: 36))
                .fontWeight(.semibold)
                .padding(-10)

            Text("aula em grupo")
                .font(.system(size: 36))
                .fontWeight(.semibold)
                .padding(.top, -5)
                .padding(.bottom, 3)

            Text("Treine diretamente com profissionais")
                .font(.title2)
            Text("sem pagar mensalidade")
                    .font(.title2)
        }
        .multilineTextAlignment(.center)
    }
}

struct OnboardingLabels_Previews: PreviewProvider {
    static var previews: some View {
        OnboardingLabels()
    }
}
