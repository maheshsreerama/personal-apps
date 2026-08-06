package com.fourcars.app;

import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioTrack;

import java.util.Random;

/**
 * Three tiny synthesised sounds. Nothing is loaded from disk — the waveforms are generated once at
 * first use into static {@link AudioTrack} buffers, so playback is a start() call with no decode
 * and no file I/O on the render thread.
 *
 * <p>Every call is best-effort: if audio is unavailable the game just runs silent.
 */
class Sfx {

    private static final int RATE = 44100;

    private final AudioTrack[] collect = new AudioTrack[4];
    private final AudioTrack[] blip = new AudioTrack[2];
    private final AudioTrack[] crash = new AudioTrack[1];
    private int collectIdx, blipIdx;

    private boolean ready;
    private boolean broken;

    void collect() {
        if (!init()) return;
        play(collect[collectIdx = (collectIdx + 1) % collect.length]);
    }

    void blip() {
        if (!init()) return;
        play(blip[blipIdx = (blipIdx + 1) % blip.length]);
    }

    void crash() {
        if (!init()) return;
        play(crash[0]);
    }

    private boolean init() {
        if (ready) return true;
        if (broken) return false;
        try {
            short[] pickup = sweep(70, 760f, 1240f, 0.34f);
            short[] click = sweep(32, 240f, 190f, 0.10f);
            short[] thud = noise(260, 130f, 0.42f);
            for (int i = 0; i < collect.length; i++) collect[i] = build(pickup);
            for (int i = 0; i < blip.length; i++) blip[i] = build(click);
            for (int i = 0; i < crash.length; i++) crash[i] = build(thud);
            ready = true;
        } catch (Throwable t) {
            broken = true;
        }
        return ready;
    }

    private static void play(AudioTrack t) {
        if (t == null) return;
        try {
            t.stop();
            t.reloadStaticData();
            t.play();
        } catch (Throwable ignored) {
            // A busy or dead track just doesn't sound; never let audio break a frame.
        }
    }

    private static AudioTrack build(short[] data) {
        AudioTrack t = new AudioTrack.Builder()
                .setAudioAttributes(new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_GAME)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build())
                .setAudioFormat(new AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(RATE)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                        .build())
                .setBufferSizeInBytes(data.length * 2)
                .setTransferMode(AudioTrack.MODE_STATIC)
                .build();
        t.write(data, 0, data.length);
        return t;
    }

    /** A sine that glides from {@code f0} to {@code f1} under an exponential decay. */
    private static short[] sweep(int millis, float f0, float f1, float amp) {
        int n = RATE * millis / 1000;
        short[] out = new short[n];
        double phase = 0;
        for (int i = 0; i < n; i++) {
            float k = i / (float) n;
            double f = f0 + (f1 - f0) * k;
            phase += 2 * Math.PI * f / RATE;
            double env = Math.exp(-4.5 * k) * fadeIn(i, n);
            out[i] = (short) (Math.sin(phase) * env * amp * Short.MAX_VALUE);
        }
        return out;
    }

    /** Filtered noise over a low sine — the crash. */
    private static short[] noise(int millis, float body, float amp) {
        int n = RATE * millis / 1000;
        short[] out = new short[n];
        Random rnd = new Random(7);
        double phase = 0, lp = 0;
        for (int i = 0; i < n; i++) {
            float k = i / (float) n;
            phase += 2 * Math.PI * body / RATE;
            double white = rnd.nextDouble() * 2 - 1;
            lp += (white - lp) * 0.18;                 // one-pole low pass, takes the fizz off
            double env = Math.exp(-5.0 * k) * fadeIn(i, n);
            double v = (lp * 0.75 + Math.sin(phase) * 0.55) * env * amp;
            out[i] = (short) (Math.max(-1, Math.min(1, v)) * Short.MAX_VALUE);
        }
        return out;
    }

    /** A 1 ms ramp so buffers never start on a click. */
    private static double fadeIn(int i, int n) {
        int ramp = Math.min(RATE / 1000, n);
        return i < ramp ? i / (double) ramp : 1.0;
    }
}
