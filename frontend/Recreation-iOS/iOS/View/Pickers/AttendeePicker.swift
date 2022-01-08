import SwiftUI

struct AttendeePicker: View {
    @Binding var hasLimit: Bool
    @Binding var count: Int

    var body: some View {
        Group {
            limitSwitch
            if hasLimit {
                numberPicker
            }
        }
    }

    private var limitSwitch: some View {
        HStack {
            Text("Limite de inscrições")
            Spacer()
            Toggle(isOn: $hasLimit) {
                EmptyView()
            }
        }
    }

    private var attendeeLimit: some View {
        HStack {
            Text("Numero de inscrítos")
            Spacer()
            Text("\(count)").foregroundColor(.secondary)
        }
    }

    private var numberPicker: some View {
        Picker("numero de inscrítos", selection: $count) {
            ForEach(1..<200, id: \.self) {
                Text("\($0)")
            }
        }
    }
}
