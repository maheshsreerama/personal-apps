plugins {
    id("com.android.application")
}

android {
    namespace = "com.maheshsreerama.interviewnotes"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.maheshsreerama.interviewnotes"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    signingConfigs {
        create("release") {
            // Personal study app: keystore is committed on purpose so CI can
            // produce an installable APK. Do not reuse for anything sensitive.
            storeFile = file("release.keystore")
            storePassword = "notesrelease"
            keyAlias = "notes"
            keyPassword = "notesrelease"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("release")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
