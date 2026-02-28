package com.margelo.nitro.nitroversioncheck

import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise
import java.net.URL


class HybridVersionCheck: HybridVersionCheckSpec(){
    companion object {
        private val context = NitroModules.applicationContext
        private val packageInfo = context?.packageManager?.getPackageInfo(context.packageName, 0)

    }
    public override val version = packageInfo?.versionName ?: "unknown"

    public override val buildNumber = if (android.os.Build.VERSION.SDK_INT >= 28) {
        if (packageInfo?.longVersionCode != null)  packageInfo.longVersionCode.toString() else "unknown"
    } else {
        @Suppress("DEPRECATION")
        if (packageInfo?.versionCode != null)  packageInfo.versionCode.toString() else "unknown"
    }


    override fun getCountry(): String {
      return java.util.Locale.getDefault().country ?: "unknown"
    }

    public override val packageName= packageInfo?.packageName ?: "unknown"

    override fun getStoreUrl(): Promise<String> {
        return Promise.async {
            "https://play.google.com/store/apps/details?id=$packageName"
        }
    }

    override fun getLatestVersion(): Promise<String> {
        return Promise.async {
            try {
                val url = URL("https://play.google.com/store/apps/details?id=$packageName&hl=en")
                val html = url.readText()
                val regex = Regex("""\[\[\["(\d+\.\d+[\.\d+]*)"\]\]""")
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
                val latest = getLatestVersion().await()
                version != latest
            } catch (e: Exception) {
                throw Exception("Failed to check for updates: ${e.message}", e)
            }
        }
    }
}