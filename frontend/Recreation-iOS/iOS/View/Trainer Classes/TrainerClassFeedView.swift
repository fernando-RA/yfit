import SwiftUI

struct TrainerClassFeedView: View {
    @StateObject var viewModel: TrainerClassFeedViewModel
    @Environment(\.apiClient) private var client
    @State var showSheet = false
    @State private var hasClients = false
    @State private var cancelClass = false

    var body: some View {
        VStack {
            formNavLink
            picker
            Spacer()
            if viewModel.state.selectedSection == .upcoming {
                classFeed(for: viewModel.state.upcomingClasses
                            .sorted(by: { $0.startTime.compare($1.startTime) == .orderedAscending }),
                          section: .upcoming)
            } else {
                classFeed(for: viewModel.state.pastClasses
                            .sorted(by: { $0.startTime.compare($1.startTime) == .orderedDescending }),
                          section: .past)
            }
        }
        .actionSheet(item: $viewModel.state.selectedClass, content: actionSheet)
        .navigationBarTitle("Your classes", displayMode: .inline)
        .alert($viewModel.state.error)
        .alert(item: $viewModel.state.canceledClass, content: cancelClassAlert)
        .sheet(isPresented: $showSheet, content: {
            AttendeeView(viewModel: viewModel, showSheet: $showSheet)
        })
    }

    private var picker: some View {
        Picker(selection: $viewModel.state.selectedSection, label: Text("Picker")) {
            ForEach(MyClassesSection.allCases) { section in
                Text(section.name).tag(section)
            }
        }
        .pickerStyle(SegmentedPickerStyle())
        .padding()
    }

    func classFeed(for classes: [TrainerClass], section: MyClassesSection) -> some View {
        Group {
            if classes.isEmpty && !viewModel.state.isLoadingClasses {
                emptyDataSetView(for: section)
            } else {
                List {
                    ForEach(classes) { trainerClass in
                        YourClassesCard(class: trainerClass, onTap: {
                            viewModel.state.selectedClass = trainerClass
                        })
                        .padding()
                    }
                }
            }
        }
    }

    func emptyDataSetView(for section: MyClassesSection) -> some View {
        VStack(alignment: .center, spacing: 10) {
            Spacer()
            Text("You have no \(section.name.lowercased()) classes.")
                .foregroundColor(.secondary)
            if section == .upcoming {
                Button("Create one", action: viewModel.createNewClass)
            }
            Spacer()
        }
    }

    private func actionSheet(for trainerClass: TrainerClass) -> ActionSheet {
        if viewModel.state.selectedSection == MyClassesSection.upcoming {
            return ActionSheet(title: Text(trainerClass.name), message: nil,
                               buttons: [
                                .default(Text("Duplicar")) {
                                    viewModel.state.presentedForm = .duplicate(trainerClass)
                                },
                                .default(Text("Editar")) {
                                    viewModel.state.presentedForm = .edit(trainerClass)
                                },
                                .default(Text("Visualizar participantes")) {
                                    showSheet = true
                                    viewModel.fetchAttendeesGoing(trainer: trainerClass)
                                },
                                .default(Text("Compartilhar")) {
                                    shareSheet(url: trainerClass.classLink ?? "")
                                },
                                .destructive(Text("Cancelar Aula"), action: {
                                    if trainerClass.clients >= 1 {
                                        viewModel.state.canceledClass = trainerClass
                                    } else {
                                        viewModel.cancelClass(trainer: trainerClass)
                                        viewModel.refreshFeed()
                                    }
                                }),

                                .cancel()
                               ])
        } else {
            return ActionSheet(title: Text(trainerClass.name), message: nil,
                               buttons: [
                                .default(Text("Duplicar")) {
                                    viewModel.state.presentedForm = .duplicate(trainerClass)
                                },
                                .default(Text("Editar")) {
                                    viewModel.state.presentedForm = .edit(trainerClass)
                                },
                                .default(Text("Visualizar participantes")) {
                                    showSheet = true
                                    viewModel.fetchAttendeesGoing(trainer: trainerClass)
                                },
                                .cancel()
                               ])
        }
    }
    func shareSheet(url: String) {
        guard let urlShare = URL(string: url) else { return }
        let activityVC = UIActivityViewController(activityItems: [urlShare], applicationActivities: nil)
        UIApplication.shared.windows.first?.rootViewController?.present(activityVC, animated: true, completion: nil)
    }
    private var formNavLink: some View {
        VStack {
            NavigationLink(
                destination: Group {
                    if let form = viewModel.state.presentedForm {
                        classForm(type: form)
                    }
                },
                isActive: .notNil($viewModel.state.presentedForm),
                label: { EmptyView() }
            )
            emptyNavigation
        }
    }

    private func classForm(type: ClassFormType) -> some View {
        let viewModel = ClassFormViewModel(client: client, type: type, onPublish: {
            self.viewModel.state.presentedForm = nil
            self.viewModel.refreshFeed()
        })
        return ClassForm(viewModel: viewModel)
    }

    private func cancelClassAlert(for trainerClass: TrainerClass) -> Alert {
        return Alert(title: Text("Cancelar sua aula??"),
                     message: Text("Avisaremos todos os participantes por mensagem de texto e e-mail. Eles não serão cobrados."),
                     primaryButton: .default(Text("Não, quero continuar minha aula")) {
                        hasClients = false
                     },
                     secondaryButton: .destructive(Text("Sim, cancelar"), action: {
                        viewModel.cancelClass(trainer: trainerClass)
                        viewModel.refreshFeed()
                     })
        )}

    /*
     This is a hacky fix for a SwiftUI navigation bug.
     https://developer.apple.com/forums/thread/677333
     */
    private var emptyNavigation: some View {
        NavigationLink(destination: EmptyView()) {
            EmptyView()
        }
    }
}
