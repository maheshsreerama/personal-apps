package com.fourcars.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Canvas;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Shader;
import android.graphics.Typeface;

import java.util.Random;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicIntegerArray;

/**
 * World state, rules and rendering for a four-road run.
 *
 * <p>Threading: {@link #update} and {@link #draw} run on the render thread only. Touches arrive on
 * the UI thread and are handed over as atomic counters, so no lock is ever taken on the hot path.
 *
 * <p>Rules (the two-car classic, doubled): four roads, two lanes each, one car per road. Tap a
 * quarter of the screen to flip that car between its lanes. Collect every circle, hit no square —
 * letting a circle slip past ends the run just as a crash does.
 */
class Game {

    // ---------------------------------------------------------------- tuning

    static final int ROADS = 4;
    private static final int MAX_ITEMS = 64;
    private static final int MAX_PARTICLES = 96;

    /** Score at which the ramp tops out. */
    private static final float DIFFICULTY_SCORE = 150f;
    /** Fraction of screen heights travelled per second, at the start and at full difficulty. */
    private static final float SPEED_START = 0.55f;
    private static final float SPEED_END = 1.05f;
    /** Gap between spawn rows on one road, as a fraction of screen height. */
    private static final float GAP_START = 0.74f;
    private static final float GAP_END = 0.50f;
    /** Rows that spawn nothing, to keep a road from being a constant drum roll. */
    private static final float EMPTY_ROW_CHANCE = 0.30f;
    /** How hard a car snaps to its lane. Higher is twitchier; this settles in ~55 ms. */
    private static final float CAR_SNAP = 26f;

    private static final int[] CAR_COLORS = {0xFFFF4757, 0xFF2E86FF, 0xFF2ED573, 0xFFFFC93C};
    private static final int BG_TOP = 0xFF141A27;
    private static final int BG_BOTTOM = 0xFF0A0D14;
    private static final int ROAD_COLOR = 0xFF1B2130;
    private static final int DASH_COLOR = 0x33FFFFFF;

    private static final int MENU = 0, PLAYING = 1, PAUSED = 2, OVER = 3;
    private static final int REASON_CRASH = 0, REASON_MISS = 1;

    // ---------------------------------------------------------------- state

    private final SharedPreferences prefs;
    private final Sfx sfx;
    private final Random rnd = new Random();

    private volatile int state = MENU;
    private int overReason;
    private int score;
    private int best;
    private boolean newBest;
    // Cached so the hot path never builds a string: both change only on a scoring event.
    private String scoreText = "0";
    private String bestText;

    private final int[] carLane = new int[ROADS];
    private final float[] carX = new float[ROADS];
    private final float[] spawnDist = new float[ROADS];
    private final float[] gapNeed = new float[ROADS];

    private final Item[] items = new Item[MAX_ITEMS];
    private final Particle[] particles = new Particle[MAX_PARTICLES];

    private float time;          // ever-increasing, drives idle animation
    private float overTime;      // seconds since the run ended, gates the retry tap
    private float dashOffset;
    private float shake;
    private volatile boolean soundOn;

    // ---------------------------------------------------------------- input hand-off

    private final AtomicIntegerArray taps = new AtomicIntegerArray(ROADS);
    private final AtomicBoolean actionPending = new AtomicBoolean(false);

    // ---------------------------------------------------------------- layout

    private volatile int pendingW, pendingH;
    private volatile boolean layoutDirty;

    private float w, h;
    private float roadW, laneW, roadGap, sideMargin;
    private final float[] roadLeft = new float[ROADS];
    private float carW, carH, carTop;
    private float circleR, squareHalf;
    private float dashH, dashGap, dashW;

    /** Copies of the few layout values the UI thread needs when a touch lands. */
    private volatile float touchW;
    private volatile float sbL, sbT, sbR, sbB;

    // ---------------------------------------------------------------- paint

    private final Paint fill = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint stroke = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint text = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint bg = new Paint();
    private final RectF r1 = new RectF();
    private final RectF soundBtn = new RectF();

