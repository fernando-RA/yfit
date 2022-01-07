import Foundation
import OSLog

struct NetworkingLogger {
    private let logger: Logger
    private let queue: DispatchQueue

    init(logger: Logger = .init(),
         queue: DispatchQueue = .init(label: "\(Self.self) Queue")) {
        self.logger = logger
        self.queue = queue
    }

    func log(_ request: URLRequest) {
        queue.async {
            guard let url = request.url?.absoluteString,
                  let method = request.httpMethod
                  else { return }

            logger.trace("""
                \(method) \(url):
                \(request.curl)
                """)
        }
    }

    func log(_ response: URLResponse, data: Data) {
        queue.async {
            guard let response = response as? HTTPURLResponse,
                  let url = response.url?.absoluteString
                  else { return }

            logger.trace("""
                \(response.statusCode) \(url):
                \(headerLog(response.allHeaderFields))
                \(dataLog(data) ?? "{}")
                """)
        }
    }

    private func headerLog(_ headers: [AnyHashable: Any]) -> String {
        var output = "Headers: ["

        for (key, value) in headers {
            output.append("\n  \(key): \(value)")
        }

        output.append("\n]")
        return output
    }

    private func dataLog(_ data: Data) -> String? {
        do {
            let json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers)
             let prettyData = try JSONSerialization.data(withJSONObject: json, options: .prettyPrinted)
             return String(data: prettyData, encoding: .utf8)
         } catch {
            return String(describing: NSString(data: data, encoding: String.Encoding.utf8.rawValue))
         }
    }
}
