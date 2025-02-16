console.log("✅ habits.js is loaded! Waiting for message...");

// Function to load a random positive habit
function loadHabit(targetId) {
    console.log("Loading a positive habit for", targetId);

    let filePath = chrome.runtime.getURL("data/habits.json");
    console.log("Fetching habits from:", filePath);

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ Fetched habits:", data.length, "habits available");

            let randomIndex = Math.floor(Math.random() * data.length);
            let habit = data[randomIndex].habit;

            let widgetContainer = document.getElementById(targetId);
            if (widgetContainer) {
                widgetContainer.innerHTML = `
                    <h3 style="font-size:14px; margin-bottom:5px;">Positive Habit</h3>
                    <p style="font-size:12px;">${habit}</p>
                `;
                console.log("✅ Positive habit added to:", targetId);
            } else {
                console.warn("⚠️ Widget container not found:", targetId);
            }
        })
        .catch(error => {
            console.error("🔥 Error loading habits:", error);
        });
}

// ✅ Listen for messages from `background.js`
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.widget === "positiveHabits") {
        loadHabit(request.targetId);
    }
});
