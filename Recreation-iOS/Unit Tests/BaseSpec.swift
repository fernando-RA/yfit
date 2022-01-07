import Quick
import Nimble

class BaseSpec: QuickSpec {
    override func setUp() {
        super.setUp()
        Nimble.AsyncDefaults.timeout = .seconds(5)
    }
}
