#if DEBUG

import SwiftUI

struct PreviewGroup<Preview: View>: View {
    let preview: Preview

    var body: some View {
        ForEach(PreviewContext.all) { context in
            Group {
                preview
                    .previewDisplayName(context.displayName)
                    .previewDevice(context.device)
                    .colorScheme(context.colorScheme)
            }
        }
    }
}

#endif
