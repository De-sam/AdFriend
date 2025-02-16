console.log("✅ Bible verse script running!");

async function fetchVerse() {
    try {
        const response = await fetch(chrome.runtime.getURL("data/bible_verses.json"));
        if (!response.ok) throw new Error("Failed to load verses");

        const data = await response.json();
        const randomVerse = data.verses[Math.floor(Math.random() * data.verses.length)];

        document.getElementById("verse-text").textContent = `"${randomVerse.text}"`;
        document.getElementById("verse-ref").textContent = `— ${randomVerse.reference}`;
    } catch (error) {
        console.error("🚨 Bible Verse Fetch Error:", error);
        document.getElementById("verse-text").textContent = "Error loading verse.";
    }
}

// Run function
fetchVerse();
