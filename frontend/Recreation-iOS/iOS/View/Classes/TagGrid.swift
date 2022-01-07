import SwiftUI

// Todo: this needs to be rewritten 
struct TagGrid: View {
    let trainerClass: TrainerClass
    @State var totalHeight = CGFloat.infinity
    var body: some View {
        VStack {
            GeometryReader { geo in
                generateContent(in: geo)
            }
        }
    }

    private func generateContent(in geo: GeometryProxy) -> some View {
        var width = CGFloat.zero
        var height = CGFloat.zero

        return ZStack(alignment: .topLeading) {
            ForEach(trainerClass.tags, id: \.self) { tag in
                item(for: tag.rawValue)
                    .padding([.horizontal, .vertical], 4)
                    .alignmentGuide(.leading, computeValue: { d in
                        if abs(width - d.width) > geo.size.width {
                            width = 0
                            height -= d.height
                        }
                        let result = width
                        if tag == trainerClass.tags.first! {
                            width = 0
                        } else {
                            width -= d.width
                        }
                        return result
                    })
                    .alignmentGuide(.top, computeValue: { _ in
                        let result = height
                        if tag == trainerClass.tags.first! {
                            height = 0
                        }
                        return result
                    })
            }
        }
    }

    func item(for text: String) -> some View {
        Text(text)
            .padding(.all, 6)
            .background(Color.white)
            .foregroundColor(Color.black)
            .cornerRadius(20)
    }
}

#if DEBUG

struct TagGrid_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: preview)
    }

    private static var preview: some View {
        let trainerClass = TrainerClass.create()

        return TagGrid(trainerClass: trainerClass)
    }
}

#endif
