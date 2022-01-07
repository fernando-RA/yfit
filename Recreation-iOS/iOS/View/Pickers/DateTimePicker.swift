import SwiftUI

struct DateTimePicker: View {
    @Binding var date: Date
    @Binding var duration: TimeInterval

    var body: some View {
        Group {
            datePicker
                .padding(.vertical)
            durationPicker
                .padding(.vertical)
        }
    }

    private var datePicker: some View {
        DatePicker("Date", selection: $date, in: Date()..., displayedComponents: [.date, .hourAndMinute])
            .datePickerStyle(GraphicalDatePickerStyle())
    }

    private var durationPicker: some View {
        DurationPicker(duration: $duration)
    }
}