    Game(Context context) {
        prefs = context.getSharedPreferences("four-cars", Context.MODE_PRIVATE);
        best = prefs.getInt("best", 0);
        bestText = "BEST " + best;
        soundOn = prefs.getBoolean("sound", true);
        sfx = new Sfx();
        for (int i = 0; i < MAX_ITEMS; i++) items[i] = new Item();
        for (int i = 0; i < MAX_PARTICLES; i++) particles[i] = new Particle();
        stroke.setStyle(Paint.Style.STROKE);
        text.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        text.setTextAlign(Paint.Align.CENTER);
    }

    // ---------------------------------------------------------------- layout

    void resize(int width, int height) {
        pendingW = width;
        pendingH = height;
        layoutDirty = true;
    }

    private void applyLayout() {
        layoutDirty = false;
        w = pendingW;
        h = pendingH;
        if (w <= 0 || h <= 0) return;

        sideMargin = w * 0.022f;
        roadGap = w * 0.018f;
        roadW = (w - 2f * sideMargin - 3f * roadGap) / ROADS;
        laneW = roadW / 2f;
        for (int r = 0; r < ROADS; r++) roadLeft[r] = sideMargin + r * (roadW + roadGap);

        carW = laneW * 0.62f;
        carH = carW * 1.70f;
        carTop = h * 0.775f;

        circleR = laneW * 0.24f;
        squareHalf = laneW * 0.21f;

        dashH = h * 0.030f;
        dashGap = h * 0.026f;
        dashW = Math.max(2f, w * 0.004f);

        float btnW = w * 0.34f, btnH = h * 0.045f;
        soundBtn.set(w - sideMargin - btnW, h * 0.035f, w - sideMargin, h * 0.035f + btnH);
        sbL = soundBtn.left;
        sbT = soundBtn.top;
        sbR = soundBtn.right;
        sbB = soundBtn.bottom;
        touchW = w;

        bg.setShader(new LinearGradient(0, 0, 0, h, BG_TOP, BG_BOTTOM, Shader.TileMode.CLAMP));

        for (int r = 0; r < ROADS; r++) carX[r] = laneCenter(r, carLane[r]);
    }

    private float laneCenter(int road, int lane) {
        return roadLeft[road] + laneW * (0.5f + lane);
    }

    // ---------------------------------------------------------------- input

    /** Called on the UI thread for every finger that goes down. */
    void onTap(float x, float y) {
        float width = touchW;
        if (width <= 0) return;
        if (state != PLAYING && x >= sbL && x <= sbR && y >= sbT && y <= sbB) {
            soundOn = !soundOn;
            prefs.edit().putBoolean("sound", soundOn).apply();
            return;
        }
        int road = (int) (x / (width / ROADS));
        if (road < 0) road = 0;
        if (road >= ROADS) road = ROADS - 1;
        taps.incrementAndGet(road);
        actionPending.set(true);
    }

    /** Called on the UI thread when the app is backgrounded. */
    void pause() {
        if (state == PLAYING) state = PAUSED;
    }

    /** @return true if the back press was consumed. */
    boolean onBack() {
        if (state == PLAYING) {
            state = PAUSED;
            return true;
        }
        if (state == OVER) {
            state = MENU;
            return true;
        }
        return false;
    }

    private void consumeInput() {
        boolean act = actionPending.getAndSet(false);
        if (state == PLAYING) {
            for (int r = 0; r < ROADS; r++) {
                int n = taps.getAndSet(r, 0);
                if ((n & 1) != 0) {
                    carLane[r] ^= 1;
                    if (soundOn) sfx.blip();
                }
            }
            return;
        }
        // Outside a run a tap is a menu press, never a lane switch.
        for (int r = 0; r < ROADS; r++) taps.set(r, 0);
        if (!act) return;
        if (state == MENU) startRun();
        else if (state == PAUSED) state = PLAYING;
        else if (state == OVER && overTime > 0.7f) startRun();
    }

