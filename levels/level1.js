document.addEventListener("DOMContentLoaded", () => {

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


  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) {
    homeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      pendingLink = homeBtn.getAttribute("href");
      showPopup(leaveGamePopup);
    });
  }


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


  const tipBtn = document.getElementById("tipBtn");
  const tipPopup = document.getElementById("tipPopup");
  const tipContent = document.getElementById("tipContent");

  tipBtn.addEventListener("click", () => {
    const modernTips = difficulty === "rookie"
      ? `
        <h2>Rookie power-ups</h2>
        <p>Drag or tap tiles to drop them into the password box.<br>
        Combine a silly word + numbers + symbols to stack strength fast.<br>
        Try mixing UPPER, lower, 12+ letters, numbers, and symbols.</p>
      `
      : `
        <h2>Pro mode cheatsheet</h2>
        <p>Type straight in the box. Hit 12+ characters with upper, lower,
        numbers, and symbols. Every checkbox that lights up adds to your build speed!</p>
      `;

    tipContent.innerHTML = `${modernTips}<button id="tipCloseBtn" class="popup-btn">Got it!</button>`;
    showPopup(tipPopup);

    const tipCloseBtnDynamic = document.getElementById("tipCloseBtn");
    tipCloseBtnDynamic.addEventListener("click", () => {
      hidePopup(tipPopup);
    });
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
  const requirementGrid = document.getElementById("requirementGrid");
  const shuffleTiles = document.getElementById("shuffleTiles");
  const rookieArea = document.getElementById("rookieArea");


  const hackerImg = document.getElementById("hackerImg");
  const hackerBubble = document.getElementById("hackerBubble");
  let hackerClickCount = 0;


  const cyberInstructions = document.getElementById("cyberInstructions");


  const part1 = document.querySelector(".part1");
  const part2 = document.querySelector(".part2");
  const part3 = document.querySelector(".part3");
  const part4 = document.querySelector(".part4");


  let currentPasswordArr = []; // for rookie
  let typedPassword = "";      // for pro
  let successfulPasswords = 0;


  const rookieWords = ["panda", "pizza", "slime", "sparkle", "nacho", "comet", "llama", "waffle", "cosmic", "bubble", "ninja", "robot", "sneaker", "rainbow", "dino", "flamingo", "MEGA", "EPIC", "HERO", "GAMER"];
  const proWords = ["kingkong", "unicorn", "f00bar", "n!nja", "b@n@n@", "SIGMA", "qu4ntum", "galaxy", "penguin", "stardust", "marvel", "pixel", "R0CK3T", "ST3ALTH"];
  const numbers = ["123", "007", "42", "999", "2023", "000", "1337", "9000", "2468", "808"];
  const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "?", "+", "=", "~"];

  const requirements = [
    { id: "len8", label: "At least 8 characters", check: (str) => str.length >= 8 },
    { id: "len12", label: "12 or more characters", check: (str) => str.length >= 12 },
    { id: "upper", label: "Has an UPPER letter", check: (str) => /[A-Z]/.test(str) },
    { id: "lower", label: "Has a lower letter", check: (str) => /[a-z]/.test(str) },
    { id: "number", label: "Has a number", check: (str) => /\d/.test(str) },
    { id: "symbol", label: "Has a symbol", check: (str) => /[^A-Za-z0-9\s]/.test(str) }
  ];


  const quizPopup = document.getElementById("quizPopup");
  const quizQuestionsDiv = document.getElementById("quizQuestions");
  const quizFeedback = document.getElementById("quizFeedback");

  const allPossibleQuestions = [
    { question: "Which is safer: '123456' or 'C@t42!'?", options: ["123456", "C@t42!"], answer: 1 },
    { question: "Should you share your password with friends?", options: ["Yes", "No"], answer: 1 },
    { question: "What's the best length for a password?", options: ["At least 8 chars", "3-4 is enough", "Doesn't matter"], answer: 0 },
    { question: "Which symbol might help a password?", options: ["@", "No symbols needed"], answer: 0 },
    { question: "Should you use personal info in your password?", options: ["Yes", "No"], answer: 1 },
    { question: "Is 'abc123' strong enough?", options: ["Yes", "No"], answer: 1 },
    { question: "Should you reuse the same password everywhere?", options: ["Yes", "No"], answer: 1 },
    { question: "Is 'Passw0rd!' a good password?", options: ["Yes", "No"], answer: 1 },
    { question: "Which is better: 'password' or 'pA$sW0rd'?", options: ["password", "pA$sW0rd"], answer: 1 },
    { question: "How often should you change your password?", options: ["Never", "Regularly"], answer: 1 },
    { question: "What helps most?", options: ["Length + variety", "Only numbers"], answer: 0 },
    { question: "Is 'Kitty123' strong?", options: ["Super strong", "Needs symbols and more length"], answer: 1 },
    { question: "Why use symbols?", options: ["They add difficulty", "They are useless"], answer: 0 },
    { question: "What about uppercase letters?", options: ["Mixing cases helps", "Only lowercase is fine"], answer: 0 },
    { question: "If a site offers 2FA, should you use it?", options: ["Yes", "No"], answer: 0 }
  ];

  let selectedQuestions = [];   
  let currentQuizIndex = 0;     
  let quizCorrectCount = 0;      


  const castleCompletePopup = document.getElementById("castleCompletePopup"); 
  const castleCompleteClose = document.getElementById("castleCompleteClose");
  const confettiContainer = document.getElementById("confettiContainer");

  if (castleCompleteClose) {
    castleCompleteClose.addEventListener("click", () => {
      hidePopup(castleCompletePopup);
      doReset();
    });
  }


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
      cyberInstructions.innerText = "Drag or tap tiles to build your fortress";
      rookieArea.classList.remove("hidden");
      passwordDisplay.setAttribute("contenteditable", "false");
    } else {
      cyberInstructions.innerText = "Type your password to build your fortress";
      rookieArea.classList.add("hidden");
      passwordDisplay.setAttribute("contenteditable", "true");
    }


    part1.classList.add("piece-hidden");
    part2.classList.add("piece-hidden");
    part3.classList.add("piece-hidden");
    part4.classList.add("piece-hidden");

    currentPasswordArr = [];
    typedPassword = "";
    successfulPasswords = 0;
    feedbackText.textContent = "";
    starRating.textContent = "";
    meterBar.style.width = "0%";
    meterBar.style.background = "linear-gradient(90deg, #ff5f6d, #ffc371)";


    if (difficulty === "pro") {
      passwordDisplay.style.fontSize = "1.35rem";
      passwordDisplay.innerText = "";
    } else {
      passwordDisplay.style.fontSize = "1.05rem";
      createRookieTiles();
    }

    setHackerNormal();
    updatePasswordDisplay();
    buildRequirementGrid();
    updateRequirementGrid("");


    selectedQuestions = getRandomItems(allPossibleQuestions, 3);
    currentQuizIndex = 0;
    quizCorrectCount = 0;
  }

  function createRookieTiles() {
    tileContainer.innerHTML = "";
    let randomWords = getRandomItems(rookieWords, 6);
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
      tile.addEventListener("click", () => {
        if (difficulty === "rookie") {
          currentPasswordArr.push(val);
          updatePasswordDisplay();
          updateStrengthMeter();
        }
      });
      tileContainer.appendChild(tile);
    });
  }

  if (shuffleTiles) {
    shuffleTiles.addEventListener("click", () => {
      createRookieTiles();
    });
  }

  function buildRequirementGrid() {
    if (!requirementGrid) return;
    requirementGrid.innerHTML = "";
    requirements.forEach(req => {
      const card = document.createElement("div");
      card.className = "requirement-card";
      card.id = `req-${req.id}`;

      const status = document.createElement("div");
      status.className = "req-status";
      status.textContent = "✖";

      const label = document.createElement("span");
      label.textContent = req.label;

      card.append(status, label);
      requirementGrid.appendChild(card);
    });
  }

  function updateRequirementGrid(str) {
    if (!requirementGrid) return;
    requirements.forEach(req => {
      const card = document.getElementById(`req-${req.id}`);
      if (!card) return;
      const met = req.check(str);
      const status = card.querySelector(".req-status");
      card.classList.toggle("req-met", met);
      status.classList.toggle("req-met", met);
      status.textContent = met ? "✔" : "✖";
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
        placeholder.textContent = "Drag or tap tiles to drop them";
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
    if (score <= 25) meterBar.style.background = "linear-gradient(90deg, #ff5f6d, #ffc371)";
    else if (score <= 50) meterBar.style.background = "linear-gradient(90deg, #ffc371, #ffd166)";
    else if (score <= 75) meterBar.style.background = "linear-gradient(90deg, #ffd166, #8ae0ff)";
    else meterBar.style.background = "linear-gradient(90deg, #5efc8d, #00c6ff)";

    updateCastleParts(score);
    updateHackerMood(score);
    updateRequirementGrid(passwordStr);
  }

  function calculateScoreInternal(str) {
    if (!str) return 0;
    let met = requirements.filter(req => req.check(str)).length;
    return Math.min(100, Math.round((met / requirements.length) * 100));
  }

  function updateCastleParts(score) {
    const parts = [part1, part2, part3, part4];
    const thresholds = [20, 45, 70, 95];

    parts.forEach((part, index) => {
      if (score >= thresholds[index]) {
        if (part.classList.contains("piece-hidden")) {
          part.classList.remove("piece-hidden");
          gsap.from(part, { opacity: 0, scale: 0.8, y: 12, duration: 0.6, ease: "back.out(1.7)" });
        }
      } else {
        part.classList.add("piece-hidden");
      }
    });
  }

  function updateHackerMood(score) {
    if (!hackerImg) return;
    if (hackerClickCount >= 3) return; // override
    if (score === 0) setHackerNormal();
    else if (score <= 25) setHackerHappy();
    else if (score <= 50) setHackerNormal();
    else if (score <= 75) setHackerNervous();
    else setHackerAngry();
  }

  function setHackerNormal() {
    gsap.killTweensOf(hackerImg);
    hackerImg.src = "../assets/images/hacker-normal.png";
    hackerImg.title = "Just chilling...";
    if (hackerBubble) hackerBubble.textContent = "\"…easy pickings.\"";
    gsap.to(hackerImg, { x:0, y:0, duration:0.1 });
  }

  function setHackerNervous() {
    gsap.killTweensOf(hackerImg);
    hackerImg.src = "../assets/images/hacker-nervous.png";
    hackerImg.title = "Hmm, getting tricky";
    if (hackerBubble) hackerBubble.textContent = "\"Uh oh… castle is forming.\"";
    gsap.to(hackerImg, { rotation: 0, x: 0, y: 0, duration: 0.5 });
  }

  function setHackerHappy() {
    gsap.killTweensOf(hackerImg);
    hackerImg.src = "../assets/images/hacker-happy.png";
    hackerImg.title = "I'm almost in!";
    if (hackerBubble) hackerBubble.textContent = "\"Mwahaha, so weak!\"";
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
    if (hackerBubble) hackerBubble.textContent = "\"Nooo! Strong password!\"";
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
    let finalScore = calculateScoreInternal(passwordStr);

    let stars = finalScore >= 95 ? 3 : finalScore >= 70 ? 2 : finalScore >= 45 ? 1 : 0;
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
        startQuiz();
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
    meterBar.style.background = "linear-gradient(90deg, #ff5f6d, #ffc371)";
    feedbackText.textContent = "";
    starRating.textContent = "";
    part1.classList.add("piece-hidden");
    part2.classList.add("piece-hidden");
    part3.classList.add("piece-hidden");
    part4.classList.add("piece-hidden");
    buildRequirementGrid();
    updateRequirementGrid("");
    setHackerNormal();
    resetBtn.innerHTML = "Reset";
  }


  function startQuiz() {
    selectedQuestions = getRandomItems(allPossibleQuestions, 3);
    currentQuizIndex = 0;
    quizCorrectCount = 0;
    showNextQuizQuestion();
  }

  function showNextQuizQuestion() {
    if (currentQuizIndex >= selectedQuestions.length) {

      quizQuestionsDiv.innerHTML = "";
      quizFeedback.innerHTML = "You got all 3 questions correct! Great job!<br>";
      spawnConfettiQuiz(); 


      const againBtn = document.createElement("button");
      againBtn.className = "popup-btn";
      againBtn.textContent = "Play Again";
      againBtn.addEventListener("click", () => {
        hidePopup(quizPopup);
        doReset();
      });
      quizQuestionsDiv.appendChild(againBtn);

      const nextBtn = document.createElement("button");
      nextBtn.className = "popup-btn";
      nextBtn.textContent = "Next Level";
      nextBtn.addEventListener("click", () => {
        window.location.href = "level2.html";
      });
      quizQuestionsDiv.appendChild(nextBtn);

      showPopup(quizPopup);
      return;
    }


    const q = selectedQuestions[currentQuizIndex];
    quizQuestionsDiv.innerHTML = "";
    quizFeedback.textContent = "";
    const div = document.createElement("div");
    div.className = "quiz-question";
    const p = document.createElement("p");
    p.innerText = q.question;
    p.style.fontSize = "1.5rem";
    p.style.marginBottom = "15px";
    div.appendChild(p);

    const indexedOptions = q.options.map((opt, idx) => ({ opt, idx }));
    shuffleArray(indexedOptions);

    indexedOptions.forEach(({ opt, idx }) => {
      const btn = document.createElement("button");
      btn.className = "popup-btn";
      btn.style.margin = "5px";
      btn.innerText = opt;
      btn.addEventListener("click", () => {
        if (idx === q.answer) {

          currentQuizIndex++;
          hidePopup(quizPopup);
          setTimeout(() => showNextQuizQuestion(), 400);
        } else {

          quizFeedback.textContent = "Nope, try again!";
          shakePopup(quizPopup);
        }
      });
      div.appendChild(btn);
    });
    quizQuestionsDiv.appendChild(div);
    showPopup(quizPopup);
  }

  function shakePopup(overlay) {
    const content = overlay.querySelector(".popup-content");
    gsap.fromTo(content, { x:0 }, {
      x:10,
      duration:0.1,
      yoyo:true,
      repeat:3,
      ease:"power1.inOut"
    });
  }

  function spawnConfettiQuiz() {
    for (let i=0; i<20; i++) {
      const conf = document.createElement("div");
      conf.style.position = "absolute";
      conf.style.width = "15px";
      conf.style.height = "15px";
      conf.style.borderRadius = "50%";
      conf.style.backgroundColor = getRandomColor();
      conf.style.left = Math.random()*80 + "%";
      conf.style.top = "0px";
      conf.style.zIndex = 9999;
      quizQuestionsDiv.appendChild(conf);
      gsap.to(conf, {
        y:150 + Math.random()*100,
        x:(Math.random()-0.5)*200,
        rotation:360*Math.random(),
        duration:1.5+Math.random(),
        ease:"power1.out",
        onComplete: () => conf.remove()
      });
    }
  }


  function showCastleCompletePopup() {
    let sc = calculateScore();
    if (sc < 95) return;
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


  gsap.from(".castle-container", { x: -30, opacity: 0, duration: 1 });
  gsap.from(".hacker-img", { x: 30, opacity: 0, duration: 1 });
});


function getRandomItems(arr, count) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}


function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
