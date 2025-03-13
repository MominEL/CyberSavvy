document.addEventListener("DOMContentLoaded", () => {
    const settingsForm = document.querySelector(".settings-form");
    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Settings saved!");
      // You can store settings in localStorage or send to server here.
    });
  });


    document.addEventListener("DOMContentLoaded", function () {
    // Gentle bobbing for each bubble
    gsap.utils.toArray(".bubble").forEach((bubble) => {
      gsap.to(bubble, {
        y: 5,                        // Bob up and down by 5px
        duration: 2 + Math.random(), // Slight variation in duration
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
        delay: Math.random()         // Random offset so they're not in sync
      });
    });
  
    // Mobile: first tap expands bubble, second tap navigates
    const bubbles = document.querySelectorAll(".bubble");
    bubbles.forEach((bubble) => {
      bubble.addEventListener("click", function (e) {
        if (!bubble.classList.contains("expanded")) {
          e.preventDefault();
          // Optionally collapse other expanded bubbles
          bubbles.forEach(b => b.classList.remove("expanded"));
          bubble.classList.add("expanded");
        }
        // If already expanded, let link proceed
      });
    });
  });
  