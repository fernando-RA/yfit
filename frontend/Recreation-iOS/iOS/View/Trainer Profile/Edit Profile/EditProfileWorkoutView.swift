import SwiftUI

struct EditProfileWorkoutView: View {
    @ObservedObject var viewModel: EditProfileViewModel

    var columns: [GridItem] = [
        GridItem(.fixed(145), spacing: 16),
        GridItem(.fixed(145), spacing: 16)
    ]

    var body: some View {
        VStack {
            HStack {
                Text("Escolha os tipos de atividade")
                    .font(.headline)
                Spacer()
            }
            .padding()
            ScrollView {
                LazyVGrid(
                    columns: columns,
                    alignment: .center,
                    spacing: 16
                ) {
                    Section {
                        ForEach(viewModel.state.possibleWorkouts, content: workoutButton)
                    }
                }
            }
        }.padding()
    }

    private func workoutButton(_ workout: WorkoutType) -> some View {
        Button(action: {
            viewModel.send(.toggleWorkoutSelection(workout))
        }, label: {
            Text(workout.name)
        })
        .buttonStyle(WorkoutTagStyle(isSelected: selectedWorkouts.contains(workout)))
    }

    private var selectedWorkouts: [WorkoutType] {
        viewModel.state.selectedWorkouts
    }
}

#if DEBUG

struct EditProfileWorkoutTypes_Previews: PreviewProvider {
    static var previews: some View {
        PreviewGroup(preview: preview)
    }

    private static var preview: some View {
        let client = InMemoryAPIClient()
        let viewModel = EditProfileViewModel(auth: .create(), client: client) {}

        return NavigationView {
            EditProfileWorkoutView(viewModel: viewModel)
        }
    }
}

#endif
