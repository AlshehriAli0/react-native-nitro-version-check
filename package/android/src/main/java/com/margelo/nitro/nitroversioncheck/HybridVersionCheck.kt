package com.margelo.nitro.nitroversioncheck

import com.margelo.nitro.NitroModules


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
}