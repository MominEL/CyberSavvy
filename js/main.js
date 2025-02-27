// -----------------------
// Network Effect Code
// -----------------------
(function() {
    const canvas = document.getElementById('networkCanvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
  
    // List of icon image sources – add or update these as needed.
    const iconSources = [
      'assets/images/shield-icon.png',
      'assets/images/lock-icon.png',
      'assets/images/firewall-icon.png',
      'assets/images/virus-icon.png',
      'assets/images/controller-icon.png',
      'assets/images/key-icon.png',         
      'assets/images/magnifier-icon.png',
      'assets/images/hacker-icon.png'     
    ];
  
    // Preload images
    const icons = [];
    iconSources.forEach(src => {
      const img = new Image();
      img.src = src;
      icons.push(img);
    });
  
    // Node class for each icon in the network
    class Node {
        constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Lower speed for a more relaxed, natural movement
        this.dx = (Math.random() - 0.5) * 1;
        this.dy = (Math.random() - 0.5) * 1;
        // Randomly assign an icon
        this.icon = icons[Math.floor(Math.random() * icons.length)];
        // Set a random depth between 0 and 1 (0 = far away, 1 = near)
        this.depth = Math.random();
        // Base size (will scale between 15 and 30)
        this.baseSize = 25;
        this.size = this.baseSize * (0.5 + this.depth);
        }
        
        update() {
        this.x += this.dx;
        this.y += this.dy;
        
        // Wrap around edges for continuous movement
        if (this.x < 0) this.x = width;
        else if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        else if (this.y > height) this.y = 0;
        }
        
        draw(ctx) {
        ctx.save();
        // Set opacity based on depth (farther icons are more transparent)
        ctx.globalAlpha = 0.5 + this.depth * 0.5;
        ctx.drawImage(this.icon, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        ctx.restore();
        }
    }
    
  
    // Create a collection of nodes – adjust the count for more icons
    const nodes = [];
    const nodeCount = 25;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node());
    }
  
    function animate() {
      ctx.clearRect(0, 0, width, height);
  
      // Update and draw each node
      nodes.forEach(node => {
        node.update();
        node.draw(ctx);
      });
  
      // Draw connecting lines between nodes that are close together
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 300) { // Connection threshold
            ctx.beginPath();
            // Line opacity fades with distance
            ctx.strokeStyle = 'rgba(50,205,50,' + (1 - distance / 300) + ')';
            ctx.lineWidth = 2;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    }
  
    animate();
  
    // Adjust canvas size on window resize
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  })();
  
  // -----------------------
  // Title Typing & UI Animations
  // -----------------------
  document.addEventListener("DOMContentLoaded", function () {
    const title = document.querySelector(".cyber-title");
    const text = "CyberSavvy";
    let index = 0;

    function typeTitle() {
      if (index < text.length) {
        // Create a span for each letter
        const span = document.createElement("span");
        span.classList.add("letter");
        span.textContent = text.charAt(index);
        title.appendChild(span);
  
        index++;
        setTimeout(typeTitle, 180); // Adjust typing speed as desired
      } else {
        // Typing finished: remove blinking cursor and enable per-letter glitch on hover
        title.style.borderRight = "none"; 
        title.style.animation = "none";  
        title.classList.add("typing-completed");
      }
    }
  
    typeTitle();
  
    // GSAP animations for UI elements
    gsap.from(".cyber-title", { opacity: 0, y: -50, duration: 1 });
    gsap.from(".subtitle", { opacity: 0, delay: 0.5, duration: 1 });
  
    // Button event listeners
    let playGameBtn = document.getElementById("playGame");
    if (playGameBtn) {
      playGameBtn.addEventListener("click", function () {
        window.location.href = "levels.html";
      });
    }
  
    let learnMoreBtn = document.getElementById("learnMore");
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener("click", function () {
        window.location.href = "learn.html";
      });
    }
  
    // Smooth Navigation for nav links
    const links = document.querySelectorAll("nav a");
    links.forEach(link => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        gsap.to("body", {
          opacity: 0, duration: 0.3,
          onComplete: () => {
            window.location.href = this.href;
          }
        });
      });
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

  
  