import SwiftUI

struct DurationPicker: View {
    @Binding var duration: TimeInterval

    private let options: [TimeInterval] = [
        30.minutes,
        45.minutes,
        1.hour,
        1.hour.and(15.minutes),
        1.hour.and(30.minutes),
        1.hour.and(45.minutes),
        2.hours,
        2.hours.and(15.minutes),
        2.hours.and(30.minutes),
        2.hours.and(45.minutes),
        3.hours,
        3.hour.and(15.minutes),
        3.hour.and(30.minutes),
        3.hour.and(45.minutes),
        4.hours,
        4.hours.and(15.minutes),
        4.hours.and(30.minutes),
        4.hours.and(45.minutes),
        5.hour,
        5.hour.and(15.minutes),
        5.hour.and(30.minutes),
        5.hour.and(45.minutes),
        6.hours,
        6.hours.and(15.minutes),
        6.hours.and(30.minutes),
        6.hours.and(45.minutes),
        7.hours,
        7.hour.and(15.minutes),
        7.hour.and(30.minutes),
        7.hour.and(45.minutes),
        8.hours,
        8.hours.and(15.minutes),
        8.hours.and(30.minutes),
        8.hours.and(45.minutes),
        9.hour,
        9.hour.and(15.minutes),
        9.hour.and(30.minutes),
        9.hour.and(45.minutes),
        10.hours,
        10.hours.and(15.minutes),
        10.hours.and(30.minutes),
        10.hours.and(45.minutes),
        11.hours,
        11.hour.and(15.minutes),
        11.hour.and(30.minutes),
        11.hour.and(45.minutes),
        12.hours,
        12.hours.and(15.minutes),
        12.hours.and(30.minutes),
        12.hours.and(45.minutes)
    ]

    var body: some View {
        picker
    }
    private var durationRow: some View {
        HStack(alignment: .center) {
            Text("Duração")
                .foregroundColor(.primary)
            Spacer()
            Text(duration.formatted)
                .foregroundColor(.secondary)
        }
    }

    private var picker: some View {
        Picker("Duration", selection: $duration) {
            ForEach(options) { option in
                Text(option.formatted)
            }
        }
    }
}
