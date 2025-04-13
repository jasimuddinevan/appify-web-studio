
package com.appify.webview;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.util.TypedValue;
import android.view.Gravity;
import android.widget.LinearLayout;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ProgressBar;

import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import androidx.webkit.WebSettingsCompat;
import androidx.webkit.WebViewFeature;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private ProgressBar progressBar;
    private SwipeRefreshLayout swipeRefreshLayout;
    private ConstraintLayout noConnectionLayout;
    private Button retryButton;
    private boolean isPageLoaded = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize views
        webView = findViewById(R.id.webview);
        progressBar = findViewById(R.id.progress_bar);
        swipeRefreshLayout = findViewById(R.id.swipe_refresh_layout);
        noConnectionLayout = findViewById(R.id.no_connection_layout);
        retryButton = findViewById(R.id.retry_button);

        // Configure WebView
        setupWebView();
        
        // Set up swipe to refresh
        swipeRefreshLayout.setOnRefreshListener(() -> {
            if (isNetworkAvailable()) {
                webView.reload();
            } else {
                swipeRefreshLayout.setRefreshing(false);
                showNoConnectionLayout();
            }
        });

        // Set up retry button
        retryButton.setOnClickListener(v -> {
            if (isNetworkAvailable()) {
                hideNoConnectionLayout();
                webView.reload();
            }
        });

        // Load the website
        if (isNetworkAvailable()) {
            webView.loadUrl(BuildConfig.WEB_URL);
        } else {
            showNoConnectionLayout();
        }

        // Apply navigation style
        applyNavigationStyle();
        
        // Set up custom navigation buttons if any
        setupCustomNavButtons();
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        
        // JavaScript settings
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        
        // Zoom settings
        webSettings.setSupportZoom(BuildConfig.ZOOM_ENABLED);
        webSettings.setBuiltInZoomControls(BuildConfig.ZOOM_ENABLED);
        webSettings.setDisplayZoomControls(false);
        
        // Cache settings
        switch (BuildConfig.CACHE_LEVEL) {
            case "none":
                webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);
                break;
            case "aggressive":
                webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
                break;
            case "moderate":
                webSettings.setCacheMode(WebSettings.LOAD_CACHE_ONLY);
                break;
            default:
                webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        }
        
        // Offline support
        if (BuildConfig.OFFLINE_SUPPORT) {
            webSettings.setAppCacheEnabled(true);
            webSettings.setAppCachePath(getApplicationContext().getCacheDir().getAbsolutePath());
        }
        
        // Configure WebViewClient to handle page loading
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                
                // Handle external URLs (email, phone, etc.)
                if (url.startsWith("tel:") || url.startsWith("mailto:") || 
                    url.startsWith("whatsapp:") || url.startsWith("sms:")) {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                }
                
                // Handle PDF files
                if (url.endsWith(".pdf")) {
                    Intent intent = new Intent(Intent.ACTION_VIEW);
                    intent.setDataAndType(Uri.parse(url), "application/pdf");
                    intent.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
                    try {
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        // If no PDF viewer is available, load it in the WebView
                        return false;
                    }
                }
                
                return false; // Let the WebView handle the URL
            }
            
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
                isPageLoaded = false;
            }
            
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                swipeRefreshLayout.setRefreshing(false);
                isPageLoaded = true;
            }
            
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame()) {
                    progressBar.setVisibility(View.GONE);
                    swipeRefreshLayout.setRefreshing(false);
                    if (!isNetworkAvailable()) {
                        showNoConnectionLayout();
                    }
                }
            }
        });
        
        // Configure WebChromeClient for progress tracking
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                progressBar.setProgress(newProgress);
            }
        });
    }
    
    private void applyNavigationStyle() {
        switch (BuildConfig.NAVIGATION_STYLE) {
            case "immersive":
                // Full screen immersive mode
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    getWindow().setDecorFitsSystemWindows(false);
                } else {
                    int flags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
                    getWindow().getDecorView().setSystemUiVisibility(flags);
                }
                break;
                
            case "transparent":
                // Transparent navigation and status bars
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    getWindow().setDecorFitsSystemWindows(false);
                } else {
                    int flags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN;
                    getWindow().getDecorView().setSystemUiVisibility(flags);
                }
                break;
                
            case "standard":
            default:
                // Standard navigation style (default)
                break;
        }
    }
    
    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }
    
    private void showNoConnectionLayout() {
        webView.setVisibility(View.GONE);
        noConnectionLayout.setVisibility(View.VISIBLE);
    }
    
    private void hideNoConnectionLayout() {
        noConnectionLayout.setVisibility(View.GONE);
        webView.setVisibility(View.VISIBLE);
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
        
        // Check connection when app resumes
        if (!isNetworkAvailable() && !isPageLoaded) {
            showNoConnectionLayout();
        }
    }
    
    @Override
    protected void onPause() {
        webView.onPause();
        super.onPause();
    }
    
    @Override
    protected void onDestroy() {
        webView.destroy();
        super.onDestroy();
    }
    
    /**
     * Sets up the custom navigation buttons if specified in the build configuration
     */
    private void setupCustomNavButtons() {
        try {
            LinearLayout bottomNavigationBar = findViewById(R.id.bottom_navigation_bar);
            String navButtonsJson = BuildConfig.NAV_BUTTONS;
            
            if (navButtonsJson == null || navButtonsJson.equals("[]") || navButtonsJson.isEmpty()) {
                return; // No navigation buttons to set up
            }
            
            // Parse the navigation buttons JSON
            org.json.JSONArray navButtonsArray = new org.json.JSONArray(navButtonsJson);
            if (navButtonsArray.length() == 0) {
                return; // No buttons
            }
            
            // Show the bottom navigation bar
            bottomNavigationBar.setVisibility(View.VISIBLE);
            bottomNavigationBar.removeAllViews(); // Clear any existing buttons
            
            // Calculate button width based on number of buttons
            int buttonWidth = getResources().getDisplayMetrics().widthPixels / navButtonsArray.length();
            
            // Add buttons
            for (int i = 0; i < navButtonsArray.length(); i++) {
                org.json.JSONObject buttonData = navButtonsArray.getJSONObject(i);
                String text = buttonData.getString("text");
                String url = buttonData.getString("url");
                
                // Create button
                Button button = new Button(this);
                button.setText(text);
                button.setAllCaps(false);
                button.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11); // Smaller text
                button.setGravity(Gravity.CENTER);
                
                // Apply default color
                try {
                    int color = Color.parseColor(BuildConfig.PRIMARY_COLOR);
                    button.setTextColor(color);
                } catch (Exception e) {
                    button.setTextColor(Color.parseColor("#3498db")); // Default blue
                }
                
                // Set layout parameters
                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    buttonWidth,
                    LinearLayout.LayoutParams.MATCH_PARENT
                );
                button.setLayoutParams(params);
                
                // Set click listener
                final String finalUrl = url;
                button.setOnClickListener(v -> {
                    if (isNetworkAvailable()) {
                        webView.loadUrl(finalUrl);
                    }
                });
                
                // Add to navigation bar
                bottomNavigationBar.addView(button);
            }
            
            // Adjust webview layout if necessary
            ConstraintLayout.LayoutParams webViewParams = 
                (ConstraintLayout.LayoutParams) webView.getLayoutParams();
            webViewParams.bottomToTop = R.id.bottom_navigation_bar;
            webView.setLayoutParams(webViewParams);
            
        } catch (Exception e) {
            e.printStackTrace();
            // Fail silently - if we can't set up navigation buttons, just continue without them
        }
    }
}
