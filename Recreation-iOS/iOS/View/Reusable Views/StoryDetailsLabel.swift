//
//  StoryDetailsLabel.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  on 6/1/21.
//

import SwiftUI

struct StoryDetailsLabel: View {
    var title: String
    var details: String
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(.caption)
                .fontWeight(.heavy)
        Text(details)
            .font(.body)
        }
        .padding(.vertical, 20)
    }
}

struct StoryDetailsLabel_Previews: PreviewProvider {
    static var previews: some View {
        StoryDetailsLabel(
            title: "Where we will go",
            details: "to the moon, Idk this is just so I can see what it would look like."
                + " if you see this add a joke"
        )
    }
}
