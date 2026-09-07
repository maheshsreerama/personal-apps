package com.mcutracker.app.data

import androidx.compose.ui.graphics.Color

/** What kind of thing you are sitting down to watch. */
enum class Kind(val label: String) {
    MOVIE("Movie"),
    SERIES("Series"),
    SPECIAL("Special"),
}

/**
 * One block of the roadmap. [accent] is the colour the whole app uses for anything
 * belonging to this phase, so a title is identifiable by hue alone while scrolling.
 */
data class Phase(
    val id: Int,
    val name: String,
    val tagline: String,
    val saga: String,
    val accent: Color,
)

/**
 * A single entry on the watch list.
 *
 * [wikiTitle] is the exact English Wikipedia article name. Poster artwork is resolved
 * from it at runtime rather than hard-coded, so a URL can never rot in the binary.
 */
data class Title(
    val id: String,
    val order: Int,
    val name: String,
    val year: Int,
    val kind: Kind,
    val phaseId: Int,
    val minutes: Int,
    val episodes: Int,
    val blurb: String,
    val wikiTitle: String,
    val note: String? = null,
) {
    val phase: Phase get() = Catalog.phase(phaseId)

    /** "Movie · 2h 6m" or "Series · 9 episodes · 5h 50m". */
    val subtitle: String
        get() = buildString {
            append(kind.label)
            if (episodes > 0) {
                append(" · ")
                append(episodes)
                append(if (episodes == 1) " episode" else " episodes")
            }
            append(" · ")
            append(formatRuntime(minutes))
        }
}

/** 143 -> "2h 23m", 44 -> "44m". */
fun formatRuntime(minutes: Int): String {
    val h = minutes / 60
    val m = minutes % 60
    return when {
        h == 0 -> "${m}m"
        m == 0 -> "${h}h"
        else -> "${h}h ${m}m"
    }
}

/** Longer spans read better in whole hours: 4210 -> "70h". */
fun formatHours(minutes: Int): String {
    val h = minutes / 60.0
    return if (h < 10) String.format("%.1fh", h) else "${Math.round(h)}h"
}

object Catalog {

    val phases: List<Phase> = listOf(
        Phase(1, "Phase 1", "Assembling the Team", "The Infinity Saga", Color(0xFFE0A93B)),
        Phase(2, "Phase 2", "The Universe Expands", "The Infinity Saga", Color(0xFF31B5A4)),
        Phase(3, "Phase 3", "The Climax", "The Infinity Saga", Color(0xFFE62429)),
        Phase(4, "Phase 4", "Entering the Multiverse", "The Multiverse Saga", Color(0xFF9B6BFF)),
        Phase(5, "Phase 5 & Beyond", "The New Era", "The Multiverse Saga", Color(0xFF3B90F0)),
    )

    private val phasesById = phases.associateBy { it.id }

    fun phase(id: Int): Phase = phasesById.getValue(id)

    /** The whole roadmap, already in recommended viewing order. */
    val titles: List<Title> = buildTitles()

    val byId: Map<String, Title> = titles.associateBy { it.id }

    val totalMinutes: Int = titles.sumOf { it.minutes }

    fun of(phaseId: Int): List<Title> = titles.filter { it.phaseId == phaseId }
}

