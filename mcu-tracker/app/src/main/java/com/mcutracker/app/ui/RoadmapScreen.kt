package com.mcutracker.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mcutracker.app.data.Catalog
import com.mcutracker.app.data.Kind
import com.mcutracker.app.data.Phase
import com.mcutracker.app.data.PosterStore
import com.mcutracker.app.data.ProgressStore
import com.mcutracker.app.data.Title
import com.mcutracker.app.data.formatHours

private enum class Filter(val label: String) {
    ALL("All"),
    TO_WATCH("To watch"),
    WATCHED("Watched"),
    MOVIES("Movies"),
    SERIES("Series"),
}

@Composable
fun RoadmapScreen(
    progress: ProgressStore,
    posters: PosterStore,
    contentPadding: PaddingValues,
    onOpen: (Title) -> Unit,
) {
    var filter by remember { mutableStateOf(Filter.ALL) }
    var query by remember { mutableStateOf("") }
    val collapsed = remember { mutableStateMapOf<Int, Boolean>() }

    val trimmed = query.trim()
    fun visible(t: Title): Boolean {
        if (trimmed.isNotEmpty() && !t.name.contains(trimmed, ignoreCase = true)) return false
        return when (filter) {
            Filter.ALL -> true
            Filter.TO_WATCH -> !progress.isWatched(t.id) && !progress.isSkipped(t.id)
            Filter.WATCHED -> progress.isWatched(t.id)
            Filter.MOVIES -> t.kind == Kind.MOVIE
            Filter.SERIES -> t.kind != Kind.MOVIE
        }
    }

    val matches = Catalog.titles.count(::visible)

    LazyColumn(
        modifier = Modifier.fillMaxWidth(),
        contentPadding = contentPadding,
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        item(key = "header") { Header(progress) }

        item(key = "hero") {
            val next = progress.upNext
            if (next == null) {
                SagaCompleteCard(progress)
            } else {
                UpNextCard(next, posters, progress, onOpen)
            }
        }

        item(key = "controls") {
            Controls(
                query = query,
                onQuery = { query = it },
                filter = filter,
                onFilter = { filter = it },
            )
        }

        if (matches == 0) {
            item(key = "empty") { EmptyState(trimmed) }
        }

        Catalog.phases.forEach { phase ->
            val shown = Catalog.of(phase.id).filter(::visible)
            if (shown.isEmpty()) return@forEach

            val isCollapsed = collapsed[phase.id] == true
            item(key = "phase-${phase.id}") {
                PhaseHeader(
                    phase = phase,
                    watched = progress.watchedIn(phase.id),
                    total = progress.countedIn(phase.id),
                    collapsed = isCollapsed,
                    onToggle = { collapsed[phase.id] = !isCollapsed },
                )
            }
            if (!isCollapsed) {
                items(shown, key = { it.id }) { title ->
                    TitleRow(
                        title = title,
                        posters = posters,
                        watched = progress.isWatched(title.id),
                        skipped = progress.isSkipped(title.id),
                        isNext = progress.upNext?.id == title.id,
                        onToggle = { progress.toggleWatched(title.id) },
                        onOpen = { onOpen(title) },
                    )
                }
            }
        }

        item(key = "tail") { Spacer(Modifier.height(24.dp)) }
    }
}

// ---- header ---------------------------------------------------------------------

@Composable
private fun Header(progress: ProgressStore) {
    val counted = Catalog.titles.size - progress.skippedCount
    Column(Modifier.padding(top = 8.dp, bottom = 4.dp)) {
        Eyebrow("Marvel Cinematic Universe", MaterialTheme.colorScheme.primary)
        Spacer(Modifier.height(4.dp))
        Text(
            text = "The Roadmap",
            fontSize = 30.sp,
            fontWeight = FontWeight.Black,
            color = MaterialTheme.colorScheme.onBackground,
        )
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            ProgressRing(
                fraction = progress.fraction,
                caption = "${progress.watchedCount} of $counted",
            )
            Spacer(Modifier.width(18.dp))
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                StatTile(
                    value = formatHours(progress.watchedMinutes),
                    label = "watched so far",
                    accent = MaterialTheme.colorScheme.secondary,
                    modifier = Modifier.fillMaxWidth(),
                )
                StatTile(
                    value = formatHours(progress.remainingMinutes),
                    label = "still to go",
                    accent = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        }
    }
}

