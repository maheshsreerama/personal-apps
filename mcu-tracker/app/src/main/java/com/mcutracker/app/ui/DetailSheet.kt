package com.mcutracker.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mcutracker.app.data.PosterStore
import com.mcutracker.app.data.ProgressStore
import com.mcutracker.app.data.Title
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

private val WatchedOnFormat: DateTimeFormatter = DateTimeFormatter.ofPattern("d MMMM yyyy")

/** Everything about one title, plus the two buttons that change its state. */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetailSheet(
    title: Title,
    progress: ProgressStore,
    posters: PosterStore,
    onDismiss: () -> Unit,
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val accent = title.phase.accent
    val watched = progress.isWatched(title.id)
    val skipped = progress.isSkipped(title.id)

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = MaterialTheme.colorScheme.surface,
    ) {
        Column(
            Modifier
                .padding(horizontal = 20.dp)
                .navigationBarsPadding()
                .padding(bottom = 20.dp)
        ) {
            Row {
                Poster(
                    title = title,
                    posters = posters,
                    modifier = Modifier.size(width = 116.dp, height = 174.dp),
                    corner = 14.dp,
                    initialsSize = 32.sp,
                )
                Spacer(Modifier.width(16.dp))
                Column(Modifier.weight(1f)) {
                    Eyebrow("${title.phase.name} · ${title.phase.saga}", accent)
                    Spacer(Modifier.height(8.dp))
                    Text(
                        text = title.name,
                        fontSize = 22.sp,
                        lineHeight = 27.sp,
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.onSurface,
                    )
                    Spacer(Modifier.height(8.dp))
                    Text(
                        text = "${title.year}",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Text(
                        text = title.subtitle,
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Spacer(Modifier.height(10.dp))
                    Text(
                        text = "#${title.order + 1} in watch order",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = accent,
                    )
                }
            }

            Spacer(Modifier.height(18.dp))
            Text(
                text = title.blurb,
                fontSize = 14.sp,
                lineHeight = 21.sp,
                color = MaterialTheme.colorScheme.onSurface,
            )

            title.note?.let { note ->
                Spacer(Modifier.height(14.dp))
                Column(
                    Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.4f))
                        .padding(12.dp)
                ) {
                    Eyebrow("Watch order note", MaterialTheme.colorScheme.secondary)
                    Spacer(Modifier.height(6.dp))
                    Text(
                        text = note,
                        fontSize = 13.sp,
                        lineHeight = 19.sp,
                        color = MaterialTheme.colorScheme.onSurface,
                    )
                }
            }

            progress.watchedOn(title.id)?.let { ts ->
                Spacer(Modifier.height(14.dp))
                Text(
                    text = "Watched on " + Instant.ofEpochMilli(ts)
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate()
                        .format(WatchedOnFormat),
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }

            Spacer(Modifier.height(20.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Button(
                    onClick = { progress.toggleWatched(title.id) },
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (watched) MaterialTheme.colorScheme.surfaceVariant else accent,
                        contentColor = if (watched) MaterialTheme.colorScheme.onSurface else Color.Black,
                    ),
                ) {
                    Icon(
                        imageVector = if (watched) Icons.Filled.Close else Icons.Filled.Check,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp),
                    )
                    Spacer(Modifier.width(6.dp))
                    Text(
                        text = if (watched) "Mark unwatched" else "Mark watched",
                        fontWeight = FontWeight.SemiBold,
                    )
                }
                OutlinedButton(onClick = { progress.toggleSkipped(title.id) }) {
                    Text(if (skipped) "Unskip" else "Skip")
                }
            }
        }
    }
}
