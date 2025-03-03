document.addEventListener("DOMContentLoaded", () => {
  // ========== 1) BUBBLE MENU - LEAVE GAME POPUP ==========
  const bubbleLinks = document.querySelectorAll(".bubble-bar-right a");
  const leaveGamePopup = document.getElementById("leaveGamePopup");
  const leaveYes = document.getElementById("leaveYes");
  const leaveNo = document.getElementById("leaveNo");
  let pendingLink = null;

  bubbleLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      pendingLink = link.getAttribute("href");
      showPopup(leaveGamePopup);
    });
  });

  if (leaveYes && leaveNo) {
    leaveYes.addEventListener("click", () => {
      if (pendingLink) window.location.href = pendingLink;
    });
    leaveNo.addEventListener("click", () => {
      hidePopup(leaveGamePopup);
      pendingLink = null;
    });
  }

  // ========== 2) HOME BUTTON (In-Page Popup) ==========
  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) {
    homeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      pendingLink = homeBtn.getAttribute("href");
      showPopup(leaveGamePopup);
    });
  }

  // ========== 3) DIFFICULTY POPUP ON LOAD ==========
  const difficultyPopup = document.getElementById("difficultyPopup");
  const rookieBtn = document.getElementById("rookieBtn");
  const proBtn = document.getElementById("proBtn");
  let difficulty = "rookie";

  showPopup(difficultyPopup);

  rookieBtn.addEventListener("click", () => {
    difficulty = "rookie";
    hidePopup(difficultyPopup);
    initGame();
  });
  proBtn.addEventListener("click", () => {
    difficulty = "pro";
    hidePopup(difficultyPopup);
    initGame();
  });

  // ========== 4) TIP POPUP (Hint) ==========
  const tipBtn = document.getElementById("tipBtn");
  const tipPopup = document.getElementById("tipPopup");
  const tipContent = document.getElementById("tipContent"); // inside popup-content
  tipBtn.addEventListener("click", () => {
    // Change hint text based on mode
    if (difficulty === "rookie") {
      tipContent.innerHTML = `
        <h2>Hint (Rookie)</h2>
        <p>Drag words, numbers, and symbols into the password area.<br>
           Each piece builds part of your castle!<br>
           Try adding uppercase letters, numbers, and symbols for extra strength.
        </p>
        <button id="tipCloseBtn" class="popup-btn">Got it!</button>
      `;
    } else {
      tipContent.innerHTML = `
        <h2>Hint (Pro)</h2>
        <p>Type a strong password in the box.<br>
           Aim for 12+ characters with numbers & symbols.<br>
           Your castle will be built as your password gets stronger!
        </p>
        <button id="tipCloseBtn" class="popup-btn">Got it!</button>
      `;
    }
    showPopup(tipPopup);
    document.getElementById("tipCloseBtn").addEventListener("click", () => {
      hidePopup(tipPopup);
    });
  });

  // ========== 5) PARTICLE BACKGROUND ==========
  const bgCanvas = document.getElementById("levelCanvas");
  if (bgCanvas) {
    const ctx = bgCanvas.getContext("2d");
    let width = (bgCanvas.width = window.innerWidth);
    let height = (bgCanvas.height = window.innerHeight);

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

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    window.addEventListener("resize", () => {
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
    });
  }

  // ========== 6) GAME VARIABLES & LOGIC ==========
  const tileContainer = document.getElementById("tileContainer");
  const passwordDisplay = document.getElementById("passwordDisplay");
  const meterBar = document.getElementById("meterBar");
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");
  const feedbackText = document.getElementById("feedbackText");
  const starRating = document.getElementById("starRating");

  // Hacker images & click trick
  const hackerImg = document.getElementById("hackerImg");
  let hackerClickCount = 0;

  // Instructions text (centered, glowing)
  const cyberInstructions = document.getElementById("cyberInstructions");

  // 4 castle parts
  const part1 = document.querySelector(".part1");
  const part2 = document.querySelector(".part2");
  const part3 = document.querySelector(".part3");
  const part4 = document.querySelector(".part4");

  let currentPasswordArr = []; // for rookie (drag-and-drop)
  let typedPassword = "";      // for pro (typed)
  let successfulPasswords = 0;

  // Arrays for difficulty
  const rookieWords = ["cat", "sun", "panda", "pizza", "sigma", "toy", "frog"];
  const proWords = ["kingkong", "unicorn", "f00bar", "n!nja", "b@n@n@", "SIGMA", "qu4ntum"];
  const numbers = ["123", "007", "42", "999", "2023", "000"];
  const symbols = ["!", "@", "#", "$", "%", "^", "&"];

  // QUIZ: We'll show one question at a time
  const quizPopup = document.getElementById("quizPopup");
  const quizQuestionsDiv = document.getElementById("quizQuestions");
  const quizSubmitBtn = document.getElementById("quizSubmitBtn");
  const quizFeedback = document.getElementById("quizFeedback");


  const quizQuestions = [
    {
      question: "Which is safer: '123456' or 'C@t42!'?",
      options: ["123456", "C@t42!"],
      answer: 1
    },
    {
      question: "Should you share your password with friends?",
      options: ["Yes", "No"],
      answer: 1
    },
    {
      question: "What's the best length for a password?",
      options: ["At least 8 characters", "3-4 is enough", "Doesn't matter"],
      answer: 0
    }
  ];

  // Celebration popup & confetti
  const castleCompletePopup = document.getElementById("castleCompletePopup");
  const castleCompleteClose = document.getElementById("castleCompleteClose");
  const confettiContainer = document.getElementById("confettiContainer");

  if (castleCompleteClose) {
    castleCompleteClose.addEventListener("click", () => {
      hidePopup(castleCompletePopup);
      doReset(); // auto-reset after user closes
    });
  }

  // Hacker click trick: 3 clicks => become angry for 3 sec, then revert
  if (hackerImg) {
    hackerImg.addEventListener("click", () => {
      hackerClickCount++;
      if (hackerClickCount >= 3) {
        setHackerAngry();
        setTimeout(() => {
          hackerClickCount = 0;
          updateHackerMood(calculateScore());
        }, 3000);
      }
    });
  }

  // Animate instructions text => subtle glow & random shake
  function animateInstructions() {
    gsap.to("#cyberInstructions", {
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 5,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut",
      onComplete: () => setTimeout(animateInstructions, 3000 + Math.random() * 2000)
    });
  }

  // Called after user picks difficulty
  function initGame() {
    // Set instructions text
    if (difficulty === "rookie") {
      cyberInstructions.innerText = "Drag tiles to build your fortress!";
    } else {
      cyberInstructions.innerText = "Type your password to build your fortress!";
    }

    // Hide all castle parts
    part1.classList.add("hidden");
    part2.classList.add("hidden");
    part3.classList.add("hidden");
    part4.classList.add("hidden");

    currentPasswordArr = [];
    typedPassword = "";
    successfulPasswords = 0;
    feedbackText.textContent = "";
    starRating.textContent = "";
    meterBar.style.width = "0%";
    meterBar.style.background = "red";

    // If pro => contenteditable => bigger font
    if (difficulty === "pro") {
      passwordDisplay.setAttribute("contenteditable", "true");
      passwordDisplay.style.fontSize = "2rem"; // bigger typed text
      tileContainer.classList.add("hidden");
      passwordDisplay.innerText = "";
    } else {
      passwordDisplay.setAttribute("contenteditable", "false");
      passwordDisplay.style.fontSize = "1rem";
      tileContainer.classList.remove("hidden");
      createRookieTiles();
    }

    // Hacker normal at start
    setHackerNormal();
    updatePasswordDisplay();
  }

  function createRookieTiles() {
    tileContainer.innerHTML = "";
    let wordCount = 3;
    let randomWords = getRandomItems(rookieWords, wordCount);
    let randomNums = getRandomItems(numbers, 3);
    let randomSyms = getRandomItems(symbols, 3);
    let allTiles = [...randomWords, ...randomNums, ...randomSyms];
    shuffleArray(allTiles);

    allTiles.forEach(val => {
      const tile = document.createElement("button");
      tile.className = "tile-btn";
      tile.textContent = val;
      tile.setAttribute("draggable", "true");
      tile.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", val);
      });
      tileContainer.appendChild(tile);
    });
  }

  // For Pro => user types in passwordDisplay
  passwordDisplay.addEventListener("input", () => {
    if (difficulty === "pro") {
      typedPassword = passwordDisplay.textContent.trim();
      updateStrengthMeter();
    }
  });

  // Drag & drop (rookie)
  passwordDisplay.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  passwordDisplay.addEventListener("drop", (e) => {
    e.preventDefault();
    if (difficulty === "rookie") {
      const val = e.dataTransfer.getData("text/plain");
      currentPasswordArr.push(val);
      updatePasswordDisplay();
      updateStrengthMeter();
    }
  });

  function updatePasswordDisplay() {
    if (difficulty === "pro") {
      // typed
      if (passwordDisplay.textContent.trim() !== typedPassword) {
        passwordDisplay.textContent = typedPassword;
      }
    } else {
      // rookie
      passwordDisplay.innerHTML = "";
      if (currentPasswordArr.length === 0) {
        const placeholder = document.createElement("span");
        placeholder.className = "placeholder-text";
        placeholder.textContent = "Drop tiles here";
        passwordDisplay.appendChild(placeholder);
        return;
      }
      currentPasswordArr.forEach(item => {
        const span = document.createElement("span");
        span.textContent = item + " ";
        passwordDisplay.appendChild(span);
      });
    }
  }

  function updateStrengthMeter() {
    let passwordStr = (difficulty === "pro") ? passwordDisplay.textContent.trim() : currentPasswordArr.join("");
    let score = calculateScoreInternal(passwordStr);
    meterBar.style.width = score + "%";
    if (score <= 25) meterBar.style.background = "red";
    else if (score <= 50) meterBar.style.background = "orange";
    else if (score <= 75) meterBar.style.background = "yellow";
    else meterBar.style.background = "limegreen";

    updateCastleParts(score);
    updateHackerMood(score);
  }

  function calculateScoreInternal(str) {
    let sc = 0;
    if (str.length >= ((difficulty === "pro") ? 10 : 6)) sc += 25;
    if (str.length >= ((difficulty === "pro") ? 12 : 8)) sc += 25;
    if (/\d/.test(str)) sc += 25;
    if (/[\W_]/.test(str)) sc += 25;
    return sc;
  }

  function updateCastleParts(score) {
    if (score >= 25) part1.classList.remove("hidden");
    else part1.classList.add("hidden");

    if (score >= 50) part2.classList.remove("hidden");
    else part2.classList.add("hidden");

    if (score >= 75) part3.classList.remove("hidden");
    else part3.classList.add("hidden");

    if (score === 100) part4.classList.remove("hidden");
    else part4.classList.add("hidden");
  }

  function updateHackerMood(score) {
    if (!hackerImg) return;
    if (hackerClickCount >= 3) return; // override
    if (score === 0) setHackerNormal();
    else if (score < 100) setHackerHappy();
    else setHackerAngry();
  }

  function setHackerNormal() {
    gsap.killTweensOf(hackerImg);
    hackerImg.src = "../assets/images/hacker-normal.png";
    hackerImg.title = "Just chilling...";
    gsap.to(hackerImg, { x:0, y:0, duration:0.1 });
  }

  function setHackerHappy() {
    gsap.killTweensOf(hackerImg);
    hackerImg.src = "../assets/images/hacker-happy.png";
    hackerImg.title = "I'm almost in!";
    // small jump
    gsap.to(hackerImg, {
      y: -10,
      duration: 0.5,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut"
    });
  }

  function setHackerAngry() {
    gsap.killTweensOf(hackerImg);
    hackerImg.src = "../assets/images/hacker-angry.png";
    hackerImg.title = "Oh Nooo... fortress is too strong!";
    // shake
    gsap.to(hackerImg, {
      x: 5,
      duration: 0.1,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut"
    });
  }

  submitBtn.addEventListener("click", () => {
    let passwordStr = (difficulty === "pro") ? passwordDisplay.textContent.trim() : currentPasswordArr.join("");
    let finalScore = calculateScoreInternal(passwordStr) / 25; // 0-4

    let stars = (finalScore === 4) ? 3 : (finalScore === 3 ? 2 : (finalScore === 2 ? 1 : 0));
    if (stars < 1) {
      feedbackText.textContent = "Your fortress is weak! Try adding more variety.";
      starRating.textContent = "";
    } else if (stars === 1) {
      feedbackText.textContent = "Not bad, but you can do better!";
      starRating.textContent = "★";
    } else if (stars === 2) {
      feedbackText.textContent = "Good job! Almost unbreakable!";
      starRating.textContent = "★★";
    } else {
      feedbackText.textContent = "Excellent! Fortress is fully secured!";
      starRating.textContent = "★★★";
      successfulPasswords++;

      // If 2 strong passwords => quiz
      if (successfulPasswords >= 2) {
        showNextQuizQuestion();
      }
      showCastleCompletePopup();
    }
  });

  resetBtn.addEventListener("click", () => {
    doReset();
  });

  function doReset() {
    currentPasswordArr = [];
    typedPassword = "";
    hackerClickCount = 0;
    passwordDisplay.textContent = "";
    meterBar.style.width = "0%";
    meterBar.style.background = "red";
    feedbackText.textContent = "";
    starRating.textContent = "";
    part1.classList.add("hidden");
    part2.classList.add("hidden");
    part3.classList.add("hidden");
    part4.classList.add("hidden");
    setHackerNormal();
    // Make reset button bigger w/ icon
    resetBtn.innerHTML = "🔄 Reset";
  }

  // ========== 8) QUIZ => ONE QUESTION PER POPUP ==========
  let currentQuizIndex = 0;
  let quizCorrectCount = 0;

  function showNextQuizQuestion() {
    if (currentQuizIndex >= quizQuestions.length) {
      // Done => show final result
      quizQuestionsDiv.innerHTML = "";
      quizFeedback.textContent = `You got ${quizCorrectCount}/${quizQuestions.length} correct!`;
      const nextBtn = document.createElement("button");
      nextBtn.className = "popup-btn";
      nextBtn.textContent = "Go to Level 2";
      nextBtn.addEventListener("click", () => {
        window.location.href = "level2.html";
      });
      quizQuestionsDiv.appendChild(nextBtn);
      showPopup(quizPopup);
      return;
    }

    // Build single question
    quizQuestionsDiv.innerHTML = "";
    quizFeedback.textContent = "";
    const q = quizQuestions[currentQuizIndex];

    const div = document.createElement("div");
    div.className = "quiz-question";
    const p = document.createElement("p");
    p.innerText = q.question;
    p.style.fontSize = "1.5rem";
    p.style.marginBottom = "15px";
    div.appendChild(p);

    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "popup-btn";
      btn.style.margin = "5px";
      btn.innerText = opt;
      btn.addEventListener("click", () => {
        if (i === q.answer) quizCorrectCount++;
        currentQuizIndex++;
        hidePopup(quizPopup);
        setTimeout(() => showNextQuizQuestion(), 400);
      });
      div.appendChild(btn);
    });

    quizQuestionsDiv.appendChild(div);
    showPopup(quizPopup);
  }

  quizSubmitBtn.addEventListener("click", () => {
    // not used in single-question approach
  });

  // ========== 9) CELEBRATION POPUP & CONFETTI ==========
  function showCastleCompletePopup() {
    let sc = calculateScore();
    if (sc < 100) return;
    showPopup(castleCompletePopup);
    spawnConfetti();
  }

  function calculateScore() {
    let passwordStr = (difficulty === "pro") ? passwordDisplay.textContent.trim() : currentPasswordArr.join("");
    return calculateScoreInternal(passwordStr);
  }

  function spawnConfetti() {
    if (!confettiContainer) return;
    confettiContainer.innerHTML = "";
    for (let i = 0; i < 25; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = "15px";
      confetti.style.height = "15px";
      confetti.style.borderRadius = "50%";
      confetti.style.backgroundColor = getRandomColor();
      confetti.style.left = Math.random() * 80 + "%";
      confetti.style.top = "-20px";
      confetti.style.zIndex = "9999";
      confettiContainer.appendChild(confetti);

      gsap.to(confetti, {
        y: 350 + Math.random() * 150,
        x: (Math.random() - 0.5) * 300,
        rotation: 360 * Math.random(),
        duration: 2 + Math.random(),
        ease: "power1.out",
        onComplete: () => confetti.remove()
      });
    }
  }

  function getRandomColor() {
    const colors = ["#ff4757", "#2ed573", "#1e90ff", "#ff6b81", "#ffa502", "#70a1ff"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // ========== 10) SHOW/HIDE POPUP UTILS ==========
  function showPopup(overlay) {
    overlay.classList.remove("hidden");
    const content = overlay.querySelector(".popup-content");
    if (content) {
      content.style.opacity = 0;
      content.style.transform = "scale(0.8)";
      gsap.to(content, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }

  function hidePopup(overlay) {
    const content = overlay.querySelector(".popup-content");
    if (content) {
      gsap.to(content, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          overlay.classList.add("hidden");
        }
      });
    }
  }

  // ========== 11) ON LOAD ANIMATIONS & START ==========

  // Animate castle & hacker
  gsap.from(".castle-container", { x: -30, opacity: 0, duration: 1 });
  gsap.from(".hacker-img", { x: 30, opacity: 0, duration: 1 });

  // Animate instructions text => subtle random shake
  function animateInstructions() {
    gsap.to("#cyberInstructions", {
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 5,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut",
      onComplete: () => setTimeout(animateInstructions, 3000 + Math.random() * 2000)
    });
  }
  animateInstructions();
});

/* Utility for random items */
function getRandomItems(arr, count) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/* Utility for array shuffle */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
