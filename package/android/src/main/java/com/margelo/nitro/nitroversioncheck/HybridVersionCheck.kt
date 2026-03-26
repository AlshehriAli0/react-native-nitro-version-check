package com.margelo.nitro.nitroversioncheck

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise
import java.net.HttpURLConnection
import java.net.URL

@Keep
@DoNotStrip
class HybridVersionCheck : HybridVersionCheckSpec() {
    companion object {
        private const val TIMEOUT_MS = 15_000
        private val context = NitroModules.applicationContext
        private val packageInfo = context?.packageManager?.getPackageInfo(context.packageName, 0)
    }

    public override val version = packageInfo?.versionName
        ?: error("[VersionCheck] Failed to read 'version' (versionName) from PackageInfo")

    public override val buildNumber = if (android.os.Build.VERSION.SDK_INT >= 28) {
        packageInfo?.longVersionCode?.toString()
            ?: error("[VersionCheck] Failed to read 'buildNumber' (longVersionCode) from PackageInfo")
    } else {
        @Suppress("DEPRECATION")
        packageInfo?.versionCode?.toString()
            ?: error("[VersionCheck] Failed to read 'buildNumber' (versionCode) from PackageInfo")
    }

    public override val packageName = packageInfo?.packageName
        ?: error("[VersionCheck] Failed to read 'packageName' from PackageInfo")
    public override val installSource: InstallSource = run {
        val installer = if (android.os.Build.VERSION.SDK_INT >= 30) {
            context?.packageManager?.getInstallSourceInfo(context.packageName)?.installingPackageName
        } else {
            @Suppress("DEPRECATION")
            context?.packageManager?.getInstallerPackageName(context.packageName)
        }
        if (installer != null) InstallSource.PLAYSTORE else InstallSource.SIDELOADED
    }

    override fun getCountry(): String {
        return java.util.Locale.getDefault().country
            ?: error("[VersionCheck] Failed to determine device 'country' (Locale.getDefault().country)")
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
