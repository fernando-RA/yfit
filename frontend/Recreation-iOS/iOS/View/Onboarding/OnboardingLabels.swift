import SwiftUI

struct OnboardingLabels: View {
    var body: some View {
        VStack(alignment: .center) {
            Image(asset: .logo)
                .padding()
            Text("Find your next")
                .font(.system(size: 36))
                .fontWeight(.semibold)
                .padding(-10)

            Text("group class")
                .font(.system(size: 36))
                .fontWeight(.semibold)
                .padding(.top, -5)
                .padding(.bottom, 3)

            Text("Workout directly with trainers,")
                .font(.title2)
            Text("no memberships required.")
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
