document.addEventListener("DOMContentLoaded", () => {
    const settingsForm = document.querySelector(".settings-form");
    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Settings saved!");
      // You can store settings in localStorage or send to server here.
    });
  });
  