package com.mcutracker.app.ui

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

/**
 * One palette, always dark. A watch-list for films is a cinema-lights-down kind of app,
 * so it does not follow the system light theme.
 */
private val CinemaDark = darkColorScheme(
    primary = Color(0xFFE62429),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFF48090C),
    onPrimaryContainer = Color(0xFFFFDCDC),
    secondary = Color(0xFFE0A93B),
    onSecondary = Color(0xFF231700),
    secondaryContainer = Color(0xFF3A2A05),
    onSecondaryContainer = Color(0xFFFFE3AC),
    background = Color(0xFF06060A),
    onBackground = Color(0xFFEDEDF3),
    surface = Color(0xFF0E0E15),
    onSurface = Color(0xFFEDEDF3),
    surfaceVariant = Color(0xFF1A1A26),
    onSurfaceVariant = Color(0xFF9C9CB2),
    surfaceContainer = Color(0xFF13131C),
    surfaceContainerHigh = Color(0xFF1B1B26),
    outline = Color(0xFF323243),
    outlineVariant = Color(0xFF21212D),
    error = Color(0xFFFF6B6B),
    onError = Color(0xFF2A0000),
)

@Composable
fun McuTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = CinemaDark, content = content)
}
