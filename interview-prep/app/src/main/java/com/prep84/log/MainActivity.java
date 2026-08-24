package com.prep84.log;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Thin shell: the whole tracker is an offline web app in assets/, and its progress lives in
 * the WebView's localStorage. The only native bits are the share sheet (for backups) and the
 * hardware back button, which the web app gets first so it can close a sheet or tab-hop.
 */
public class MainActivity extends Activity {

    private WebView webView;

    /** Exposed to the web app as window.Shell. */
    private class Shell {
        /** Hands a backup JSON blob to the system share sheet. */
        @JavascriptInterface
        public void share(final String text, final String subject) {
            Intent i = new Intent(Intent.ACTION_SEND);
            i.setType("text/plain");
            i.putExtra(Intent.EXTRA_SUBJECT, subject);
            i.putExtra(Intent.EXTRA_TEXT, text);
            startActivity(Intent.createChooser(i, subject));
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // localStorage: the entire log lives here
        s.setSupportZoom(false);
        s.setTextZoom(100);                    // ignore system font scaling: the layout is fixed

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri url = request.getUrl();
                String scheme = url.getScheme();
                if ("http".equals(scheme) || "https".equals(scheme)) {
                    startActivity(new Intent(Intent.ACTION_VIEW, url)); // problem links → browser
                    return true;
                }
                return false;                   // file:///android_asset stays inside
            }
        });
        webView.addJavascriptInterface(new Shell(), "Shell");

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

    @Override
    public void onBackPressed() {
        // The web app answers "true" when it consumed back (closed a sheet, or left a tab).
        webView.evaluateJavascript("window.appBack && window.appBack()", value -> {
            if (!"true".equals(value)) {
                MainActivity.super.onBackPressed();
            }
        });
    }
}