private fun buildTitles(): List<Title> {
    var n = 0
    fun t(
        id: String,
        name: String,
        year: Int,
        kind: Kind,
        phaseId: Int,
        minutes: Int,
        episodes: Int = 0,
        wikiTitle: String,
        blurb: String,
        note: String? = null,
    ) = Title(id, n++, name, year, kind, phaseId, minutes, episodes, blurb, wikiTitle, note)

    return listOf(
        // ---- Phase 1 : Assembling the Team ----
        t(
            "iron-man", "Iron Man", 2008, Kind.MOVIE, 1, 126,
            wikiTitle = "Iron Man (2008 film)",
            blurb = "A billionaire arms dealer builds a suit to escape captivity, then decides to stop selling weapons. The film that started all of it.",
        ),
        t(
            "incredible-hulk", "The Incredible Hulk", 2008, Kind.MOVIE, 1, 112,
            wikiTitle = "The Incredible Hulk (film)",
            blurb = "Bruce Banner hides in Brazil hunting a cure while the army hunts him. The odd one out, but the post-credits scene matters.",
        ),
        t(
            "iron-man-2", "Iron Man 2", 2010, Kind.MOVIE, 1, 124,
            wikiTitle = "Iron Man 2",
            blurb = "Tony is dying from the thing keeping him alive, and a Russian physicist with a grudge shows up. Introduces Black Widow and War Machine.",
        ),
        t(
            "thor", "Thor", 2011, Kind.MOVIE, 1, 115,
            wikiTitle = "Thor (film)",
            blurb = "An arrogant prince is stripped of his hammer and exiled to New Mexico. Opens the cosmic side of the universe and gives you Loki.",
        ),
        t(
            "captain-america-first-avenger", "Captain America: The First Avenger", 2011, Kind.MOVIE, 1, 124,
            wikiTitle = "Captain America: The First Avenger",
            blurb = "A World War II origin story about a scrawny kid who refuses to back down. Chronologically the earliest chapter of the saga.",
        ),
        t(
            "avengers", "The Avengers", 2012, Kind.MOVIE, 1, 143,
            wikiTitle = "The Avengers (2012 film)",
            blurb = "Six heroes who cannot stand each other are forced into a team over New York. The payoff Phase 1 was quietly building to.",
        ),

        // ---- Phase 2 : The Universe Expands ----
        t(
            "iron-man-3", "Iron Man 3", 2013, Kind.MOVIE, 2, 130,
            wikiTitle = "Iron Man 3",
            blurb = "Post-New York panic attacks, a house blown into the sea, and a villain twist people still argue about.",
        ),
        t(
            "thor-dark-world", "Thor: The Dark World", 2013, Kind.MOVIE, 2, 112,
            wikiTitle = "Thor: The Dark World",
            blurb = "Dark elves, the Aether, and the best Loki–Thor scenes so far. Sets up an Infinity Stone you will see again.",
        ),
        t(
            "winter-soldier", "Captain America: The Winter Soldier", 2014, Kind.MOVIE, 2, 136,
            wikiTitle = "Captain America: The Winter Soldier",
            blurb = "A 70s-style political thriller that tears S.H.I.E.L.D. apart from the inside. Widely rated one of the best in the run.",
        ),
        t(
            "guardians", "Guardians of the Galaxy", 2014, Kind.MOVIE, 2, 121,
            wikiTitle = "Guardians of the Galaxy (film)",
            blurb = "A thief, an assassin, a literal tree and a raccoon with a gun. Cuts to deep space and never asks permission.",
        ),
        t(
            "age-of-ultron", "Avengers: Age of Ultron", 2015, Kind.MOVIE, 2, 141,
            wikiTitle = "Avengers: Age of Ultron",
            blurb = "Tony builds a peacekeeping AI that immediately decides peace means no people. Vision, Wanda and Pietro arrive.",
        ),
        t(
            "ant-man", "Ant-Man", 2015, Kind.MOVIE, 2, 117,
            wikiTitle = "Ant-Man (film)",
            blurb = "A small-scale heist comedy after two universe-ending films, and a palate cleanser before Phase 3 gets heavy.",
        ),

        // ---- Phase 3 : The Climax ----
        t(
            "civil-war", "Captain America: Civil War", 2016, Kind.MOVIE, 3, 147,
            wikiTitle = "Captain America: Civil War",
            blurb = "Oversight splits the team down the middle. Effectively Avengers 2.5, and it introduces Black Panther and this Spider-Man.",
        ),
        t(
            "doctor-strange", "Doctor Strange", 2016, Kind.MOVIE, 3, 115,
            wikiTitle = "Doctor Strange (2016 film)",
            blurb = "A surgeon loses his hands and finds sorcery. Opens the magic and multiverse corner of the map.",
        ),
        t(
            "guardians-2", "Guardians of the Galaxy Vol. 2", 2017, Kind.MOVIE, 3, 136,
            wikiTitle = "Guardians of the Galaxy Vol. 2",
            blurb = "Peter meets his father and the film turns out to be about the one who raised him instead. Bring tissues.",
        ),
        t(
            "spider-man-homecoming", "Spider-Man: Homecoming", 2017, Kind.MOVIE, 3, 133,
            wikiTitle = "Spider-Man: Homecoming",
            blurb = "A high-school movie with a genuinely great villain. Peter wants to be an Avenger; Tony wants him to do his homework.",
        ),
        t(
            "thor-ragnarok", "Thor: Ragnarok", 2017, Kind.MOVIE, 3, 130,
            wikiTitle = "Thor: Ragnarok",
            blurb = "The series hands Thor to a comedian and it works completely. Neon, synths, Hela, and a very changed Asgard.",
        ),
        t(
            "black-panther", "Black Panther", 2018, Kind.MOVIE, 3, 134,
            wikiTitle = "Black Panther (film)",
            blurb = "T'Challa takes the throne of Wakanda and inherits his father's mistakes. Killmonger is the villain the saga keeps chasing.",
        ),
        t(
            "infinity-war", "Avengers: Infinity War", 2018, Kind.MOVIE, 3, 149,
            wikiTitle = "Avengers: Infinity War",
            blurb = "Ten years of build-up, and the villain wins. Do not watch this one out of order.",
        ),
        t(
            "ant-man-and-the-wasp", "Ant-Man and the Wasp", 2018, Kind.MOVIE, 3, 118,
            wikiTitle = "Ant-Man and the Wasp",
            blurb = "Runs alongside Infinity War, which is exactly why its post-credits scene lands the way it does.",
        ),
        t(
            "captain-marvel", "Captain Marvel", 2019, Kind.MOVIE, 3, 123,
            wikiTitle = "Captain Marvel (film)",
            blurb = "A 1995 flashback: Carol Danvers, a young Nick Fury with both eyes, and the pager from the Infinity War credits.",
            note = "Set in 1995, but watch it here — it answers the Infinity War post-credits pager right before Endgame picks it up.",
        ),
        t(
            "endgame", "Avengers: Endgame", 2019, Kind.MOVIE, 3, 181,
            wikiTitle = "Avengers: Endgame",
            blurb = "Three hours of consequences and the finale of everything from Iron Man onward. The saga's full stop.",
        ),
        t(
            "far-from-home", "Spider-Man: Far From Home", 2019, Kind.MOVIE, 3, 129,
            wikiTitle = "Spider-Man: Far From Home",
            blurb = "The epilogue to the Infinity Saga: a school trip through a world learning to live after Endgame.",
        ),

        // ---- Phase 4 : Entering the Multiverse ----
        t(
            "wandavision", "WandaVision", 2021, Kind.SERIES, 4, 350, episodes = 9,
            wikiTitle = "WandaVision",
            blurb = "Grief disguised as a sitcom, decade by decade. Start Phase 4 here — it is the direct emotional sequel to Endgame.",
        ),
        t(
            "falcon-winter-soldier", "The Falcon and the Winter Soldier", 2021, Kind.SERIES, 4, 300, episodes = 6,
            wikiTitle = "The Falcon and the Winter Soldier",
            blurb = "Sam and Bucky argue their way across the question of who gets to carry the shield.",
        ),
        t(
            "loki-s1", "Loki: Season 1", 2021, Kind.SERIES, 4, 290, episodes = 6,
            wikiTitle = "Loki (TV series)",
            blurb = "The 2012 Loki is arrested by the time police. Introduces the TVA and the multiverse the whole saga now runs on.",
            note = "Essential viewing — nearly everything after this depends on how season 1 ends.",
        ),
        t(
            "black-widow", "Black Widow", 2021, Kind.MOVIE, 4, 134,
            wikiTitle = "Black Widow (2021 film)",
            blurb = "A prequel set between Civil War and Infinity War, giving Natasha the send-off Endgame did not have room for.",
        ),
        t(
            "shang-chi", "Shang-Chi and the Legend of the Ten Rings", 2021, Kind.MOVIE, 4, 132,
            wikiTitle = "Shang-Chi and the Legend of the Ten Rings",
            blurb = "The best hand-to-hand fighting in the series, wrapped around a father-and-son story.",
        ),
        t(
            "eternals", "Eternals", 2021, Kind.MOVIE, 4, 156,
            wikiTitle = "Eternals (film)",
            blurb = "Immortals who have quietly watched human history since 5000 BC finally take a side. Divisive, and shot beautifully.",
        ),
        t(
            "hawkeye", "Hawkeye", 2021, Kind.SERIES, 4, 250, episodes = 6,
            wikiTitle = "Hawkeye (miniseries)",
            blurb = "A Christmas show about Clint wanting to go home, and Kate Bishop refusing to let him.",
        ),
        t(
            "no-way-home", "Spider-Man: No Way Home", 2021, Kind.MOVIE, 4, 148,
            wikiTitle = "Spider-Man: No Way Home",
            blurb = "A botched memory spell tears the multiverse open. Watch Doctor Strange and Loki season 1 first.",
        ),
        t(
            "moon-knight", "Moon Knight", 2022, Kind.SERIES, 4, 260, episodes = 6,
            wikiTitle = "Moon Knight (miniseries)",
            blurb = "Egyptian gods, dissociative identity, and almost no ties to the rest of the map. Very easy entry point.",
        ),
        t(
            "multiverse-of-madness", "Doctor Strange in the Multiverse of Madness", 2022, Kind.MOVIE, 4, 126,
            wikiTitle = "Doctor Strange in the Multiverse of Madness",
            blurb = "A horror-tinted trip across realities. Leans hard on WandaVision — do not skip that one before this.",
        ),
        t(
            "ms-marvel", "Ms. Marvel", 2022, Kind.SERIES, 4, 260, episodes = 6,
            wikiTitle = "Ms. Marvel (miniseries)",
            blurb = "A teenage superfan from Jersey City gets powers of her own. Bright, funny, and it feeds straight into The Marvels.",
        ),
        t(
            "love-and-thunder", "Thor: Love and Thunder", 2022, Kind.MOVIE, 4, 119,
            wikiTitle = "Thor: Love and Thunder",
            blurb = "Jane returns wielding Mjolnir, chased by a god butcher. Louder and sillier than Ragnarok.",
        ),
        t(
            "she-hulk", "She-Hulk: Attorney at Law", 2022, Kind.SERIES, 4, 290, episodes = 9,
            wikiTitle = "She-Hulk: Attorney at Law",
            blurb = "A legal half-hour comedy that keeps breaking the fourth wall, plus the return of a few familiar faces.",
        ),
        t(
            "gotg-holiday-special", "The Guardians of the Galaxy Holiday Special", 2022, Kind.SPECIAL, 4, 44,
            wikiTitle = "The Guardians of the Galaxy Holiday Special",
            blurb = "Forty minutes of Drax and Mantis kidnapping Kevin Bacon. Short, and it does set up Vol. 3.",
        ),
        t(
            "wakanda-forever", "Black Panther: Wakanda Forever", 2022, Kind.MOVIE, 4, 161,
            wikiTitle = "Black Panther: Wakanda Forever",
            blurb = "A nation and a cast grieving in real time, and the arrival of Namor. Closes Phase 4.",
        ),

        // ---- Phase 5 & Beyond : The New Era ----
        t(
            "quantumania", "Ant-Man and the Wasp: Quantumania", 2023, Kind.MOVIE, 5, 124,
            wikiTitle = "Ant-Man and the Wasp: Quantumania",
            blurb = "The family falls into the Quantum Realm and meets Kang properly. Opens Phase 5 and the next big threat.",
        ),
        t(
            "guardians-3", "Guardians of the Galaxy Vol. 3", 2023, Kind.MOVIE, 5, 150,
            wikiTitle = "Guardians of the Galaxy Vol. 3",
            blurb = "Rocket's backstory, and the send-off for this team. Hard to watch in places, and probably the best of Phase 5.",
        ),
        t(
            "secret-invasion", "Secret Invasion", 2023, Kind.SERIES, 5, 300, episodes = 6,
            wikiTitle = "Secret Invasion (miniseries)",
            blurb = "A paranoid spy thriller: Skrulls have been hiding among us, and Fury is out of favours.",
        ),
        t(
            "the-marvels", "The Marvels", 2023, Kind.MOVIE, 5, 105,
            wikiTitle = "The Marvels",
            blurb = "Carol, Kamala and Monica keep swapping places mid-fight. Watch Ms. Marvel and WandaVision first.",
        ),
        t(
            "loki-s2", "Loki: Season 2", 2023, Kind.SERIES, 5, 290, episodes = 6,
            wikiTitle = "Loki season 2",
            blurb = "The TVA comes apart and Loki has to decide what he is willing to carry. The most consequential thing in Phase 5.",
        ),
        t(
            "echo", "Echo", 2024, Kind.SERIES, 5, 220, episodes = 5,
            wikiTitle = "Echo (miniseries)",
            blurb = "Maya Lopez goes home to Oklahoma with Kingpin behind her. Darker and more self-contained than the rest.",
        ),
        t(
            "deadpool-and-wolverine", "Deadpool & Wolverine", 2024, Kind.MOVIE, 5, 128,
            wikiTitle = "Deadpool & Wolverine",
            blurb = "The TVA drags Wade into the main timeline. Runs on Loki's rules and a deep pile of cameos.",
        ),
        t(
            "agatha-all-along", "Agatha All Along", 2024, Kind.SERIES, 5, 320, episodes = 9,
            wikiTitle = "Agatha All Along (TV series)",
            blurb = "The WandaVision scene-stealer gets her own witchy road trip down a very cursed road.",
        ),
    )
}
