package com.mcutracker.app.data

import android.content.Context
import android.net.Uri
import androidx.compose.runtime.mutableStateMapOf
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

/**
 * Resolves a poster image URL for each title, lazily and exactly once.
 *
 * Poster URLs are deliberately *not* baked into the app: image paths rot, and a stale
 * hard-coded link is a permanently broken tile. Instead each title carries its exact
 * Wikipedia article name, and the article's lead image is looked up on first sight and
 * then cached on disk forever. Anything that fails just falls back to generated artwork,
 * so the grid never shows a hole.
 */
class PosterStore(context: Context) {

    private val prefs = context.applicationContext
        .getSharedPreferences("mcu-posters", Context.MODE_PRIVATE)

    /** Title id -> resolved URL. Absent means "not looked up yet". */
    private val urls = mutableStateMapOf<String, String>()

    private val inFlight = mutableSetOf<String>()
    private val gate = Semaphore(4)
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    init {
        Catalog.titles.forEach { title ->
            prefs.getString(title.id, null)?.let { urls[title.id] = it }
        }
    }

    /** The poster URL if we have one. Null while unknown or unavailable. */
    fun url(id: String): String? = urls[id]?.takeIf { it.isNotEmpty() }

    /** Idempotent: safe to call from composition on every frame. */
    fun request(title: Title) {
        if (urls.containsKey(title.id)) return
        synchronized(inFlight) {
            if (!inFlight.add(title.id)) return
        }
        scope.launch {
            val resolved = gate.withPermit { lookup(title) }
            // Empty string is a real answer ("no poster"), and stops us asking again.
            urls[title.id] = resolved.orEmpty()
            if (resolved != null) prefs.edit().putString(title.id, resolved).apply()
            synchronized(inFlight) { inFlight.remove(title.id) }
        }
    }

    private suspend fun lookup(title: Title): String? = withContext(Dispatchers.IO) {
        val path = Uri.encode(title.wikiTitle.replace(' ', '_'))
        val endpoint = "https://en.wikipedia.org/api/rest_v1/page/summary/$path"
        var conn: HttpURLConnection? = null
        try {
            conn = (URL(endpoint).openConnection() as HttpURLConnection).apply {
                connectTimeout = 10_000
                readTimeout = 10_000
                instanceFollowRedirects = true
                setRequestProperty("User-Agent", USER_AGENT)
                setRequestProperty("Accept", "application/json")
            }
            if (conn.responseCode != HttpURLConnection.HTTP_OK) return@withContext null
            val body = conn.inputStream.bufferedReader().use { it.readText() }
            val json = JSONObject(body)

            val thumb = json.optJSONObject("thumbnail")?.optString("source").orEmpty()
            if (thumb.isNotEmpty()) {
                // Thumbnails come back around 320px wide; ask the same renderer for a
                // sharper one by rewriting the width segment of the path.
                return@withContext thumb.replace(Regex("/\\d+px-"), "/$POSTER_WIDTH-")
            }
            json.optJSONObject("originalimage")?.optString("source")?.takeIf { it.isNotEmpty() }
        } catch (_: Exception) {
            null
        } finally {
            conn?.disconnect()
        }
    }

    companion object {
        private const val POSTER_WIDTH = "500px"

        /**
         * Wikimedia asks clients to identify themselves; an anonymous default gets
         * throttled or refused outright.
         */
        const val USER_AGENT =
            "MCURoadmap/1.0 (Android; personal watch-list app; https://github.com/maheshsreerama/personal-apps)"
    }
}
