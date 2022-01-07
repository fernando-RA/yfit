import SwiftUI

struct YourClassesCard: View {
    let `class`: TrainerClass
    let onTap: () -> Void

    var body: some View {
        HStack(alignment: .top, spacing: 18) {
            classImage

            VStack(alignment: .leading, spacing: 16) {
                classInfo
                overflowMenuButton
            }
        }
    }

    private var classImage: some View {
        CachedImage(url: `class`.featuredPhotoURL, height: 146, width: 81)
            .cornerRadius(12)
    }

    private var classInfo: some View {
        VStack(alignment: .leading, spacing: 6) {
            dateTime
            className

            VStack(alignment: .leading, spacing: 9) {
                location

                HStack(spacing: 12) {
                    attendees
                    amountEarned
                }
                .foregroundColor(.secondary)
            }
        }
    }

    private var dateTime: some View {
        Text("\(`class`.startTime.formattedDay) • \(`class`.formattedHours)")
            .font(.system(size: 14))
            .foregroundColor(.secondary)
    }

    private var className: some View {
        Text(`class`.name)
            .font(.system(size: 16, weight: .semibold))
    }

    private var location: some View {
        Group {
            `class`.locationNotes.map { notes in
                Text(notes)
                    .foregroundColor(.secondary)
            }
        }
    }

    private var attendees: some View {
        HStack(spacing: 4) {
            Image(systemName: "person.2")
                .font(.system(size: 16))

            let maximumIfAny = `class`.isAttendeeLimit ? "/\(`class`.attendLimitCount)" : ""
            Text("\(`class`.clients)\(maximumIfAny)")
                .font(.system(size: 14))
        }
    }

    private var amountEarned: some View {
        HStack(spacing: 4) {
            Image(systemName: "dollarsign.circle")
                .font(.system(size: 16))

            Text(`class`.totalEarned.formatted())
                .font(.system(size: 14))
        }
    }

    private var overflowMenuButton: some View {
        Button(action: onTap ) {
            ZStack {
                Circle()
                    .stroke(Color.secondary, lineWidth: 1)
                    .foregroundColor(.clear)
                    .frame(width: 40, height: 40)

                Image(systemName: "ellipsis")
                    .font(.system(size: 16))
                    .foregroundColor(.secondary)
            }
        }
    }
}

#if DEBUG

struct YourClassesCard_Previews: PreviewProvider {
    static var previews: some View {
        let `class` = TrainerClass.create(locationNotes: "Some location notes")
        YourClassesCard(class: `class`, onTap: {})
    }
}

#endif
