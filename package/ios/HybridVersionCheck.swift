import Foundation
import NitroModules


class HybridVersionCheck: HybridVersionCheckSpec {
    var version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "unknown"
    var buildNumber = Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "unknown"
    var packageName = Bundle.main.infoDictionary?["CFBundleIdentifier"] as? String ?? "unknown"
    
    func getCountry() throws -> String {
        Locale.current.regionCode ?? "unknown"
    }

    func getStoreUrl() throws -> Promise<String> {
        return Promise.async {
            let bundleId = Bundle.main.bundleIdentifier ?? ""
            let url = URL(string: "https://itunes.apple.com/lookup?bundleId=\(bundleId)")!
            let (data, _) = try await URLSession.shared.data(from: url)
            let json = try JSONSerialization.jsonObject(with: data) as? [String: Any]
            let results = json?["results"] as? [[String: Any]]
            guard let trackViewUrl = results?.first?["trackViewUrl"] as? String else {
                throw NSError(domain: "VersionCheck", code: 1, userInfo: [NSLocalizedDescriptionKey: "App not found on App Store"])
            }
            return trackViewUrl
        }
    }

    func getLatestVersion() throws -> Promise<String> {
        return Promise.async {
            let bundleId = Bundle.main.bundleIdentifier ?? ""
            let url = URL(string: "https://itunes.apple.com/lookup?bundleId=\(bundleId)")!
            let (data, _) = try await URLSession.shared.data(from: url)
            let json = try JSONSerialization.jsonObject(with: data) as? [String: Any]
            let results = json?["results"] as? [[String: Any]]
            
            guard let latestVersion = results?.first?["version"] as? String else {
                throw NSError(domain: "VersionCheck", code: 2, userInfo: [NSLocalizedDescriptionKey: "App not found on App Store"])
            }
            return latestVersion
        }
    }

    func needsUpdate() throws -> Promise<Bool> {
        return Promise.async { [self] in
            do {
                let latest = try await self.getLatestVersion().await()
                return self.version != latest
            } catch {
                throw NSError(domain: "VersionCheck", code: 3, userInfo: [NSLocalizedDescriptionKey: "Failed to check for updates: \(error.localizedDescription)"])
            }
        }
    }
}
