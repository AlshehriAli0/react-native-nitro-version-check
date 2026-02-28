import Foundation
import NitroModules

class HybridVersionCheck: HybridVersionCheckSpec {
    private static let session: URLSession = {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 15
        config.timeoutIntervalForResource = 30
        return URLSession(configuration: config)
    }()

    var version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "unknown"
    var buildNumber = Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "unknown"
    var packageName = Bundle.main.infoDictionary?["CFBundleIdentifier"] as? String ?? "unknown"
    var installSource: String? = {
        guard let receiptURL = Bundle.main.appStoreReceiptURL,
              FileManager.default.fileExists(atPath: receiptURL.path) else {
            return nil
        }
        if receiptURL.lastPathComponent == "sandboxReceipt" {
            return "testflight"
        }
        return "appstore"
    }()

    func getCountry() throws -> String {
        if #available(iOS 16, *) {
            return Locale.current.region?.identifier ?? "unknown"
        }
        return Locale.current.regionCode ?? "unknown"
    }

    func getStoreUrl() throws -> Promise<String> {
        return Promise.async {
            let bundleId = Bundle.main.bundleIdentifier ?? ""
            let url = URL(string: "https://itunes.apple.com/lookup?bundleId=\(bundleId)")!
            let (data, _) = try await HybridVersionCheck.session.data(from: url)
            guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let results = json["results"] as? [[String: Any]],
                  let trackViewUrl = results.first?["trackViewUrl"] as? String else {
                throw NSError(domain: "VersionCheck", code: 1, userInfo: [NSLocalizedDescriptionKey: "App not found on App Store"])
            }
            return trackViewUrl
        }
    }

    func getLatestVersion() throws -> Promise<String> {
        return Promise.async {
            let bundleId = Bundle.main.bundleIdentifier ?? ""
            let url = URL(string: "https://itunes.apple.com/lookup?bundleId=\(bundleId)")!
            let (data, _) = try await HybridVersionCheck.session.data(from: url)
            guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let results = json["results"] as? [[String: Any]],
                  let latestVersion = results.first?["version"] as? String else {
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
