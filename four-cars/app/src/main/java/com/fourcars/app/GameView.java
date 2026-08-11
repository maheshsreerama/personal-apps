package com.fourcars.app;

import android.content.Context;
import android.graphics.Canvas;
import android.os.Build;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

/**
 * Owns the render thread and the raw touch stream.
 *
 * <p>The loop is deliberately plain: lock a hardware canvas, step the world by the real elapsed
 * time, draw, post. {@code unlockCanvasAndPost} blocks on vsync, so this self-paces to the display
 * refresh rate without a timer, and taps are applied to the very next frame.
 */
public class GameView extends SurfaceView implements SurfaceHolder.Callback, Runnable {

    /** Never step by more than this; a stall must not teleport obstacles past the cars. */
    private static final float MAX_FRAME = 1f / 30f;
    /** Sub-steps stay small so collisions can't be tunnelled through at top speed. */
    private static final float MAX_STEP = 1f / 240f;

    private final Game game;
    private Thread thread;
    private volatile boolean running;

    public GameView(Context context) {
        super(context);
        game = new Game(context);
        getHolder().addCallback(this);
        setFocusable(true);
    }

    // ---------------------------------------------------------------- lifecycle

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        running = true;
        thread = new Thread(this, "four-cars-render");
        thread.start();
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
        game.resize(width, height);
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        running = false;
        while (thread != null) {
            try {
                thread.join();
                thread = null;
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    /** Called from the Activity: a backgrounded run is paused, never lost. */
    public void onActivityPause() {
        game.pause();
    }

    /** @return true if the game consumed the back press. */
    public boolean onBackRequested() {
        return game.onBack();
    }

    // ---------------------------------------------------------------- loop

    @Override
    public void run() {
        long last = System.nanoTime();
        while (running) {
            long now = System.nanoTime();
            float dt = (now - last) / 1_000_000_000f;
            last = now;
            if (dt > MAX_FRAME) dt = MAX_FRAME;

            // Fixed sub-steps: identical physics whether the device runs at 60, 90 or 120 Hz.
            while (dt > 0f) {
                float step = Math.min(dt, MAX_STEP);
                game.update(step);
                dt -= step;
            }

            SurfaceHolder holder = getHolder();
            Canvas canvas = null;
            try {
                canvas = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                        ? holder.lockHardwareCanvas()
                        : holder.lockCanvas();
                if (canvas != null) game.draw(canvas);
            } finally {
                if (canvas != null) {
                    try {
                        holder.unlockCanvasAndPost(canvas);
                    } catch (IllegalStateException ignored) {
                        // Surface went away mid-frame; the loop is about to exit anyway.
                    }
                }
            }
        }
    }

    // ---------------------------------------------------------------- input

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        int action = event.getActionMasked();
        if (action == MotionEvent.ACTION_DOWN || action == MotionEvent.ACTION_POINTER_DOWN) {
            // Per-pointer, so two thumbs landing in the same frame move two different cars.
            int i = event.getActionIndex();
            game.onTap(event.getX(i), event.getY(i));
            performClick();
        }
        return true;
    }

    @Override
    public boolean performClick() {
        return super.performClick();
    }
}
