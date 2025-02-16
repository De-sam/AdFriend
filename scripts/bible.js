console.log("✅ bible.js is loaded! Waiting for message...");

function loadBibleVerse(targetId) {
    console.log("Loading Bible verse for", targetId);

    let filePath = chrome.runtime.getURL("data/bible.json");
    console.log("Fetching Bible verses from:", filePath);

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ Fetched Bible verses:", data.length, "verses available");

            let randomIndex = Math.floor(Math.random() * data.length);
            let verse = data[randomIndex].verse;
            let reference = data[randomIndex].reference;

            let widgetContainer = document.getElementById(targetId);
            if (widgetContainer) {
                widgetContainer.innerHTML = `
                    <h3 style="font-size:14px; margin-bottom:5px;">Bible Verse</h3>
                    <p style="font-size:12px;">"${verse}"</p>
                    <small style="font-size:10px;">- ${reference}</small>
                `;
                console.log("✅ Bible verse added to:", targetId);
            } else {
                console.warn("⚠️ Widget container not found:", targetId);
            }
        })
        .catch(error => {
            console.error("🔥 Error loading Bible verses:", error);
        });
}

// ✅ Listen for messages from `background.js`
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.widget === "bibleVerses") {
        loadBibleVerse(request.targetId);
    }
});
