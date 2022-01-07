import Combine

extension AnyPublisher {
    static var none: AnyPublisher<Output, Failure> {
        Empty().eraseToAnyPublisher()
    }

    static func just(_ value: Output) -> AnyPublisher<Output, Failure> {
        Just(value)
            .setFailureType(to: Failure.self)
            .eraseToAnyPublisher()
    }
}

extension AnyPublisher where Failure == Error {
    static func wrap<A>(_ function: @escaping () throws -> A) -> AnyPublisher<A, Failure> {
        Future { future in
            do {
                let result = try function()
                future(.success(result))
            } catch {
                future(.failure(error))
            }
        }
        .eraseToAnyPublisher()
    }
}
