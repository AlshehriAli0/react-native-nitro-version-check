import Foundation
import NitroModules


class HybridVersionCheck: HybridVersionCheckSpec {
    var version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "unknown"
    var buildNumber = Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "unknown"
    var packageName = Bundle.main.infoDictionary?["CFBundleIdentifier"] as? String ?? "unknown"
    
    func getCountry() throws -> String {
        Locale.current.regionCode ?? "unknown"
    }
}
