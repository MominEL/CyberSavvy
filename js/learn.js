document.addEventListener("DOMContentLoaded", () => {
    // Example: handle "Read More" button clicks
    const readMoreButtons = document.querySelectorAll(".topic-card .btn");
    readMoreButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        alert("More details coming soon!");
      });
    });
  });
  