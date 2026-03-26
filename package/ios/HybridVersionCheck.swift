import Foundation
import NitroModules

class HybridVersionCheck: HybridVersionCheckSpec {
    private static let session: URLSession = {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 15
        config.timeoutIntervalForResource = 30
        return URLSession(configuration: config)
    }()

    var version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String
        ?? { fatalError("[VersionCheck] Failed to read 'version' (CFBundleShortVersionString) from Info.plist") }()
    var buildNumber = Bundle.main.infoDictionary?["CFBundleVersion"] as? String
        ?? { fatalError("[VersionCheck] Failed to read 'buildNumber' (CFBundleVersion) from Info.plist") }()
    var packageName = Bundle.main.infoDictionary?["CFBundleIdentifier"] as? String
        ?? { fatalError("[VersionCheck] Failed to read 'packageName' (CFBundleIdentifier) from Info.plist") }()
    var installSource: InstallSource? = {
        guard let receiptURL = Bundle.main.appStoreReceiptURL,
              FileManager.default.fileExists(atPath: receiptURL.path) else {
            return nil
        }
        if receiptURL.lastPathComponent == "sandboxReceipt" {
            return .testflight
        }
        return .appstore
    }()

    func getCountry() throws -> String {
        if #available(iOS 16, *) {
            guard let region = Locale.current.region?.identifier else {
                throw NSError(domain: "VersionCheck", code: 4, userInfo: [NSLocalizedDescriptionKey: "Failed to determine device 'country' (Locale.current.region)"])
            }
            return region
        }
        guard let regionCode = Locale.current.regionCode else {
            throw NSError(domain: "VersionCheck", code: 4, userInfo: [NSLocalizedDescriptionKey: "Failed to determine device 'country' (Locale.current.regionCode)"])
        }
        return regionCode
    }

    func getStoreUrl(countryCode: String? = nil) throws -> Promise<String> {
        return Promise.async { [self] in
            let bundleId = Bundle.main.bundleIdentifier ?? ""
            let country = countryCode ?? (try? self.getCountry()) ?? "US"
            let urlString = "https://itunes.apple.com/\(country.lowercased())/lookup?bundleId=\(bundleId)"
            let url = URL(string: urlString)!
            let (data, _) = try await HybridVersionCheck.session.data(from: url)
            guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let results = json["results"] as? [[String: Any]],
                  let trackViewUrl = results.first?["trackViewUrl"] as? String else {
                throw NSError(domain: "VersionCheck", code: 1, userInfo: [NSLocalizedDescriptionKey: "App not found on App Store"])
            }
            return trackViewUrl
        }
    }

    func getLatestVersion(countryCode: String? = nil) throws -> Promise<String> {
        return Promise.async { [self] in
            let bundleId = Bundle.main.bundleIdentifier ?? ""
            let country = countryCode ?? (try? self.getCountry()) ?? "US"
            let urlString = "https://itunes.apple.com/\(country.lowercased())/lookup?bundleId=\(bundleId)"
            let url = URL(string: urlString)!
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
