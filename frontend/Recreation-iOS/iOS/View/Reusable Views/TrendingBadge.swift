//
//  TrendingBadge.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 10/7/21.
//

import SwiftUI

struct TrendingBadge: View {
    var body: some View {
        Text("🔥 Trending")
            .bold()
            .foregroundColor(.primary)
            .font(.system(size: 12))
            .padding(.horizontal, 8)
            .padding(.vertical, 5)
            .background(Color(asset: .trendingColor))
            .clipShape(RoundedRectangle(cornerRadius: 4))
    }
}

struct TrendingBadge_Previews: PreviewProvider {
    static var previews: some View {
        TrendingBadge()
    }
}
