package com.mcutracker.app.data

import android.content.Context
import android.content.SharedPreferences
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

/**
 * Everything the app remembers about you: which titles are watched (and when), and
 * which ones you have chosen to skip.
 *
 * Backed by [SharedPreferences] — a few dozen booleans do not need a database — and
 * exposed through Compose snapshot state so writes redraw the UI with no plumbing.
 */
class ProgressStore(context: Context) {

    private val prefs: SharedPreferences =
        context.applicationContext.getSharedPreferences("mcu-progress", Context.MODE_PRIVATE)

    /** Title id -> epoch millis it was ticked off. */
    private val watchedAt = mutableStateMapOf<String, Long>()

    /** Titles deliberately left out: they stop blocking "Up Next" and leave the totals. */
    private val skipped = mutableStateMapOf<String, Boolean>()

    /** Bumped on every change so derived screens recompute. */
    var revision by mutableStateOf(0)
        private set

    init {
        prefs.getStringSet(KEY_WATCHED, emptySet()).orEmpty().forEach { id ->
            if (Catalog.byId.containsKey(id)) {
                watchedAt[id] = prefs.getLong(tsKey(id), 0L)
            }
        }
        prefs.getStringSet(KEY_SKIPPED, emptySet()).orEmpty().forEach { id ->
            if (Catalog.byId.containsKey(id)) skipped[id] = true
        }
    }

    // ---- queries -------------------------------------------------------------

    fun isWatched(id: String): Boolean = watchedAt.containsKey(id)

    fun isSkipped(id: String): Boolean = skipped.containsKey(id)

    fun watchedOn(id: String): Long? = watchedAt[id]?.takeIf { it > 0L }

    val watchedCount: Int get() = watchedAt.size

    val skippedCount: Int get() = skipped.size

    /** Titles that still genuinely need watching — skips do not count against you. */
    val remaining: List<Title>
        get() = Catalog.titles.filter { !isWatched(it.id) && !isSkipped(it.id) }

    /** The single next thing to watch, in roadmap order. Null once you are done. */
    val upNext: Title? get() = remaining.firstOrNull()

    val watchedMinutes: Int
        get() = Catalog.titles.sumOf { if (isWatched(it.id)) it.minutes else 0 }

    val remainingMinutes: Int get() = remaining.sumOf { it.minutes }

    /** 0f..1f over everything you have not skipped. */
    val fraction: Float
        get() {
            val counted = Catalog.titles.count { !isSkipped(it.id) }
            if (counted == 0) return 1f
            return watchedCount.toFloat() / counted
        }

    fun watchedIn(phaseId: Int): Int = Catalog.of(phaseId).count { isWatched(it.id) }

    fun countedIn(phaseId: Int): Int = Catalog.of(phaseId).count { !isSkipped(it.id) }

    /** Most recently ticked off first — powers the stats "recent activity" list. */
    fun recentlyWatched(limit: Int): List<Pair<Title, Long>> =
        watchedAt.entries
            .mapNotNull { (id, ts) -> Catalog.byId[id]?.let { it to ts } }
            .filter { it.second > 0L }
            .sortedByDescending { it.second }
            .take(limit)

    // ---- mutations -----------------------------------------------------------

    fun setWatched(id: String, watched: Boolean) {
        if (watched) {
            if (watchedAt.containsKey(id)) return
            watchedAt[id] = System.currentTimeMillis()
            skipped.remove(id) // watching something un-skips it
        } else {
            if (!watchedAt.containsKey(id)) return
            watchedAt.remove(id)
        }
        persist()
    }

    fun toggleWatched(id: String) = setWatched(id, !isWatched(id))

    fun setSkipped(id: String, skip: Boolean) {
        if (skip) {
            if (skipped.containsKey(id)) return
            skipped[id] = true
            watchedAt.remove(id) // skipping something un-watches it
        } else {
            if (!skipped.containsKey(id)) return
            skipped.remove(id)
        }
        persist()
    }

    fun toggleSkipped(id: String) = setSkipped(id, !isSkipped(id))

    /** Tick off (or clear) a whole phase in one go. */
    fun setPhaseWatched(phaseId: Int, watched: Boolean) {
        Catalog.of(phaseId).forEach { title ->
            if (watched) {
                if (!watchedAt.containsKey(title.id)) {
                    watchedAt[title.id] = System.currentTimeMillis()
                    skipped.remove(title.id)
                }
            } else {
                watchedAt.remove(title.id)
            }
        }
        persist()
    }

    fun resetAll() {
        watchedAt.clear()
        skipped.clear()
        persist()
    }

    private fun persist() {
        prefs.edit().apply {
            putStringSet(KEY_WATCHED, watchedAt.keys.toSet())
            putStringSet(KEY_SKIPPED, skipped.keys.toSet())
            watchedAt.forEach { (id, ts) -> putLong(tsKey(id), ts) }
            apply()
        }
        revision++
    }

    private companion object {
        const val KEY_WATCHED = "watched"
        const val KEY_SKIPPED = "skipped"
        fun tsKey(id: String) = "ts_$id"
    }
}