    // ---------------------------------------------------------------- run control

    private void startRun() {
        score = 0;
        scoreText = "0";
        newBest = false;
        shake = 0f;
        overTime = 0f;
        for (int i = 0; i < MAX_ITEMS; i++) items[i].active = false;
        for (int i = 0; i < MAX_PARTICLES; i++) particles[i].life = 0f;
        for (int r = 0; r < ROADS; r++) {
            carLane[r] = 0;
            carX[r] = laneCenter(r, 0);
            // Stagger the first row per road so the run opens with a breath, not a wall.
            spawnDist[r] = -(0.45f + rnd.nextFloat() * 0.55f) * h;
            gapNeed[r] = rollGap(0f);
        }
        state = PLAYING;
    }

    private void endRun(int reason) {
        overReason = reason;
        state = OVER;
        overTime = 0f;
        shake = 1f;
        if (score > best) {
            best = score;
            bestText = "BEST " + best;
            newBest = true;
            prefs.edit().putInt("best", best).apply();
        }
        if (soundOn) sfx.crash();
    }

    // ---------------------------------------------------------------- update

    void update(float dt) {
        if (layoutDirty) applyLayout();
        if (w <= 0) return;

        time += dt;
        consumeInput();

        float speed = h * SPEED_START;
        if (state == PLAYING) {
            speed = h * lerp(SPEED_START, SPEED_END, difficulty());
            dashOffset += speed * dt;
            stepWorld(dt, speed);
        } else if (state == MENU) {
            dashOffset += speed * 0.35f * dt;   // slow drift behind the title
        } else if (state == OVER) {
            overTime += dt;
        }

        for (int r = 0; r < ROADS; r++) {
            float target = laneCenter(r, carLane[r]);
            carX[r] += (target - carX[r]) * Math.min(1f, dt * CAR_SNAP);
        }

        if (shake > 0f) shake = Math.max(0f, shake - dt * 2.4f);
        for (int i = 0; i < MAX_PARTICLES; i++) {
            Particle p = particles[i];
            if (p.life <= 0f) continue;
            p.life -= dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += h * 1.4f * dt;
        }
    }

    private float difficulty() {
        float d = score / DIFFICULTY_SCORE;
        return d > 1f ? 1f : d;
    }

    private void stepWorld(float dt, float speed) {
        float carBandTop = carTop + carH * 0.12f;
        float carBandBottom = carTop + carH * 0.88f;

        for (int i = 0; i < MAX_ITEMS; i++) {
            Item it = items[i];
            if (!it.active) continue;
            it.y += speed * dt;

            float half = it.square ? squareHalf : circleR;
            int r = it.road;
            float ix = laneCenter(r, it.lane);
            float dx = Math.abs(ix - carX[r]);

            boolean overlapY = it.y + half > carBandTop && it.y - half < carBandBottom;
            // Generous on pickups, forgiving on hazards: clipping a circle mid-switch still
            // counts, clipping a square's corner does not. Both stay well under one lane width,
            // so the neighbouring lane is never reached from a resting position.
            boolean overlapX = it.square
                    ? dx < (carW * 0.5f + squareHalf) * 0.72f
                    : dx < carW * 0.5f + circleR * 1.15f;

            if (overlapY && overlapX) {
                if (it.square) {
                    burst(ix, it.y, CAR_COLORS[r], 18, 1.0f);
                    it.active = false;
                    endRun(REASON_CRASH);
                    return;
                }
                it.active = false;
                score++;
                scoreText = Integer.toString(score);
                burst(ix, it.y, CAR_COLORS[r], 9, 0.55f);
                if (soundOn) sfx.collect();
                continue;
            }

            // A circle whose top edge has cleared the car can no longer be collected.
            if (!it.square && it.y - half > carTop + carH) {
                it.active = false;
                burst(ix, carTop + carH * 0.5f, CAR_COLORS[r], 14, 0.8f);
                endRun(REASON_MISS);
                return;
            }

            if (it.y - half > h) it.active = false;
        }

        float d = difficulty();
        for (int r = 0; r < ROADS; r++) {
            spawnDist[r] += speed * dt;
            if (spawnDist[r] >= gapNeed[r]) {
                spawnDist[r] -= gapNeed[r];
                gapNeed[r] = rollGap(d);
                spawnRow(r);
            }
        }
    }

