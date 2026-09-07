package com.mcutracker.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.List
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mcutracker.app.data.PosterStore
import com.mcutracker.app.data.ProgressStore
import com.mcutracker.app.data.Title

/** Warm glow behind the top of the page — the light spill of a screen in a dark room. */
private val TopGlow = Color(0xFF23090D)

@Composable
fun McuRoot(progress: ProgressStore, posters: PosterStore) {
    var tab by remember { mutableIntStateOf(0) }
    var selected by remember { mutableStateOf<Title?>(null) }

    Box(
        Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        Box(
            Modifier
                .fillMaxWidth()
                .height(360.dp)
                .background(Brush.verticalGradient(listOf(TopGlow, Color.Transparent)))
        )

        Scaffold(
            containerColor = Color.Transparent,
            bottomBar = {
                NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
                    NavigationBarItem(
                        selected = tab == 0,
                        onClick = { tab = 0 },
                        icon = { Icon(Icons.Filled.List, contentDescription = null) },
                        label = { Text("Roadmap", fontSize = 11.sp) },
                        colors = navColors(),
                    )
                    NavigationBarItem(
                        selected = tab == 1,
                        onClick = { tab = 1 },
                        icon = { Icon(Icons.Filled.DateRange, contentDescription = null) },
                        label = { Text("Stats", fontSize = 11.sp) },
                        colors = navColors(),
                    )
                }
            },
        ) { inner ->
            val padding = PaddingValues(
                start = 16.dp,
                end = 16.dp,
                top = inner.calculateTopPadding(),
                bottom = inner.calculateBottomPadding() + 8.dp,
            )
            when (tab) {
                0 -> RoadmapScreen(
                    progress = progress,
                    posters = posters,
                    contentPadding = padding,
                    onOpen = { selected = it },
                )

                else -> StatsScreen(progress = progress, contentPadding = padding)
            }
        }
    }

    selected?.let { title ->
        DetailSheet(
            title = title,
            progress = progress,
            posters = posters,
            onDismiss = { selected = null },
        )
    }
}

@Composable
private fun navColors() = NavigationBarItemDefaults.colors(
    selectedIconColor = MaterialTheme.colorScheme.primary,
    selectedTextColor = MaterialTheme.colorScheme.primary,
    indicatorColor = MaterialTheme.colorScheme.primaryContainer,
    unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
    unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant,
)
