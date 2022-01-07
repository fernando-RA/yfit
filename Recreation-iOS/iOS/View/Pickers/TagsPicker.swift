import SwiftUI

struct TagsPicker: View {
    @Binding var selection: [ClassTag]

    var body: some View {
        NavigationLink(destination: picker) {
            navigationLabel
        }
    }

    private var navigationLabel: some View {
        HStack {
                Text(selection.isEmpty ? "None" : selectedTags)
                    .frame(width: 200, alignment: .leading)
            .padding(.vertical, 10)

            Spacer()
        }
    }

    private var selectedTags: String {
        selection.map(\.name).joined(separator: ", ")
    }

    private var picker: some View {
        List(ClassTag.allCases) { tag in
            HStack {
                Text(tag.name)
                Spacer()
                Toggle("", isOn: binding(for: tag))
            }
        }
        .navigationBarTitle("Tags", displayMode: .inline)
    }

    private func binding(for tag: ClassTag) -> Binding<Bool> {
        .init(get: {
            selection.contains(tag)
        }, set: { isSelected in
            if isSelected {
                selection.append(tag)
            } else {
               selection.removeAll { $0 == tag }
            }
        })
    }
}
