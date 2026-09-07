package com.mcutracker.app

import android.app.Application
import com.mcutracker.app.data.PosterStore
import com.mcutracker.app.data.ProgressStore

/**
 * Both stores live for the life of the process: progress is a handful of ids, and the
 * poster cache is worth keeping warm across screen changes.
 */
class McuApp : Application() {
    val progress: ProgressStore by lazy { ProgressStore(this) }
    val posters: PosterStore by lazy { PosterStore(this) }
}
