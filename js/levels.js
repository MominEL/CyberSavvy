document.addEventListener("DOMContentLoaded", () => {
  // Animate heading and cards
  gsap.from(".levels-title", {
    y: -30,
    opacity: 0,
    duration: 1
  });
  gsap.from(".level-card", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2
  });

  // Bubble bar bobbing + two-tap logic
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

  // Particle background effect
  const canvas = document.getElementById("levelsCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.dx = (Math.random() - 0.5) * 0.7;
      this.dy = (Math.random() - 0.5) * 0.7;
      this.size = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.dx;
      this.y += this.dy;
      if (this.x < 0) this.x = width;
      else if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      else if (this.y > height) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(50,205,50, 0.6)";
      ctx.fill();
    }
  }

  const particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw(ctx);
    });
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
});
