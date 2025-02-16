console.log("✅ brain_teasers.js is loaded! Waiting for message...");

// Function to load a random brain teaser
function loadBrainTeaser(targetId) {
    console.log("Loading a brain teaser for", targetId);

    let filePath = chrome.runtime.getURL("data/brain_teasers.json");
    console.log("Fetching brain teasers from:", filePath);

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ Fetched brain teasers:", data.length, "available");

            let randomIndex = Math.floor(Math.random() * data.length);
            let question = data[randomIndex].question;
            let answer = data[randomIndex].answer;

            let widgetContainer = document.getElementById(targetId);
            if (widgetContainer) {
                widgetContainer.innerHTML = `
                   <h3 style="font-size:14px; margin-bottom:5px;">Brain Teaser</h3>
                    <p style="font-size:12px;"><strong>Q:</strong> ${question}</p>
                    <button id="${targetId}-reveal" style="
                        margin-top:5px;
                        padding:7px 14px;
                        font-size:12px;
                        border: 2px solid white;
                        border-radius: 8px;
                        background: transparent;
                        color: white;
                        cursor: pointer;
                        transition: 0.3s;
                    " 
                    onmouseover="this.style.background='white'; this.style.color='black';"
                    onmouseout="this.style.background='transparent'; this.style.color='white';"
                    >Show Answer</button>
                    <p id="${targetId}-answer" style="display:none;font-size:12px;"><strong>A:</strong> ${answer}</p>
                    `;
                console.log("✅ Brain teaser added to:", targetId);

                document.getElementById(`${targetId}-reveal`).addEventListener("click", function() {
                    document.getElementById(`${targetId}-answer`).style.display = "block";
                });
            } else {
                console.warn("⚠️ Widget container not found:", targetId);
            }
        })
        .catch(error => {
            console.error("🔥 Error loading brain teasers:", error);
        });
}

// ✅ Listen for messages from `background.js`
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.widget === "brainTeasers") {
        loadBrainTeaser(request.targetId);
    }
});
