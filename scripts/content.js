console.log("✅ content.js is running!");

let adsReplaced = 0; // Track ads replaced
let maxAdsPerBatch = 10; // ✅ Replace 10 ads per batch for efficiency

function replaceAds() {
    chrome.storage.sync.get(["widgets"], function (data) {
        let selectedWidgets = data.widgets || [];
        if (selectedWidgets.length === 0) {
            console.log("⚠️ No widgets selected, skipping ad replacement.");
            return;
        }

        // ✅ Expanded Ad Detection: More Classes, IDs & Attributes
        let adSelectors = [
            "iframe[src*='ads']",        
            "div[id^='google_ads']",     
            "div[class*='ad-']",         
            "div[class*='advertisement']",
            "div[aria-label*='Sponsored']",
            "div[data-ad-slot]",
            "div[data-ad-container]",  // ✅ Detects hidden ad containers
            "div[class*='sponsor']",  // ✅ Captures more sponsored content
            "div[class*='promo']",    // ✅ Detects promotional content
            "section[class*='ad-']",  // ✅ Some ads are in `<section>` elements
            "aside[class*='ad-']",    // ✅ Some sites place ads in `<aside>`
            "div[role='banner']",     // ✅ Banner ads
            "div[class*='partner']",  // ✅ Affiliate/partner ads
            "ins.adsbygoogle",        // ✅ Google AdSense ads
            "div[class*='native-ad']", // ✅ Native ads
            "div[class*='outbrain']",  // ✅ Outbrain ads
            "div[class*='taboola']",   // ✅ Taboola ads
            "div[class*='sponsored']", // ✅ More sponsored content detection
            "div[class*='ad-container']", // ✅ Catches more embedded ads
            "div[class*='ad-slot']" // ✅ Common ad slot naming convention
        ];

        let ads = document.querySelectorAll(adSelectors.join(", "));
        let newAds = Array.from(ads).slice(adsReplaced, adsReplaced + maxAdsPerBatch);

        console.log(`🟢 Found ${ads.length} ads, replacing ${newAds.length} more...`);

        newAds.forEach((ad, index) => {
            let widget = document.createElement("div");
            let widgetId = `widget-${adsReplaced + index}`;
            widget.id = widgetId;
            widget.style.cssText = "border:2px solid #333;padding:10px;margin:5px;background:#fff;max-width:300px;";

            let randomWidget = selectedWidgets[Math.floor(Math.random() * selectedWidgets.length)];
            console.log(`Replacing ad ${adsReplaced + index} with widget: ${randomWidget}`);

            // Send message to `background.js`
            chrome.runtime.sendMessage({ widget: randomWidget, targetId: widgetId });

            ad.replaceWith(widget);
        });

        adsReplaced += newAds.length;
    });
}

// ✅ 1. Replace First 10 Ads Quickly on Page Load
window.onload = () => {
    console.log("🟢 Initial ad replacement...");
    replaceAds();
};

// ✅ 2. Lazy Load Next Ads on Scroll (Replace 10 more ads when scrolling)
window.addEventListener("scroll", function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        replaceAds();
    }
});

// ✅ 3. Efficiently Detect Dynamically Loaded Ads (Check every 3 seconds)
let intervalCount = 0;
let maxIntervals = 10; // Stop checking after 30 seconds (3s x 10)

let interval = setInterval(() => {
    if (intervalCount >= maxIntervals) {
        clearInterval(interval);
        console.log("🛑 Stopped checking for new ads (Performance Optimized).");
    } else {
        replaceAds();
        intervalCount++;
    }
}, 3000);

// ✅ 4. MutationObserver to Detect New Ads (Efficiently Watches DOM Changes)
const observer = new MutationObserver(() => {
    replaceAds();
});
observer.observe(document.body, { childList: true, subtree: true });

// ✅ 5. Listen for messages from `background.js`
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message in content.js:", request);
});