    private float rollGap(float d) {
        return lerp(GAP_START, GAP_END, d) * h * (0.88f + rnd.nextFloat() * 0.24f);
    }

    /**
     * Spawns one row on a road. Every row is guaranteed solvable: never two squares (nowhere to
     * go) and never two circles (one would have to be missed).
     */
    private void spawnRow(int road) {
        if (rnd.nextFloat() < EMPTY_ROW_CHANCE) return;
        float y = -squareHalf * 2f;
        int lane = rnd.nextInt(2);
        float roll = rnd.nextFloat();
        if (roll < 0.40f) {
            add(road, lane, false, y);                  // a circle to take
        } else if (roll < 0.74f) {
            add(road, lane, true, y);                   // a square to dodge
        } else {
            add(road, lane, true, y);                   // square here...
            add(road, 1 - lane, false, y);              // ...circle there: forced switch
        }
    }

    private void add(int road, int lane, boolean square, float y) {
        for (int i = 0; i < MAX_ITEMS; i++) {
            Item it = items[i];
            if (it.active) continue;
            it.active = true;
            it.road = road;
            it.lane = lane;
            it.square = square;
            it.y = y;
            return;
        }
    }

    private void burst(float x, float y, int color, int count, float power) {
        float base = h * 0.35f * power;
        for (int n = 0; n < count; n++) {
            for (int i = 0; i < MAX_PARTICLES; i++) {
                Particle p = particles[i];
                if (p.life > 0f) continue;
                double a = rnd.nextDouble() * Math.PI * 2;
                float sp = base * (0.35f + rnd.nextFloat());
                p.x = x;
                p.y = y;
                p.vx = (float) Math.cos(a) * sp;
                p.vy = (float) Math.sin(a) * sp;
                p.maxLife = 0.35f + rnd.nextFloat() * 0.35f;
                p.life = p.maxLife;
                p.size = laneW * (0.05f + rnd.nextFloat() * 0.06f);
                p.color = color;
                break;
            }
        }
    }

    // ---------------------------------------------------------------- draw

    void draw(Canvas canvas) {
        if (w <= 0) {
            canvas.drawColor(BG_BOTTOM);
            return;
        }
        canvas.drawRect(0, 0, w, h, bg);

        canvas.save();
        if (shake > 0f) {
            float amp = shake * shake * w * 0.02f;
            canvas.translate((rnd.nextFloat() - 0.5f) * amp, (rnd.nextFloat() - 0.5f) * amp);
        }
        drawRoads(canvas);
        drawItems(canvas);
        drawCars(canvas);
        drawParticles(canvas);
        canvas.restore();

        if (state == PLAYING) drawHud(canvas);
        else drawOverlay(canvas);
    }

    private void drawRoads(Canvas canvas) {
        float period = dashH + dashGap;
        float offset = dashOffset % period;
        for (int r = 0; r < ROADS; r++) {
            fill.setColor(ROAD_COLOR);
            r1.set(roadLeft[r], -roadW, roadLeft[r] + roadW, h + roadW);
            canvas.drawRoundRect(r1, roadW * 0.18f, roadW * 0.18f, fill);

            fill.setColor(DASH_COLOR);
            float cx = roadLeft[r] + roadW * 0.5f;
            for (float y = offset - period; y < h + period; y += period) {
                r1.set(cx - dashW * 0.5f, y, cx + dashW * 0.5f, y + dashH);
                canvas.drawRoundRect(r1, dashW * 0.5f, dashW * 0.5f, fill);
            }
        }
    }

