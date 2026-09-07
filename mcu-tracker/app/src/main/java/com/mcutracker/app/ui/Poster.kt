package com.mcutracker.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.compositeOver
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import com.mcutracker.app.data.PosterStore
import com.mcutracker.app.data.Title

/**
 * A poster tile.
 *
 * Generated artwork is drawn first and always stays underneath, so there is no grey box
 * while the network answers and no broken tile if it never does. The real poster simply
 * fades in on top when it arrives.
 */
@Composable
fun Poster(
    title: Title,
    posters: PosterStore,
    modifier: Modifier = Modifier,
    corner: Dp = 12.dp,
    initialsSize: TextUnit = 22.sp,
) {
    LaunchedEffect(title.id) { posters.request(title) }
    val url = posters.url(title.id)

    Box(modifier.clip(RoundedCornerShape(corner))) {
        GeneratedArt(title, initialsSize, Modifier.fillMaxSize())
        if (url != null) {
            AsyncImage(
                model = ImageRequest.Builder(LocalContext.current)
                    .data(url)
                    // Wikimedia refuses anonymous clients, so identify the app per request
                    // rather than hand-rolling a whole ImageLoader for one header.
                    .addHeader("User-Agent", PosterStore.USER_AGENT)
                    .crossfade(240)
                    .build(),
                contentDescription = title.name,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize(),
            )
        }
    }
}

/**
 * The fallback that every tile sits on: a deterministic two-tone wash in the title's
 * phase colour, stamped with its initials. Same title always gets the same art.
 */
@Composable
private fun GeneratedArt(title: Title, initialsSize: TextUnit, modifier: Modifier = Modifier) {
    val accent = title.phase.accent
    // A stable per-title tilt so neighbouring tiles do not look stamped from one mould.
    val skew = ((title.id.hashCode() and 0x7fffffff) % 5) * 0.06f
    val base = MaterialTheme.colorScheme.surfaceContainer

    Box(
        modifier.background(
            Brush.linearGradient(
                listOf(
                    accent.copy(alpha = 0.34f + skew).compositeOver(base),
                    accent.copy(alpha = 0.10f).compositeOver(Color(0xFF07070C)),
                )
            )
        ),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = initialsOf(title.name),
            color = Color.White.copy(alpha = 0.34f),
            fontSize = initialsSize,
            fontWeight = FontWeight.Black,
        )
    }
}

/** "Avengers: Endgame" -> "AE", "Thor" -> "TH". */
private fun initialsOf(name: String): String {
    val words = name
        .split(' ', ':', '-', '&')
        .filter { it.isNotBlank() && it.first().isLetterOrDigit() }
    return when {
        words.isEmpty() -> "?"
        words.size == 1 -> words[0].take(2).uppercase()
        else -> (words[0].first().toString() + words[1].first()).uppercase()
    }
}
