package com.margelo.nitro.nitroversioncheck

import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Test

class PlayStoreVersionParserTest {
    @Test
    fun readsAppVersionInsteadOfReviewVersion() {
        for (version in listOf("2.5", "2.5.0", "2.5.0.123")) {
            assertEquals(version, PlayStoreVersionParser.parse(page("""[[["$version"]],[[[35]],[[[23,"6.0"]]]]]""")))
        }
    }

    @Test
    fun readsSparseVersionMetadata() {
        assertEquals("2.5.0", PlayStoreVersionParser.parse(page("""{"141":[[["2.5.0"]],[[[35]],[[[23,"6.0"]]]]]}""")))
    }

    @Test
    fun rejectsMissingVersionInsteadOfUsingReviewOrAndroidVersion() {
        assertThrows(Exception::class.java) {
            PlayStoreVersionParser.parse(page("""[[null,[]],[[[35]],[[[23,"6.0"]]]]]"""))
        }
    }

    @Test
    fun rejectsReviewOnlyPage() {
        assertThrows(Exception::class.java) {
            PlayStoreVersionParser.parse(reviews)
        }
    }

    @Test
    fun doesNotSearchPastAppMetadata() {
        assertThrows(Exception::class.java) {
            PlayStoreVersionParser.parse(page("null") + """<script>[[["9.9.9"]],[[[35]]]]</script>""")
        }
    }

    @Test
    fun rejectsTruncatedMetadata() {
        assertThrows(Exception::class.java) {
            PlayStoreVersionParser.parse("""<script>AF_initDataCallback({key: 'ds:5', data:[[["2.5.0"]],[[[35]]]]""")
        }
    }

    private val reviews = """<script>AF_initDataCallback({key: 'ds:10', data:[[["review",null,5,null,"Review",null,null,null,null,[[["avatar"]]],"1.93.2"]]], sideChannel: {}});</script>"""

    private fun page(versionInfo: String): String {
        val details = listOf("""["Example app"]""") + List(139) { "null" } + versionInfo

        return """
            $reviews
            <script>AF_initDataCallback({key: 'ds:5', hash: '1', data:[[[[]]],[null,null,[${details.joinToString(",")}]]], sideChannel: {}});</script>
        """.trimIndent()
    }
}
