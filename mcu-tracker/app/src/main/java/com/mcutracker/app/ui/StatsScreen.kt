package com.mcutracker.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.material3.AlertDialog
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mcutracker.app.data.Catalog
import com.mcutracker.app.data.Kind
import com.mcutracker.app.data.ProgressStore
import com.mcutracker.app.data.formatHours
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import kotlin.math.ceil

private val DayFormat: DateTimeFormatter = DateTimeFormatter.ofPattern("d MMM yyyy")
private val ShortDay: DateTimeFormatter = DateTimeFormatter.ofPattern("d MMM")

@Composable
fun StatsScreen(
    progress: ProgressStore,
    contentPadding: PaddingValues,
) {
    var pace by remember { mutableIntStateOf(3) }
    var confirmReset by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier.fillMaxWidth(),
        contentPadding = contentPadding,
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item(key = "title") {
            Column(Modifier.padding(top = 8.dp)) {
                Eyebrow("Your progress", MaterialTheme.colorScheme.primary)
                Spacer(Modifier.height(4.dp))
                Text(
                    text = "Statistics",
                    fontSize = 30.sp,
                    fontWeight = FontWeight.Black,
                    color = MaterialTheme.colorScheme.onBackground,
                )
            }
        }

        item(key = "tiles") { HeadlineTiles(progress) }
        item(key = "forecast") { Forecast(progress, pace) { pace = it } }
        item(key = "phases") { PhaseBreakdown(progress) }
        item(key = "kinds") { KindBreakdown(progress) }

        val recent = progress.recentlyWatched(6)
        if (recent.isNotEmpty()) {
            item(key = "recent") {
                Panel("Recently ticked off") {
                    recent.forEachIndexed { index, (title, ts) ->
                        if (index > 0) {
                            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                        }
                        Row(
                            Modifier
                                .fillMaxWidth()
                                .padding(vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Column(Modifier.weight(1f)) {
                                Text(
                                    text = title.name,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = MaterialTheme.colorScheme.onSurface,
                                )
                                Text(
                                    text = title.phase.name,
                                    fontSize = 11.sp,
                                    color = title.phase.accent,
                                )
                            }
                            Text(
                                text = Instant.ofEpochMilli(ts)
                                    .atZone(ZoneId.systemDefault())
                                    .toLocalDate()
                                    .format(ShortDay),
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                }
            }
        }

        item(key = "reset") {
            TextButton(onClick = { confirmReset = true }) {
                Text("Reset all progress", color = MaterialTheme.colorScheme.error)
            }
        }

        item(key = "tail") { Spacer(Modifier.height(24.dp)) }
    }

    if (confirmReset) {
        AlertDialog(
            onDismissRequest = { confirmReset = false },
            title = { Text("Reset progress?") },
            text = { Text("Every title goes back to unwatched. This cannot be undone.") },
            confirmButton = {
                TextButton(onClick = {
                    progress.resetAll()
                    confirmReset = false
                }) {
                    Text("Reset", color = MaterialTheme.colorScheme.error)
                }
            },
            dismissButton = {
                TextButton(onClick = { confirmReset = false }) { Text("Cancel") }
            },
        )
    }
}

@Composable
private fun HeadlineTiles(progress: ProgressStore) {
    val counted = Catalog.titles.size - progress.skippedCount
    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            StatTile(
                value = "${progress.watchedCount}/$counted",
                label = "titles watched",
                accent = MaterialTheme.colorScheme.primary,
                modifier = Modifier.weight(1f),
            )
            StatTile(
                value = "${Math.round(progress.fraction * 100)}%",
                label = "of the roadmap",
                accent = MaterialTheme.colorScheme.secondary,
                modifier = Modifier.weight(1f),
            )
        }
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            StatTile(
                value = formatHours(progress.watchedMinutes),
                label = "hours behind you",
                accent = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.weight(1f),
            )
            StatTile(
                value = formatHours(progress.remainingMinutes),
                label = "hours ahead",
                accent = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.weight(1f),
            )
        }
    }
}

