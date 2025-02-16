document.addEventListener("DOMContentLoaded", function () {
  const optionsForm = document.getElementById("optionsForm");

  // Load saved preferences from storage
  chrome.storage.sync.get(["widgets"], function (data) {
      if (data.widgets) {
          document.querySelectorAll("input[name='widgets']").forEach((checkbox) => {
              if (data.widgets.includes(checkbox.value)) {
                  checkbox.checked = true;
              }
          });
      }
  });

  // Save preferences when the form is submitted
  optionsForm.addEventListener("submit", function (event) {
      event.preventDefault();
      let selectedWidgets = [];

      document.querySelectorAll("input[name='widgets']:checked").forEach((checkbox) => {
          selectedWidgets.push(checkbox.value);
      });

      chrome.storage.sync.set({ widgets: selectedWidgets }, function () {
          alert("Preferences saved successfully! 🎉");
      });
  });
});
