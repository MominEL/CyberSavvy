document.addEventListener("DOMContentLoaded", () => {

  const modalOverlay = document.getElementById("modalOverlay");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalContent = document.getElementById("modalContent");

  let focusedElementBeforeModal = null;
  let currentModalType = null;

  const bubbleLinks = document.querySelectorAll(".bubble-bar-right a");
  let pendingLink = null;

  bubbleLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      pendingLink = link.getAttribute("href");
      showLeaveModal();
    });
  });

  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) {
    homeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      pendingLink = homeBtn.getAttribute("href");
      showLeaveModal();
    });
  }

  let difficulty = "rookie";

  showDifficultyModal();

  const tipBtn = document.getElementById("tipBtn");
  tipBtn.addEventListener("click", () => {
    showTipModal();
  });

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

  const tileContainer = document.getElementById("tileContainer");
  const passwordDisplay = document.getElementById("passwordDisplay");
  const meterBar = document.getElementById("meterBar");
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");
  const feedbackText = document.getElementById("feedbackText");
  const starRating = document.getElementById("starRating");

  const hackerImg = document.getElementById("hackerImg");
  let hackerClickCount = 0;

  const cyberInstructions = document.getElementById("cyberInstructions");

  const part1 = document.querySelector(".part1");
  const part2 = document.querySelector(".part2");
  const part3 = document.querySelector(".part3");
  const part4 = document.querySelector(".part4");

  let currentPasswordArr = [];
  let typedPassword = "";
  let successfulPasswords = 0;

  const rookieWords = ["cat", "sun", "panda", "pizza", "sigma", "toy", "frog"];
  const proWords = ["kingkong", "unicorn", "f00bar", "n!nja", "b@n@n@", "SIGMA", "qu4ntum"];
  const numbers = ["123", "007", "42", "999", "2023", "000"];
  const symbols = ["!", "@", "#", "$", "%", "^", "&"];

  const allPossibleQuestions = [
    { question: "Which password is more secure?", options: ["123456", "C@t42!M0on"], answer: 1, type: "multiple" },
    { question: "Should you share your password with friends?", options: ["Yes", "No"], answer: 1, type: "truefalse" },
    { question: "What's the minimum recommended length for a strong password?", options: ["At least 12 characters", "5-6 characters", "Doesn't matter"], answer: 0, type: "multiple" },
    { question: "Including symbols like @ or # makes passwords stronger.", options: ["True", "False"], answer: 0, type: "truefalse" },
    { question: "Is it safe to use personal information (like your birthday) in passwords?", options: ["Yes", "No"], answer: 1, type: "truefalse" },
    { question: "Is 'abc123' a strong password?", options: ["Yes", "No"], answer: 1, type: "truefalse" },
    { question: "You should reuse the same password across all your accounts.", options: ["True", "False"], answer: 1, type: "truefalse" },
    { question: "Which password is better?", options: ["password", "pA$sW0rd!2024"], answer: 1, type: "multiple" },
    { question: "How often should you change important passwords?", options: ["Never", "Every few months"], answer: 1, type: "multiple" },
    { question: "Using a mix of uppercase and lowercase letters improves password security.", options: ["True", "False"], answer: 0, type: "truefalse" },
    { question: "What makes a password most vulnerable?", options: ["Being too long", "Using dictionary words only", "Having symbols"], answer: 1, type: "multiple" },
    { question: "Password managers can help you create and store strong passwords.", options: ["True", "False"], answer: 0, type: "truefalse" },
    { question: "Is 'Passw0rd!' considered a strong password?", options: ["Yes", "No"], answer: 1, type: "truefalse" },
    { question: "Two-factor authentication adds an extra layer of security.", options: ["True", "False"], answer: 0, type: "truefalse" },
    { question: "Which is the strongest password?", options: ["JohnSmith1990", "Tr0ub4dor&3", "correct horse battery staple"], answer: 2, type: "multiple" },
    { question: "Writing passwords on sticky notes is secure if you hide them well.", options: ["True", "False"], answer: 1, type: "truefalse" },
    { question: "What should you do if you suspect your password has been compromised?", options: ["Nothing", "Change it immediately"], answer: 1, type: "multiple" },
    { question: "Common phrases from songs or movies make good passwords.", options: ["True", "False"], answer: 1, type: "truefalse" },
    { question: "Which is the most important factor in password strength?", options: ["Complexity and length", "Easy to remember", "Matches username"], answer: 0, type: "multiple" },
    { question: "Using numbers to replace letters (like '3' for 'E') significantly increases security.", options: ["True", "False"], answer: 1, type: "truefalse" },
    { question: "Public WiFi networks are safe for entering passwords.", options: ["True", "False"], answer: 1, type: "truefalse" },
    { question: "What's the best approach for creating memorable strong passwords?", options: ["Use random words together", "Use your pet's name", "Use your phone number"], answer: 0, type: "multiple" },
    { question: "A password with 20 characters of only lowercase letters is weaker than 8 mixed characters.", options: ["True", "False"], answer: 1, type: "truefalse" },
    { question: "Biometric authentication (fingerprint, face ID) can replace passwords entirely.", options: ["True", "False"], answer: 1, type: "truefalse" }
  ];

  let selectedQuestions = [];
  let currentQuizIndex = 0;
  let quizCorrectCount = 0;
  let quizAnswers = [];

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

  function animateInstructions() {
    gsap.to("#cyberInstructions", {
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 5,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut",
      onComplete: () => {
        setTimeout(animateInstructions, 3000 + Math.random() * 2000);
      }
    });
  }
  animateInstructions();

  function initGame() {
    if (difficulty === "rookie") {
      cyberInstructions.innerText = "Drag tiles to build your fortress!";
    } else {
      cyberInstructions.innerText = "Type your password to build your fortress!";
    }

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

    if (difficulty === "pro") {
      passwordDisplay.setAttribute("contenteditable", "true");
      passwordDisplay.style.fontSize = "2rem";
      tileContainer.classList.add("hidden");
      passwordDisplay.innerText = "";
    } else {
      passwordDisplay.setAttribute("contenteditable", "false");
      passwordDisplay.style.fontSize = "1rem";
      tileContainer.classList.remove("hidden");
      createRookieTiles();
    }

    setHackerNormal();
    updatePasswordDisplay();

    selectedQuestions = getRandomItems(allPossibleQuestions, 5);
    selectedQuestions.forEach(q => {
      q.options = shuffleArray([...q.options]);
      const correctOption = q.options[q.answer];
      q.answer = q.options.indexOf(correctOption);
    });
    currentQuizIndex = 0;
    quizCorrectCount = 0;
    quizAnswers = [];
  }

  function createRookieTiles() {
    tileContainer.innerHTML = "";
    let randomWords = getRandomItems(rookieWords, 3);
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

  passwordDisplay.addEventListener("input", () => {
    if (difficulty === "pro") {
      typedPassword = passwordDisplay.textContent.trim();
      updateStrengthMeter();
    }
  });

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
      if (passwordDisplay.textContent.trim() !== typedPassword) {
        passwordDisplay.textContent = typedPassword;
      }
    } else {
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
    if (hackerClickCount >= 3) return;
    if (score === 0) setHackerNormal();
    else if (score < 100) setHackerHappy();
    else setHackerAngry();
  }

  function setHackerNormal() {
    gsap.killTweensOf(hackerImg);
    hackerImg.src = "../assets/images/hacker-normal.png";
    hackerImg.title = "Just chilling...";
    gsap.to(hackerImg, { x: 0, y: 0, duration: 0.1 });
  }

  function setHackerHappy() {
    gsap.killTweensOf(hackerImg);
    hackerImg.src = "../assets/images/hacker-happy.png";
    hackerImg.title = "I'm almost in!";
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
    let finalScore = calculateScoreInternal(passwordStr) / 25;

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

      if (successfulPasswords >= 2) {
        setTimeout(() => startQuiz(), 1000);
      }
      showCastleCompleteModal();
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
    resetBtn.innerHTML = "🔄 Reset";
    if (difficulty === "rookie") {
      createRookieTiles();
    }
    updatePasswordDisplay();
  }

  function startQuiz() {
    selectedQuestions = getRandomItems(allPossibleQuestions, 5);
    selectedQuestions.forEach(q => {
      const originalAnswer = q.answer;
      const correctOption = q.options[originalAnswer];
      q.options = shuffleArrayCopy(q.options);
      q.answer = q.options.indexOf(correctOption);
    });
    currentQuizIndex = 0;
    quizCorrectCount = 0;
    quizAnswers = [];
    showQuizQuestion();
  }

  function showQuizQuestion() {
    if (currentQuizIndex >= selectedQuestions.length) {
      showQuizResults();
      return;
    }

    const q = selectedQuestions[currentQuizIndex];
    const progressHTML = selectedQuestions.map((_, i) => {
      let dotClass = "quiz-progress-dot";
      if (i < currentQuizIndex) dotClass += " completed";
      if (i === currentQuizIndex) dotClass += " active";
      return `<div class="${dotClass}"></div>`;
    }).join("");

    const optionsHTML = q.options.map((opt, i) => 
      `<button class="modal-btn quiz-option-btn" data-index="${i}">${opt}</button>`
    ).join("");

    modalBody.innerHTML = `
      <div class="quiz-progress">${progressHTML}</div>
      <p class="quiz-question-text">${q.question}</p>
      <div class="quiz-options">${optionsHTML}</div>
      <div class="quiz-feedback" id="quizFeedback" style="opacity: 0;"></div>
    `;

    const optionButtons = modalBody.querySelectorAll(".quiz-option-btn");
    optionButtons.forEach(btn => {
      btn.addEventListener("click", () => handleQuizAnswer(parseInt(btn.dataset.index)));
    });

    currentModalType = "quiz";
    showModal();
  }

  function handleQuizAnswer(selectedIndex) {
    const q = selectedQuestions[currentQuizIndex];
    const feedbackDiv = document.getElementById("quizFeedback");
    const optionButtons = modalBody.querySelectorAll(".quiz-option-btn");

    optionButtons.forEach(btn => btn.disabled = true);

    if (selectedIndex === q.answer) {
      quizCorrectCount++;
      quizAnswers.push(true);
      feedbackDiv.textContent = "Correct! Well done!";
      feedbackDiv.className = "quiz-feedback correct";
      gsap.to(feedbackDiv, { opacity: 1, duration: 0.3 });

      setTimeout(() => {
        currentQuizIndex++;
        showQuizQuestion();
      }, 1500);
    } else {
      quizAnswers.push(false);
      feedbackDiv.textContent = "Not quite! The correct answer is: " + q.options[q.answer];
      feedbackDiv.className = "quiz-feedback incorrect";
      gsap.to(feedbackDiv, { opacity: 1, duration: 0.3 });
      shakeModal();

      setTimeout(() => {
        currentQuizIndex++;
        showQuizQuestion();
      }, 2500);
    }
  }

  function showQuizResults() {
    const percentage = Math.round((quizCorrectCount / selectedQuestions.length) * 100);
    let message = "";
    let emoji = "";

    if (percentage === 100) {
      message = "Perfect score! You're a password security expert!";
      emoji = "🎉";
    } else if (percentage >= 80) {
      message = "Great job! You know your password security!";
      emoji = "🌟";
    } else if (percentage >= 60) {
      message = "Good effort! Keep learning about password safety!";
      emoji = "👍";
    } else {
      message = "Keep practicing! Review the password tips and try again!";
      emoji = "💪";
    }

    modalBody.innerHTML = `
      <div class="confetti-container" id="resultConfetti"></div>
      <h2>${emoji} Quiz Complete!</h2>
      <p style="font-size: 2rem; margin: 20px 0; color: #39FF14;">
        ${quizCorrectCount} / ${selectedQuestions.length} Correct
      </p>
      <p style="font-size: 1.3rem; margin-bottom: 25px;">${message}</p>
      <div class="modal-buttons">
        <button class="modal-btn modal-btn-secondary" id="quizPlayAgain">Play Again</button>
        <button class="modal-btn" id="quizNextLevel">Next Level</button>
      </div>
    `;

    if (percentage >= 60) {
      spawnConfettiInContainer("resultConfetti");
    }

    document.getElementById("quizPlayAgain").addEventListener("click", () => {
      hideModal();
      doReset();
    });

    document.getElementById("quizNextLevel").addEventListener("click", () => {
      window.location.href = "level2.html";
    });

    currentModalType = "quizResults";
    showModal();
  }

  function showDifficultyModal() {
    modalBody.innerHTML = `
      <h2>Choose Your Challenge!</h2>
      <p>Select a difficulty mode to begin your fortress building adventure:</p>
      <div class="modal-buttons">
        <button class="modal-btn modal-btn-secondary" id="rookieBtn">
          🎯 Rookie<br><small style="font-size: 0.85rem;">Drag & Drop</small>
        </button>
        <button class="modal-btn" id="proBtn">
          🏆 Pro<br><small style="font-size: 0.85rem;">Type Password</small>
        </button>
      </div>
    `;

    document.getElementById("rookieBtn").addEventListener("click", () => {
      difficulty = "rookie";
      hideModal();
      initGame();
    });

    document.getElementById("proBtn").addEventListener("click", () => {
      difficulty = "pro";
      hideModal();
      initGame();
    });

    currentModalType = "difficulty";
    showModal();
  }

  function showLeaveModal() {
    modalBody.innerHTML = `
      <h2>Leave the Game?</h2>
      <p>Are you sure you want to leave? Your progress will be lost.</p>
      <div class="modal-buttons">
        <button class="modal-btn modal-btn-danger" id="leaveYes">Yes, Leave</button>
        <button class="modal-btn" id="leaveNo">No, Stay</button>
      </div>
    `;

    document.getElementById("leaveYes").addEventListener("click", () => {
      if (pendingLink) window.location.href = pendingLink;
    });

    document.getElementById("leaveNo").addEventListener("click", () => {
      hideModal();
      pendingLink = null;
    });

    currentModalType = "leave";
    showModal();
  }

  function showTipModal() {
    let tipHTML = "";
    if (difficulty === "rookie") {
      tipHTML = `
        <h2>💡 Hint (Rookie Mode)</h2>
        <p>Drag words, numbers, and symbols into the password area to build your fortress!</p>
        <p>Each piece you add strengthens your castle. Try to include:</p>
        <ul style="text-align: left; max-width: 400px; margin: 20px auto; line-height: 1.8;">
          <li>Multiple word tiles for length</li>
          <li>Numbers for added complexity</li>
          <li>Symbols for maximum strength</li>
        </ul>
        <div class="modal-buttons">
          <button class="modal-btn" id="tipClose">Got it!</button>
        </div>
      `;
    } else {
      tipHTML = `
        <h2>💡 Hint (Pro Mode)</h2>
        <p>Type a strong password in the box to build your fortress!</p>
        <p>Strong passwords should have:</p>
        <ul style="text-align: left; max-width: 400px; margin: 20px auto; line-height: 1.8;">
          <li>At least 12 characters</li>
          <li>Mix of uppercase & lowercase</li>
          <li>Numbers and symbols</li>
          <li>No personal information</li>
        </ul>
        <div class="modal-buttons">
          <button class="modal-btn" id="tipClose">Got it!</button>
        </div>
      `;
    }

    modalBody.innerHTML = tipHTML;
    document.getElementById("tipClose").addEventListener("click", () => hideModal());

    currentModalType = "tip";
    showModal();
  }

  function showCastleCompleteModal() {
    modalBody.innerHTML = `
      <div class="confetti-container" id="castleConfetti"></div>
      <img src="../assets/images/castle-part4.png" alt="Castle Fully Built" class="castle-complete-image" />
      <h2>🏰 Fortress Complete!</h2>
      <p>Your password is strong enough to defend against hackers!</p>
      <div class="modal-buttons">
        <button class="modal-btn" id="castleCompleteClose">Continue</button>
      </div>
    `;

    spawnConfettiInContainer("castleConfetti");

    document.getElementById("castleCompleteClose").addEventListener("click", () => {
      hideModal();
    });

    currentModalType = "castleComplete";
    showModal();
  }

  function showModal() {
    focusedElementBeforeModal = document.activeElement;
    modalOverlay.classList.remove("hidden");
    modalOverlay.setAttribute("aria-hidden", "false");

    gsap.fromTo(modalBackdrop, 
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );

    gsap.fromTo(modalContent,
      { opacity: 0, scale: 0.9, y: -30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.4)" }
    );

    setTimeout(() => {
      const firstButton = modalBody.querySelector("button");
      if (firstButton) firstButton.focus();
    }, 100);

    document.addEventListener("keydown", handleModalKeydown);
  }

  function hideModal() {
    const tl = gsap.timeline({
      onComplete: () => {
        modalOverlay.classList.add("hidden");
        modalOverlay.setAttribute("aria-hidden", "true");
        if (focusedElementBeforeModal) {
          focusedElementBeforeModal.focus();
        }
      }
    });

    tl.to(modalContent, { opacity: 0, scale: 0.9, y: -20, duration: 0.25, ease: "power2.in" })
      .to(modalBackdrop, { opacity: 0, duration: 0.2 }, "<");

    document.removeEventListener("keydown", handleModalKeydown);
  }

  function shakeModal() {
    gsap.fromTo(modalContent, 
      { x: 0 }, 
      { x: 10, duration: 0.1, yoyo: true, repeat: 5, ease: "power1.inOut" }
    );
  }

  function handleModalKeydown(e) {
    if (e.key === "Escape" && currentModalType !== "difficulty") {
      hideModal();
    }

    if (e.key === "Tab") {
      const focusableElements = modalContent.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  modalClose.addEventListener("click", () => {
    if (currentModalType !== "difficulty") {
      hideModal();
    }
  });

  modalBackdrop.addEventListener("click", () => {
    if (currentModalType !== "difficulty") {
      hideModal();
    }
  });

  function calculateScore() {
    let passwordStr = (difficulty === "pro") ? passwordDisplay.textContent.trim() : currentPasswordArr.join("");
    return calculateScoreInternal(passwordStr);
  }

  function spawnConfettiInContainer(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = "12px";
      confetti.style.height = "12px";
      confetti.style.borderRadius = "50%";
      confetti.style.backgroundColor = getRandomColor();
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = "0";
      confetti.style.zIndex = "9999";
      container.appendChild(confetti);

      gsap.to(confetti, {
        y: 300 + Math.random() * 200,
        x: (Math.random() - 0.5) * 400,
        rotation: 360 * Math.random() * 3,
        duration: 2 + Math.random() * 2,
        ease: "power1.out",
        opacity: 0,
        onComplete: () => confetti.remove()
      });
    }
  }

  function getRandomColor() {
    const colors = ["#ff4757", "#2ed573", "#1e90ff", "#ff6b81", "#ffa502", "#70a1ff", "#39FF14", "#f368e0"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  gsap.from(".castle-container", { x: -30, opacity: 0, duration: 1 });
  gsap.from(".hacker-img", { x: 30, opacity: 0, duration: 1 });
  animateInstructions();
});

function getRandomItems(arr, count) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleArrayCopy(arr) {
  const copy = [...arr];
  return shuffleArray(copy);
}
