package com.margelo.nitro.nitroversioncheck

import com.margelo.nitro.NitroModules


class HybridVersionCheck: HybridVersionCheckSpec(){
    companion object {
        private val context = NitroModules.applicationContext
    }

    override fun getVersion(): String {
        val packageInfo = context?.packageManager?.getPackageInfo(context.packageName, 0)
        return packageInfo?.versionName ?: "unknown"
    }
}