    private void drawItems(Canvas canvas) {
        for (int i = 0; i < MAX_ITEMS; i++) {
            Item it = items[i];
            if (!it.active) continue;
            int color = CAR_COLORS[it.road];
            float x = laneCenter(it.road, it.lane);
            if (it.square) {
                fill.setColor(color);
                r1.set(x - squareHalf, it.y - squareHalf, x + squareHalf, it.y + squareHalf);
                canvas.drawRoundRect(r1, squareHalf * 0.35f, squareHalf * 0.35f, fill);
            } else {
                fill.setColor(color & 0x33FFFFFF);
                canvas.drawCircle(x, it.y, circleR, fill);
                stroke.setColor(color);
                stroke.setStrokeWidth(circleR * 0.44f);
                canvas.drawCircle(x, it.y, circleR * 0.80f, stroke);
            }
        }
    }

    private void drawCars(Canvas canvas) {
        for (int r = 0; r < ROADS; r++) {
            float x = carX[r];
            float target = laneCenter(r, carLane[r]);
            float tilt = clamp((target - x) / laneW, -1f, 1f) * 13f;   // lean into the switch
            int color = CAR_COLORS[r];

            canvas.save();
            canvas.rotate(tilt, x, carTop + carH * 0.5f);

            fill.setColor(color & 0x30FFFFFF);
            r1.set(x - carW * 0.68f, carTop - carH * 0.06f, x + carW * 0.68f, carTop + carH * 1.06f);
            canvas.drawRoundRect(r1, carW * 0.42f, carW * 0.42f, fill);

            fill.setColor(color);
            r1.set(x - carW * 0.5f, carTop, x + carW * 0.5f, carTop + carH);
            canvas.drawRoundRect(r1, carW * 0.28f, carW * 0.28f, fill);

            fill.setColor(0x59FFFFFF);
            r1.set(x - carW * 0.30f, carTop + carH * 0.16f, x + carW * 0.30f, carTop + carH * 0.40f);
            canvas.drawRoundRect(r1, carW * 0.12f, carW * 0.12f, fill);

            fill.setColor(0x26000000);
            r1.set(x - carW * 0.30f, carTop + carH * 0.60f, x + carW * 0.30f, carTop + carH * 0.86f);
            canvas.drawRoundRect(r1, carW * 0.12f, carW * 0.12f, fill);

            canvas.restore();
        }
    }

    private void drawParticles(Canvas canvas) {
        for (int i = 0; i < MAX_PARTICLES; i++) {
            Particle p = particles[i];
            if (p.life <= 0f) continue;
            float k = p.life / p.maxLife;
            fill.setColor((p.color & 0x00FFFFFF) | ((int) (255 * k) << 24));
            canvas.drawCircle(p.x, p.y, p.size * (0.4f + k * 0.6f), fill);
        }
    }

    private void drawHud(Canvas canvas) {
        text.setColor(0xF2FFFFFF);
        text.setTextSize(h * 0.075f);
        canvas.drawText(scoreText, w * 0.5f, h * 0.115f, text);
        text.setColor(0x66FFFFFF);
        text.setTextSize(h * 0.021f);
        canvas.drawText(bestText, w * 0.5f, h * 0.148f, text);
    }

