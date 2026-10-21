package com.margelo.nitro.nitroversioncheck

import java.util.regex.Pattern

internal object PlayStoreVersionParser {
    // shortcut: Play's metadata format is undocumented; update this match if Google changes it.
    private val versionPattern = Pattern.compile("""\[\[\["(\d+(?:\.\d+)+)"\]\],\[\[""")

    fun parse(html: String): String {
        val start = html.indexOf("AF_initDataCallback({key: 'ds:5',")
        val end = if (start >= 0) html.indexOf("</script>", start) else -1

        if (start >= 0 && end > start) {
            val match = versionPattern.matcher(html).region(start, end)
            if (match.find()) return match.group(1)
        }

        throw Exception("Could not parse latest version from Play Store app metadata")
    }
}
