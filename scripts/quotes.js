console.log("✅ quotes.js is loaded! Waiting for message...");

// Function to fetch and display a motivational quote from local JSON
function loadQuote(targetId) {
    console.log("Loading quote from local JSON for", targetId);

    fetch(chrome.runtime.getURL("data/quotes.json"))
        .then(response => response.json())
        .then(data => {
            let randomIndex = Math.floor(Math.random() * data.length);
            let quote = data[randomIndex].q;
            let author = data[randomIndex].a || "Unknown";

            console.log("✅ Fetched quote:", quote);

            let widgetContainer = document.getElementById(targetId);
            if (widgetContainer) {
                widgetContainer.innerHTML = `
                    <h3 style="font-size:14px; margin-bottom:5px;">Motivational Quote</h3>
                    <p style="font-size:12px;">"${quote}"</p>
                    <small style="font-size:10px;">- ${author}</small>
                `;
                console.log("✅ Quote added to:", targetId);
            } else {
                console.warn("⚠️ Widget container not found:", targetId);
            }
        })
        .catch(error => {
            console.error("🔥 Error loading local quotes:", error);
        });
}

// ✅ Listen for messages from `background.js`
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.widget === "motivationalQuotes") {
        loadQuote(request.targetId);
    }
});