    private void drawOverlay(Canvas canvas) {
        fill.setColor(0xCC080B12);
        canvas.drawRect(0, 0, w, h, fill);

        if (state == MENU) {
            text.setColor(0xFFFFFFFF);
            text.setTextSize(h * 0.070f);
            canvas.drawText("FOUR CARS", w * 0.5f, h * 0.30f, text);

            text.setColor(0x99FFFFFF);
            text.setTextSize(h * 0.022f);
            canvas.drawText("Four roads. Four cars. Two lanes each.", w * 0.5f, h * 0.35f, text);
            canvas.drawText("Take every circle. Dodge every square.", w * 0.5f, h * 0.385f, text);
            canvas.drawText("Miss one circle and the run is over.", w * 0.5f, h * 0.42f, text);

            drawTapZones(canvas);

            text.setColor(0x66FFFFFF);
            text.setTextSize(h * 0.020f);
            canvas.drawText(bestText, w * 0.5f, h * 0.63f, text);
            drawPrompt(canvas, "TAP TO START", h * 0.70f);
        } else if (state == PAUSED) {
            text.setColor(0xFFFFFFFF);
            text.setTextSize(h * 0.055f);
            canvas.drawText("PAUSED", w * 0.5f, h * 0.44f, text);
            text.setColor(0x99FFFFFF);
            text.setTextSize(h * 0.024f);
            canvas.drawText("SCORE " + score, w * 0.5f, h * 0.49f, text);
            drawPrompt(canvas, "TAP TO RESUME", h * 0.58f);
        } else {
            text.setColor(overReason == REASON_CRASH ? 0xFFFF4757 : 0xFFFFC93C);
            text.setTextSize(h * 0.055f);
            canvas.drawText(overReason == REASON_CRASH ? "CRASHED" : "MISSED A CIRCLE",
                    w * 0.5f, h * 0.36f, text);

            text.setColor(0xFFFFFFFF);
            text.setTextSize(h * 0.095f);
            canvas.drawText(scoreText, w * 0.5f, h * 0.48f, text);

            text.setColor(newBest ? 0xFF2ED573 : 0x88FFFFFF);
            text.setTextSize(h * 0.024f);
            canvas.drawText(newBest ? "NEW BEST!" : bestText, w * 0.5f, h * 0.53f, text);

            if (overTime > 0.7f) drawPrompt(canvas, "TAP TO RETRY", h * 0.66f);
        }

        drawSoundButton(canvas);
    }

    private void drawTapZones(Canvas canvas) {
        float top = h * 0.50f, bottom = h * 0.56f;
        float zoneW = w / ROADS;
        for (int r = 0; r < ROADS; r++) {
            fill.setColor((CAR_COLORS[r] & 0x00FFFFFF) | 0x33000000);
            r1.set(r * zoneW + w * 0.012f, top, (r + 1) * zoneW - w * 0.012f, bottom);
            canvas.drawRoundRect(r1, h * 0.012f, h * 0.012f, fill);
            text.setColor(CAR_COLORS[r]);
            text.setTextSize(h * 0.020f);
            canvas.drawText("TAP", r1.centerX(), r1.centerY() + h * 0.007f, text);
        }
        text.setColor(0x77FFFFFF);
        text.setTextSize(h * 0.019f);
        canvas.drawText("tap a quarter of the screen to switch that car",
                w * 0.5f, bottom + h * 0.040f, text);
    }

    private void drawPrompt(Canvas canvas, String label, float y) {
        float pulse = 0.55f + 0.45f * (float) Math.sin(time * 3.4f);
        text.setColor(((int) (140 + 115 * pulse) << 24) | 0x00FFFFFF);
        text.setTextSize(h * 0.030f);
        canvas.drawText(label, w * 0.5f, y, text);
    }

    private void drawSoundButton(Canvas canvas) {
        fill.setColor(0x22FFFFFF);
        canvas.drawRoundRect(soundBtn, soundBtn.height() * 0.5f, soundBtn.height() * 0.5f, fill);
        text.setColor(soundOn ? 0xCCFFFFFF : 0x66FFFFFF);
        text.setTextSize(soundBtn.height() * 0.42f);
        canvas.drawText(soundOn ? "SOUND ON" : "SOUND OFF",
                soundBtn.centerX(), soundBtn.centerY() + soundBtn.height() * 0.15f, text);
    }

    // ---------------------------------------------------------------- helpers

    private static float lerp(float a, float b, float t) {
        return a + (b - a) * t;
    }

    private static float clamp(float v, float lo, float hi) {
        return v < lo ? lo : (v > hi ? hi : v);
    }

    private static final class Item {
        boolean active;
        boolean square;
        int road;
        int lane;
        float y;
    }

    private static final class Particle {
        float x, y, vx, vy, life, maxLife, size;
        int color;
    }
}
