import Quick
import Nimble
import UIKit
@testable import Recreation_iOS

final class AssetSpec: BaseSpec {
    override func spec() {
        it("has an asset for every color") {
            let assets = Asset.Color.allCases

            let colors = assets.compactMap { asset in
                UIColor(named: asset.name)
            }

            expect(colors.count) == assets.count
        }

        it("has an asset for every image") {
            let assets = Asset.Image.allCases

            let images = assets.compactMap { asset in
                UIImage(named: asset.name)
            }

            expect(images.count) == assets.count
        }
    }
}