// ---- up next --------------------------------------------------------------------

@Composable
private fun UpNextCard(
    title: Title,
    posters: PosterStore,
    progress: ProgressStore,
    onOpen: (Title) -> Unit,
) {
    val accent = title.phase.accent
    Column(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(MaterialTheme.colorScheme.surfaceContainer)
            .border(1.dp, accent.copy(alpha = 0.45f), RoundedCornerShape(20.dp))
            .clickable { onOpen(title) }
            .padding(14.dp),
    ) {
        Row {
            Poster(
                title = title,
                posters = posters,
                modifier = Modifier.size(width = 104.dp, height = 156.dp),
                corner = 14.dp,
                initialsSize = 30.sp,
            )
            Spacer(Modifier.width(14.dp))
            Column(Modifier.weight(1f)) {
                Eyebrow("Up next", accent)
                Spacer(Modifier.height(6.dp))
                Text(
                    text = title.name,
                    fontSize = 20.sp,
                    lineHeight = 25.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface,
                )
                Spacer(Modifier.height(6.dp))
                Text(
                    text = "${title.year} · ${title.subtitle}",
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(Modifier.height(10.dp))
                PhasePill(title.phase)
            }
        }

        title.note?.let { note ->
            Spacer(Modifier.height(12.dp))
            Text(
                text = note,
                fontSize = 12.sp,
                lineHeight = 17.sp,
                color = MaterialTheme.colorScheme.secondary,
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.45f))
                    .padding(10.dp),
            )
        }

        Spacer(Modifier.height(14.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Button(
                onClick = { progress.setWatched(title.id, true) },
                modifier = Modifier.weight(1f),
                colors = ButtonDefaults.buttonColors(
                    containerColor = accent,
                    contentColor = Color.Black,
                ),
            ) {
                Icon(Icons.Filled.Check, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(6.dp))
                Text("Mark watched", fontWeight = FontWeight.SemiBold)
            }
            OutlinedButton(onClick = { progress.setSkipped(title.id, true) }) {
                Text("Skip")
            }
        }
    }
}

@Composable
private fun SagaCompleteCard(progress: ProgressStore) {
    Column(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(MaterialTheme.colorScheme.primaryContainer)
            .padding(18.dp),
        verticalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Eyebrow("Roadmap complete", MaterialTheme.colorScheme.primary)
        Text(
            text = "You have watched the whole thing.",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onPrimaryContainer,
        )
        Text(
            text = "${progress.watchedCount} titles, ${formatHours(progress.watchedMinutes)} " +
                "of the Infinity and Multiverse sagas. Time to start it over.",
            fontSize = 13.sp,
            lineHeight = 18.sp,
            color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.85f),
        )
    }
}

// ---- controls -------------------------------------------------------------------

@Composable
private fun Controls(
    query: String,
    onQuery: (String) -> Unit,
    filter: Filter,
    onFilter: (Filter) -> Unit,
) {
    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
        OutlinedTextField(
            value = query,
            onValueChange = onQuery,
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            shape = RoundedCornerShape(14.dp),
            placeholder = { Text("Search ${Catalog.titles.size} titles") },
            leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null) },
            trailingIcon = {
                if (query.isNotEmpty()) {
                    IconButton(onClick = { onQuery("") }) {
                        Icon(Icons.Filled.Close, contentDescription = "Clear search")
                    }
                }
            },
        )
        Row(
            modifier = Modifier.horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Filter.entries.forEach { option ->
                FilterChip(
                    selected = filter == option,
                    onClick = { onFilter(option) },
                    label = { Text(option.label, fontSize = 12.sp) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = MaterialTheme.colorScheme.primary,
                        selectedLabelColor = Color.White,
                    ),
                )
            }
        }
    }
}

