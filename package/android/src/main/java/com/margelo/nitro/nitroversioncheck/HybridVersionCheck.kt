package com.margelo.nitro.nitroversioncheck

import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise
import java.net.HttpURLConnection
import java.net.URL

class HybridVersionCheck : HybridVersionCheckSpec() {
    companion object {
        private const val TIMEOUT_MS = 15_000
        private val context = NitroModules.applicationContext
        private val packageInfo = context?.packageManager?.getPackageInfo(context.packageName, 0)
    }

    public override val version = packageInfo?.versionName ?: "unknown"

    public override val buildNumber = if (android.os.Build.VERSION.SDK_INT >= 28) {
        if (packageInfo?.longVersionCode != null) packageInfo.longVersionCode.toString() else "unknown"
    } else {
        @Suppress("DEPRECATION")
        if (packageInfo?.versionCode != null) packageInfo.versionCode.toString() else "unknown"
    }

    public override val packageName = packageInfo?.packageName ?: "unknown"
    public override val installSource: String? = run {
        val installer = if (android.os.Build.VERSION.SDK_INT >= 30) {
            context?.packageManager?.getInstallSourceInfo(context.packageName)?.installingPackageName
        } else {
            @Suppress("DEPRECATION")
            context?.packageManager?.getInstallerPackageName(context.packageName)
        }
        if (installer != null) "playstore" else null
    }

    override fun getCountry(): String {
        return java.util.Locale.getDefault().country ?: "unknown"
    }

    override fun getStoreUrl(countryCode: String?): Promise<String> {
        return Promise.async {
            // Country code is not used on Android Play Store, but parameter is kept for API consistency
            "https://play.google.com/store/apps/details?id=$packageName"
        }
    }

    override fun getLatestVersion(countryCode: String?): Promise<String> {
        return Promise.async {
            try {
                // Country code is not used on Android Play Store, but parameter is kept for API consistency
                val url = URL("https://play.google.com/store/apps/details?id=$packageName&hl=en")
                val connection = url.openConnection() as HttpURLConnection
                connection.connectTimeout = TIMEOUT_MS
                connection.readTimeout = TIMEOUT_MS
                connection.setRequestProperty("User-Agent", "Mozilla/5.0")
                val html = connection.inputStream.bufferedReader().use { it.readText() }
                val regex = Regex("""\]\]\],\s*"(\d+\.\d+[\d.]*\d)"""")
                val match = regex.find(html)
                match?.groupValues?.get(1)
                    ?: throw Exception("Could not parse latest version from Play Store page")
            } catch (e: Exception) {
                throw Exception("Failed to fetch latest version: ${e.message}", e)
            }
        }
    }

    override fun needsUpdate(): Promise<Boolean> {
        return Promise.async {
            try {
                val latest = getLatestVersion(null).await()
                version != latest
            } catch (e: Exception) {
                throw Exception("Failed to check for updates: ${e.message}", e)
            }
        }
    }
}
