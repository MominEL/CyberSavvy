document.addEventListener("DOMContentLoaded", () => {
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion = reduceMotionQuery.matches;

  // Ensure cards are visible immediately as a fallback
  const cards = document.querySelectorAll(".level-card");
  cards.forEach(card => {
    card.style.opacity = "1";
    card.style.visibility = "visible";
  });

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  const revealInstantly = (selectors) => {
    selectors.forEach((selector) => {
      gsap.set(selector, { opacity: 1, y: 0, scale: 1 });
    });
  };

  // Ensure header elements are visible
  try {
    // Force play all button to be visible immediately
    const playAllBtn = document.querySelector('.play-all-btn');
    if (playAllBtn) {
      playAllBtn.style.opacity = '1';
      playAllBtn.style.visibility = 'visible';
      playAllBtn.style.transform = 'none';
      playAllBtn.style.display = 'inline-block';
    }
    
    if (!prefersReducedMotion) {
      const headerTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      headerTimeline
        .from(".levels-title", { y: -50, opacity: 0, duration: 1.1 })
        .from(".levels-subtitle", { y: -30, opacity: 0, duration: 0.9 }, "-=0.6")
        .from(
          ".play-all-btn",
          { scale: 0.85, opacity: 0, duration: 0.7, ease: "back.out(1.7)" },
          "-=0.45"
        );
    } else {
      revealInstantly([".levels-title", ".levels-subtitle", ".play-all-btn"]);
    }
  } catch (error) {
    console.warn("GSAP header animation failed:", error);
    // Fallback: make elements visible
    document.querySelectorAll(".levels-title, .levels-subtitle, .play-all-btn").forEach(el => {
      el.style.opacity = "1";
      el.style.visibility = "visible";
    });
  }

  const cardsArray = gsap.utils.toArray(".level-card");

  // Ensure cards animation works with error handling
  try {
    if (!prefersReducedMotion && cardsArray.length > 0) {
      gsap.from(cardsArray, {
        y: 90,
        opacity: 0,
        scale: 0.92,
        duration: 1.1,
        delay: 0.3,
        ease: "power3.out",
        stagger: 0.18,
        onComplete: () => {
          // Ensure cards are fully visible after animation
          cardsArray.forEach(card => {
            card.style.opacity = "1";
            card.style.visibility = "visible";
          });
        }
      });
    } else {
      gsap.set(cardsArray, { opacity: 1 });
    }
  } catch (error) {
    console.warn("GSAP cards animation failed:", error);
    // Fallback: make all cards visible
    cardsArray.forEach(card => {
      card.style.opacity = "1";
      card.style.visibility = "visible";
    });
  }

  cardsArray.forEach((card) => {
    const content = card.querySelector(".card-content");
    const glow = card.querySelector(".card-glow");
    const outline = card.querySelector(".card-outline");
    const iconWrapper = card.querySelector(".level-icon-wrapper");
    const iconRing = card.querySelector(".icon-ring");
    const icon = card.querySelector(".level-icon");
    const heading = card.querySelector(".level-heading");
    const description = card.querySelector(".level-description");
    const highlights = gsap.utils.toArray(card.querySelectorAll(".level-highlights li"));
    const badge = card.querySelector(".difficulty-badge");
    const progressFill = card.querySelector(".progress-fill");
    const button = card.querySelector(".start-level-btn");
    const accent = getComputedStyle(card).getPropertyValue("--card-accent").trim() || "#39ff14";
    const progressValue = parseFloat(getComputedStyle(card).getPropertyValue("--progress-value")) || 0;
    const hoverProgress = `${Math.min(progressValue + 12, 100)}%`;
    const baseProgress = `${progressValue}%`;

    // Initialize card with error handling
    try {
      gsap.set(content, { transformStyle: "preserve-3d" });
      gsap.set(glow, { opacity: 0 });
      gsap.set(outline, { opacity: 0 });
      gsap.set(highlights, { opacity: 0.45, y: 18 });
      gsap.set(description, { opacity: 0.8 });
      gsap.set(progressFill, { width: baseProgress });

      if (!prefersReducedMotion && typeof ScrollTrigger !== "undefined") {
        gsap.from(progressFill, {
          width: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      }
    } catch (error) {
      console.warn("Card initialization failed:", error);
      // Ensure elements are visible as fallback
      if (glow) glow.style.opacity = "0";
      if (outline) outline.style.opacity = "0";
      if (progressFill) progressFill.style.width = baseProgress;
    }

    const hoverTimeline = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.out", duration: 0.6 }
    });

    hoverTimeline
      .to(content, { y: -22, scale: 1.03, boxShadow: "0 28px 60px rgba(0, 0, 0, 0.55)" }, 0)
      .to(glow, { opacity: 0.9, scale: 1.02 }, 0)
      .to(outline, { opacity: 1 }, 0)
      .to(iconWrapper, { y: -10 }, 0)
      .to(iconRing, { scale: 1.18, rotation: 200, transformOrigin: "50% 50%" }, 0)
      .to(icon, { y: -12, scale: 1.12 }, 0)
      .to(heading, { color: accent }, 0)
      .to(description, { opacity: 1 }, 0)
      .to(highlights, { opacity: 1, y: 0, stagger: 0.08 }, 0.05)
      .to(badge, { scale: 1.08 }, 0)
      .to(button, { scale: 1.05 }, 0.1)
      .to(progressFill, { width: hoverProgress }, 0);

    const activateCard = () => {
      hoverTimeline.play();
      card.classList.add("is-active");
    };

    const deactivateCard = () => {
      hoverTimeline.reverse();
      card.classList.remove("is-active");
      if (!prefersReducedMotion) {
        gsap.to(content, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
        gsap.to(glow, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
      }
    };

    // Throttled mouse move handler for better performance
    let moveThrottle = false;
    const throttledMouseMove = (event) => {
      if (moveThrottle) return;
      moveThrottle = true;
      
      requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect();
        const relX = event.clientX - bounds.left;
        const relY = event.clientY - bounds.top;
        const rotateY = ((relX / bounds.width) - 0.5) * 14;
        const rotateX = ((relY / bounds.height) - 0.5) * -14;

        gsap.to(content, {
          rotateY,
          rotateX,
          duration: 0.5,
          ease: "power2.out"
        });

        gsap.to(glow, {
          x: (relX - bounds.width / 2) * 0.08,
          y: (relY - bounds.height / 2) * 0.08,
          duration: 0.6,
          ease: "power2.out"
        });
        
        setTimeout(() => {
          moveThrottle = false;
        }, 16); // ~60fps throttling
      });
    };

    if (!prefersReducedMotion) {
      card.addEventListener("pointerenter", activateCard);
      card.addEventListener("pointerleave", deactivateCard);
      card.addEventListener("pointermove", throttledMouseMove);
    } else {
      card.addEventListener("mouseenter", activateCard);
      card.addEventListener("mouseleave", deactivateCard);
    }

    card.addEventListener("focusin", activateCard);
    card.addEventListener("focusout", (event) => {
      if (!card.contains(event.relatedTarget)) {
        deactivateCard();
      }
    });
  });

  gsap.utils.toArray(".bubble").forEach((bubble) => {
    gsap.to(bubble, {
      y: 8,
      duration: 2 + Math.random() * 1.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: Math.random()
    });
  });

  const bubbles = document.querySelectorAll(".bubble");
  bubbles.forEach((bubble) => {
    bubble.addEventListener("click", function (e) {
      if (!bubble.classList.contains("expanded")) {
        e.preventDefault();
        bubbles.forEach((b) => b.classList.remove("expanded"));
        bubble.classList.add("expanded");
      }
    });
  });

  // Optimized ambient animations with expanded coverage
  if (!prefersReducedMotion) {
    const orbs = gsap.utils.toArray(".ambient.orb");
    orbs.forEach((orb, index) => {
      // Expanded movement range for better coverage
      gsap.to(orb, {
        x: "random(-40, 40)", // Expanded movement range
        y: "random(-40, 40)", // Expanded movement range
        scale: "random(0.9, 1.15)", // Expanded scale range
        duration: "random(25, 35)", // Slightly slower animations for better visibility
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 3 // Staggered delays
      });
    });
  }

  const canvas = document.getElementById("levelsCanvas");
  if (canvas) {
    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.warn("Could not get canvas context");
        return;
      }
      
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -10;
        this.dx = (Math.random() - 0.5) * 0.8; // Increased movement range
        this.dy = Math.random() * 0.8 + 0.4; // Increased movement range
        this.size = Math.random() * 3 + 0.8; // Slightly larger particles
        this.opacity = Math.random() * 0.7 + 0.3; // Increased visibility
        this.color = Particle.colors[Math.floor(Math.random() * Particle.colors.length)];
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.y > height + 10) this.reset();
        if (this.x < -20 || this.x > width + 20) this.dx *= -1;

        this.opacity = Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.4 + 0.6;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = `${this.color}${this.opacity})`;
        ctx.shadowBlur = 25; // Increased glow
        ctx.shadowColor = `${this.color}${this.opacity})`;
        ctx.fill();
      }
    }

    Particle.colors = [
      "rgba(57, 255, 20,",
      "rgba(0, 245, 255,",
      "rgba(184, 77, 255,",
      "rgba(255, 110, 199,"
    ];

    const particles = [];
    // Increase particle count for better coverage
    const particleTotal = prefersReducedMotion ? 30 : Math.min(80, Math.floor(width / 15));

    for (let i = 0; i < particleTotal; i++) {
      particles.push(new Particle());
    }

    let lastFrameTime = 0;
    const targetFPS = 30; // Reduce from 60fps to 30fps for better performance
    const frameInterval = 1000 / targetFPS;

    function animate(currentTime) {
      // Throttle frame rate for better performance
      if (currentTime - lastFrameTime < frameInterval) {
        requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime;

      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        // Only draw connections for nearby particles to reduce calculations
        const maxConnections = 4; // Increased connections per particle
        let connectionCount = 0;
        
        for (let j = index + 1; j < particles.length && connectionCount < maxConnections; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) { // Increased distance for more connections
            ctx.beginPath();
            ctx.strokeStyle = `rgba(57, 255, 20, ${(1 - distance / 120) * 0.15})`; // Increased visibility
            ctx.lineWidth = 0.8; // Slightly thicker lines
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
            connectionCount++;
          }
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

      window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      });
    } catch (error) {
      console.warn("Particle system initialization failed:", error);
    }
  }

  const shimmerStyle = document.createElement("style");
  shimmerStyle.textContent = `
    .level-card::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.12) 45%, transparent 70%);
      transform: translateX(-120%);
      transition: transform 0.8s ease;
      pointer-events: none;
    }

    .level-card.is-active::after {
      transform: translateX(120%);
    }
  `;
  try {
    document.head.appendChild(shimmerStyle);
  } catch (error) {
    console.warn("Could not add shimmer style:", error);
  }

  // Final visibility check - ensure all elements are visible after page load
  setTimeout(() => {
    document.querySelectorAll('.level-card').forEach(card => {
      if (card.style.opacity === '0' || card.style.visibility === 'hidden') {
        console.warn('Forcing card visibility');
        card.style.opacity = '1';
        card.style.visibility = 'visible';
      }
    });
    
    // Ensure play all button is visible
    const playAllBtn = document.querySelector('.play-all-btn');
    if (playAllBtn) {
      playAllBtn.style.opacity = '1';
      playAllBtn.style.visibility = 'visible';
      playAllBtn.style.display = 'inline-block';
    }
  }, 2000);

  // Add interactive title functionality
  const title = document.querySelector('.levels-title');
  if (title) {
    title.addEventListener('click', () => {
      gsap.to(title, {
        scale: 1.1,
        rotation: 5,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    });
    
    title.addEventListener('mouseenter', () => {
      gsap.to(title, {
        textShadow: "0 0 50px rgba(57, 255, 20, 1), 0 0 100px rgba(0, 245, 255, 0.8)",
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    title.addEventListener('mouseleave', () => {
      gsap.to(title, {
        textShadow: "0 0 20px rgba(57, 255, 20, 0.5), 0 0 40px rgba(57, 255, 20, 0.2)",
        duration: 0.3,
        ease: "power2.out"
      });
    });
  }
});
