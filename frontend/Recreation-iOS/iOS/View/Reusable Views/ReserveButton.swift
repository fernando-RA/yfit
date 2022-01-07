import SwiftUI

struct ReserveButton: View {
    let `class`: TrainerClass
    let action: () -> Void

    enum State: String {
        case ableToReserve = "Reserve"
        case soldOut = "Sold Out"

        /*
         At some point this could become "See your reservation"
         when we implement that view for clients.
         */
        case alreadyReserved = "Already Reserved"

        var name: String {
            rawValue
        }
    }

    var body: some View {
        Button(action: action) {
            ZStack {
                capsule
                label
            }
        }
        .disabled(!buttonIsEnabled)
    }

    private var label: some View {
        Text("\(buttonState.name) \(`class`.price.formatted())")
            .bold()
            .foregroundColor(.black)
    }

    private var capsule: some View {
        Capsule()
            .foregroundColor(buttonIsEnabled ? Color(asset: .recGreen) : Color(.lightGray))
            .frame(height: 50, alignment: .center)
    }

    private var buttonIsEnabled: Bool {
        buttonState == .ableToReserve
    }

    private var buttonState: State {
        `class`.isSoldOut ? .soldOut : .ableToReserve
    }
}

#if DEBUG

struct ReserveButton_Previews: PreviewProvider {
    static var previews: some View {
        let noAttendeesLimit = TrainerClass.create(
            isAttendeeLimit: false,
            price: 1250.cents
        )

        let limitInStock = TrainerClass.create(
            attendLimitCount: 5,
            isAttendeeLimit: true,
            price: 1250.cents,
            clients: 3
        )

        let limitOutOfStock = TrainerClass.create(
            attendLimitCount: 5,
            isAttendeeLimit: true,
            price: 1250.cents,
            clients: 5
        )

        return Group {
            ReserveButton(class: noAttendeesLimit, action: {})
            ReserveButton(class: limitInStock, action: {})
            ReserveButton(class: limitOutOfStock, action: {})
        }
    }
}

#endif
