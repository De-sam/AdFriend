console.log("✅ coding_challenges.js is loaded! Waiting for message...");

// Function to load a random coding challenge
function loadCodingChallenge(targetId) {
    console.log("Loading a coding challenge for", targetId);

    let filePath = chrome.runtime.getURL("data/coding_challenges.json");
    console.log("Fetching coding challenges from:", filePath);

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ Fetched coding challenges:", data.length, "available");

            let randomIndex = Math.floor(Math.random() * data.length);
            let challenge = data[randomIndex];

            let widgetContainer = document.getElementById(targetId);
            if (widgetContainer) {
                widgetContainer.innerHTML = `
                    <h3 style="font-size:14px; margin-bottom:5px;">${challenge.language} Challenge</h3>
                    <p style="font-size:12px;"><strong>Q:</strong> ${challenge.question}</p>
                    <ul style="list-style-type:none;padding:0;">
                        <li>A) ${challenge.choices.A}</li>
                        <li>B) ${challenge.choices.B}</li>
                        <li>C) ${challenge.choices.C}</li>
                        <li>D) ${challenge.choices.D}</li>
                    </ul>
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
                    ">Show Answer</button>
                    <p id="${targetId}-answer" style="display:none;font-size:12px;">
                        <strong>Correct Answer:</strong> ${challenge.correct} <br>
                        <strong>Explanation:</strong> ${challenge.explanation}
                    </p>
                `;
                console.log("✅ Coding challenge added to:", targetId);

                document.getElementById(`${targetId}-reveal`).addEventListener("click", function() {
                    document.getElementById(`${targetId}-answer`).style.display = "block";
                });
            } else {
                console.warn("⚠️ Widget container not found:", targetId);
            }
        })
        .catch(error => {
            console.error("🔥 Error loading coding challenges:", error);
        });
}

// ✅ Listen for messages from `background.js`
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.widget === "codingChallenges") {
        loadCodingChallenge(request.targetId);
    }
});
