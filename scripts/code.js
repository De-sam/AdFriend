console.log("✅ code.js is loaded! Waiting for message...");

// Function to load a random coding fact
function loadCodeSnippet(targetId) {
    console.log("Loading a coding fact for", targetId);

    let filePath = chrome.runtime.getURL("data/code.json");
    console.log("Fetching coding facts from:", filePath);

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ Fetched coding facts:", data.length, "facts available");

            let randomIndex = Math.floor(Math.random() * data.length);
            let fact = data[randomIndex].fact;

            let widgetContainer = document.getElementById(targetId);
            if (widgetContainer) {
                widgetContainer.innerHTML = `
                    <h3 style="font-size:14px; margin-bottom:5px;">Did You Know?</h3>
                    <p style="font-size:12px;">${fact}</p>
                `;
                console.log("✅ Coding fact added to:", targetId);
            } else {
                console.warn("⚠️ Widget container not found:", targetId);
            }
        })
        .catch(error => {
            console.error("🔥 Error loading coding facts:", error);
        });
}

// ✅ Listen for messages from `background.js`
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.widget === "codingSnippets") {
        loadCodeSnippet(request.targetId);
    }
});
