import SwiftUI

struct WorkoutTagStyle: ButtonStyle {
    var isSelected: Bool = false

    func makeBody(configuration: Self.Configuration) -> some View {
        configuration.label
            .foregroundColor(isSelected ? .black : .primary)
            .frame(width: 150, height: 80, alignment: .center)
            .background(isSelected ? Color(asset: Asset.Color.recGreen) :
                Color(.secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}

#if DEBUG

struct WorkoutTagStyle_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            Button(action: {}, label: {
                Text("Button")
            }).buttonStyle(WorkoutTagStyle())
            Button(action: {}, label: {
                Text("Button")
            }).buttonStyle(WorkoutTagStyle(isSelected: true))
            Button(action: {}, label: {
                Text("Button")
            }).preferredColorScheme(.dark).buttonStyle(WorkoutTagStyle())
            Button(action: {}, label: {
                Text("Button")
            }).preferredColorScheme(.dark).buttonStyle(WorkoutTagStyle(isSelected: true))
        }
    }
}

#endif
