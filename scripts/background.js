chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message to inject:", request.widget, "Target ID:", request.targetId);

    // Ensure the widget file exists before trying to load it
    const validWidgets = {
        "motivationalQuotes": "scripts/quotes.js", // ✅ Correct file path
        "codingChallenges": "scripts/coding_challenges.js",
        "bibleVerses": "scripts/bible.js",
        "codingSnippets": "scripts/code.js",
        "positiveHabits": "scripts/habits.js",
        "brainTeasers": "scripts/brainTeasers.js"
    };

    if (validWidgets[request.widget]) {
        console.log("Injecting:", validWidgets[request.widget]);
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            files: [validWidgets[request.widget]] // ✅ Only load valid widgets
        }, () => {
            chrome.tabs.sendMessage(sender.tab.id, { widget: request.widget, targetId: request.targetId });
        });
    } else {
        console.error("❌ Invalid widget requested:", request.widget);
    }
});
