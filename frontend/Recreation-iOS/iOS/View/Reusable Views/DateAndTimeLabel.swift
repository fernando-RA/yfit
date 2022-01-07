//
//  DateAndTimeLabel.swift
//  Recreation-iOS (iOS)
//
//  Created by Mike  Van Amburg on 7/14/21.
//

import SwiftUI

struct DateAndTimeLabel: View {
    let trainerClass: TrainerClass
    var body: some View {
        HStack {
            Text("\(trainerClass.startTime.formatted) • \(trainerClass.formattedHours)")
            Text("•")
            Text(trainerClass.formattedDuration)
        }
    }
    private var hyphen: some View {
        Text("-")
    }
    private var classPrice: some View {
        Text(trainerClass.price.formatted())
            .font(.title3)
    }
}

#if DEBUG
struct DateAndTimeLabel_Previews: PreviewProvider {
    static var previews: some View {
        DateAndTimeLabel(trainerClass: TrainerClass.create())
    }
}
#endif
