package com.healthreset.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Thin shell: the whole dashboard is an offline web app in assets/. */
public class MainActivity extends Activity {

    private WebView webView;

    /**
     * Persistence bridge for the page's window.storage calls.
     *
     * The tracker keeps its whole state in one JSON blob, so SharedPreferences is a
     * better fit than localStorage — a file:// origin's DOM storage can be cleared
     * by the WebView without warning, and losing a habit streak is the one failure
     * this app cannot afford.
     */
    public static class Store {
        private final SharedPreferences prefs;

        Store(Context c) {
            prefs = c.getSharedPreferences("healthreset", Context.MODE_PRIVATE);
        }

        @JavascriptInterface
        public String get(String key) {
            return prefs.getString(key, null);
        }

        @JavascriptInterface
        public boolean set(String key, String value) {
            // commit(), not apply() — the page reports the write back to the user.
            return prefs.edit().putString(key, value).commit();
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // fallback storage path
        s.setSupportZoom(false);               // form-heavy dashboard: pinch-zoom just gets in the way
        s.setBuiltInZoomControls(false);

        // Local assets only, so the bridge is not reachable by any remote page.
        webView.addJavascriptInterface(new Store(this), "AndroidStore");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri url = request.getUrl();
                String scheme = url.getScheme();
                if ("http".equals(scheme) || "https".equals(scheme)) {
                    startActivity(new Intent(Intent.ACTION_VIEW, url)); // external links → browser
                    return true;
                }
                return false;                   // file:///android_asset stays inside
            }
        });

        setContentView(webView);
        if (savedInstanceState == null) {
            webView.loadUrl("file:///android_asset/index.html");
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }
}