@Composable
private fun Forecast(progress: ProgressStore, pace: Int, onPace: (Int) -> Unit) {
    val left = progress.remaining.size
    Panel("Finish line") {
        if (left == 0) {
            Text(
                text = "Nothing left on the list.",
                fontSize = 14.sp,
                color = MaterialTheme.colorScheme.onSurface,
            )
            return@Panel
        }

        Text(
            text = "At this pace:",
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(Modifier.height(8.dp))
        Row(
            modifier = Modifier.horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            listOf(1, 2, 3, 5, 7).forEach { option ->
                FilterChip(
                    selected = pace == option,
                    onClick = { onPace(option) },
                    label = {
                        Text(
                            text = if (option == 1) "1 a week" else "$option a week",
                            fontSize = 12.sp,
                        )
                    },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = MaterialTheme.colorScheme.primary,
                        selectedLabelColor = Color.White,
                    ),
                )
            }
        }

        val weeks = ceil(left.toDouble() / pace).toLong()
        val finish = LocalDate.now().plusWeeks(weeks)

        Spacer(Modifier.height(14.dp))
        Text(
            text = finish.format(DayFormat),
            fontSize = 24.sp,
            fontWeight = FontWeight.Black,
            color = MaterialTheme.colorScheme.primary,
        )
        Spacer(Modifier.height(4.dp))
        Text(
            text = "$left titles left · about $weeks " +
                (if (weeks == 1L) "week" else "weeks") +
                " · ${formatHours(progress.remainingMinutes)} of viewing",
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
private fun PhaseBreakdown(progress: ProgressStore) {
    Panel("By phase") {
        Catalog.phases.forEachIndexed { index, phase ->
            if (index > 0) Spacer(Modifier.height(14.dp))
            val watched = progress.watchedIn(phase.id)
            val total = progress.countedIn(phase.id)
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text(
                        text = phase.name,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurface,
                    )
                    Text(
                        text = phase.tagline,
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                Text(
                    text = "$watched/$total",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = phase.accent,
                )
            }
            Spacer(Modifier.height(8.dp))
            ThinBar(
                fraction = if (total == 0) 0f else watched.toFloat() / total,
                accent = phase.accent,
                modifier = Modifier.fillMaxWidth(),
            )
        }
    }
}

@Composable
private fun KindBreakdown(progress: ProgressStore) {
    val movies = Catalog.titles.filter { it.kind == Kind.MOVIE }
    val shows = Catalog.titles.filter { it.kind != Kind.MOVIE }
    val moviesDone = movies.count { progress.isWatched(it.id) }
    val showsDone = shows.count { progress.isWatched(it.id) }

    Panel("Movies vs series") {
        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            ProgressRing(
                fraction = moviesDone.toFloat() / movies.size,
                caption = "$moviesDone/${movies.size}\nmovies",
                diameter = 92.dp,
                thickness = 9.dp,
                accent = MaterialTheme.colorScheme.primary,
            )
            ProgressRing(
                fraction = showsDone.toFloat() / shows.size,
                caption = "$showsDone/${shows.size}\nseries",
                diameter = 92.dp,
                thickness = 9.dp,
                accent = MaterialTheme.colorScheme.secondary,
            )
        }
        if (progress.skippedCount > 0) {
            Spacer(Modifier.height(14.dp))
            Text(
                text = "${progress.skippedCount} skipped and left out of the totals.",
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

/** Standard rounded card with a section heading. */
@Composable
private fun Panel(heading: String, content: @Composable androidx.compose.foundation.layout.ColumnScope.() -> Unit) {
    Column(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(18.dp))
            .background(MaterialTheme.colorScheme.surface)
            .padding(16.dp),
    ) {
        Eyebrow(heading, MaterialTheme.colorScheme.onSurfaceVariant)
        Spacer(Modifier.height(12.dp))
        content()
    }
}
