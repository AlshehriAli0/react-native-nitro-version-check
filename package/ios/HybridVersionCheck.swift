import Foundation
import NitroModules


class HybridVersionCheck: HybridVersionCheckSpec {
    func getVersion() throws -> String {
        return Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "unknown"
    }
}
