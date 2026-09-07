package com.mcutracker.app

import android.graphics.Color
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.mcutracker.app.ui.McuRoot
import com.mcutracker.app.ui.McuTheme

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // The app is dark whatever the system is set to, so pin light system-bar icons
        // instead of letting the default follow the device theme.
        enableEdgeToEdge(
            statusBarStyle = SystemBarStyle.dark(Color.TRANSPARENT),
            navigationBarStyle = SystemBarStyle.dark(Color.TRANSPARENT),
        )
        super.onCreate(savedInstanceState)

        val app = application as McuApp
        setContent {
            McuTheme {
                McuRoot(progress = app.progress, posters = app.posters)
            }
        }
    }
}
