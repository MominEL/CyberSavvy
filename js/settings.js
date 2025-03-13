document.addEventListener("DOMContentLoaded", () => {
    const settingsForm = document.querySelector(".settings-form");
    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Settings saved!");

    });
  });


    document.addEventListener("DOMContentLoaded", function () {

    gsap.utils.toArray(".bubble").forEach((bubble) => {
      gsap.to(bubble, {
        y: 5,                        
        duration: 2 + Math.random(), 
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
        delay: Math.random()        
      });
    });
  

    const bubbles = document.querySelectorAll(".bubble");
    bubbles.forEach((bubble) => {
      bubble.addEventListener("click", function (e) {
        if (!bubble.classList.contains("expanded")) {
          e.preventDefault();

          bubbles.forEach(b => b.classList.remove("expanded"));
          bubble.classList.add("expanded");
        }

      });
    });
  });
  