@Composable
private fun EmptyState(query: String) {
    Column(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(MaterialTheme.colorScheme.surfaceContainer)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Text(
            text = if (query.isEmpty()) "Nothing here" else "No title matches \"$query\"",
            fontWeight = FontWeight.SemiBold,
            color = MaterialTheme.colorScheme.onSurface,
        )
        Text(
            text = "Try a different filter.",
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

// ---- phase + rows ---------------------------------------------------------------

@Composable
private fun PhaseHeader(
    phase: Phase,
    watched: Int,
    total: Int,
    collapsed: Boolean,
    onToggle: () -> Unit,
) {
    Column(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(MaterialTheme.colorScheme.surface)
            .clickable(onClick = onToggle)
            .padding(14.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                Modifier
                    .size(width = 4.dp, height = 34.dp)
                    .clip(RoundedCornerShape(2.dp))
                    .background(phase.accent)
            )
            Spacer(Modifier.width(12.dp))
            Column(Modifier.weight(1f)) {
                Eyebrow(phase.name, phase.accent)
                Text(
                    text = phase.tagline,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface,
                )
            }
            Text(
                text = "$watched/$total",
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Icon(
                imageVector = if (collapsed) Icons.Filled.KeyboardArrowDown else Icons.Filled.KeyboardArrowUp,
                contentDescription = if (collapsed) "Expand phase" else "Collapse phase",
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        Spacer(Modifier.height(10.dp))
        ThinBar(
            fraction = if (total == 0) 0f else watched.toFloat() / total,
            accent = phase.accent,
            modifier = Modifier.fillMaxWidth(),
        )
    }
}

@Composable
private fun TitleRow(
    title: Title,
    posters: PosterStore,
    watched: Boolean,
    skipped: Boolean,
    isNext: Boolean,
    onToggle: () -> Unit,
    onOpen: () -> Unit,
) {
    val accent = title.phase.accent
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(
                if (isNext) MaterialTheme.colorScheme.surfaceContainerHigh
                else MaterialTheme.colorScheme.surface
            )
            .clickable(onClick = onOpen)
            .padding(10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Poster(
            title = title,
            posters = posters,
            modifier = Modifier
                .size(width = 46.dp, height = 69.dp)
                .alpha(if (watched || skipped) 0.45f else 1f),
            corner = 8.dp,
            initialsSize = 15.sp,
        )
        Spacer(Modifier.width(12.dp))
        Column(Modifier.weight(1f)) {
            Text(
                text = title.name,
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                textDecoration = if (skipped) TextDecoration.LineThrough else null,
                color = if (watched || skipped) MaterialTheme.colorScheme.onSurfaceVariant
                else MaterialTheme.colorScheme.onSurface,
            )
            Spacer(Modifier.height(3.dp))
            Text(
                text = "${title.year} · ${title.subtitle}",
                fontSize = 11.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            if (isNext || skipped || title.note != null) {
                Spacer(Modifier.height(5.dp))
                val (badge, tint) = when {
                    skipped -> "Skipped" to MaterialTheme.colorScheme.onSurfaceVariant
                    isNext -> "Up next" to accent
                    else -> "Watch order note" to MaterialTheme.colorScheme.secondary
                }
                Eyebrow(badge, tint)
            }
        }
        Spacer(Modifier.width(8.dp))
        WatchToggle(watched = watched, accent = accent, onToggle = onToggle)
    }
}

/** The tick circle on the right of every row. */
@Composable
private fun WatchToggle(watched: Boolean, accent: Color, onToggle: () -> Unit) {
    Box(
        Modifier
            .size(34.dp)
            .clip(CircleShape)
            .background(if (watched) accent else Color.Transparent)
            .border(
                width = if (watched) 0.dp else 1.5.dp,
                color = if (watched) Color.Transparent else MaterialTheme.colorScheme.outline,
                shape = CircleShape,
            )
            .clickable(onClick = onToggle),
        contentAlignment = Alignment.Center,
    ) {
        Icon(
            imageVector = Icons.Filled.Check,
            contentDescription = if (watched) "Mark unwatched" else "Mark watched",
            tint = if (watched) Color.Black else MaterialTheme.colorScheme.outline,
            modifier = Modifier.size(19.dp),
        )
    }
}

@Composable
private fun PhasePill(phase: Phase) {
    Text(
        text = "${phase.name} · ${phase.saga}",
        fontSize = 10.sp,
        fontWeight = FontWeight.SemiBold,
        color = phase.accent,
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(phase.accent.copy(alpha = 0.14f))
            .padding(horizontal = 10.dp, vertical = 5.dp),
    )
}
