document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Intro Typing Effect ---------- */
  const introTextEl = document.getElementById("typingIntro");
  const introLines = [
    "Welcome, Cyber Investigator!",
    "A series of suspicious emails await you.",
    "Click on red highlighted elements to reveal clues.",
    "Then decide: is it Legit or Phishing?",
    "Be quick—but careful! (Timer optional for advanced players.)",
    "Good luck!"
  ];
  let lineIndex = 0, charIndex = 0;
  function typeIntro() {
    if (lineIndex < introLines.length) {
      if (charIndex < introLines[lineIndex].length) {
        introTextEl.innerHTML += introLines[lineIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeIntro, 40);
      } else {
        introTextEl.innerHTML += "<br/>";
        lineIndex++;
        charIndex = 0;
        setTimeout(typeIntro, 400);
      }
    }
  }
  typeIntro();

  /* ---------- Start Game Button ---------- */
  const introPopup = document.getElementById("introPopup");
  const startGameBtn = document.getElementById("startGameBtn");
  startGameBtn.addEventListener("mouseenter", () => {
    gsap.to(startGameBtn, { scale: 1.1, duration: 0.3, ease: "back.out(1.7)" });
  });
  startGameBtn.addEventListener("mouseleave", () => {
    gsap.to(startGameBtn, { scale: 1, duration: 0.3, ease: "power2.inOut" });
  });
  startGameBtn.addEventListener("click", () => {
    gsap.to(introPopup, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        introPopup.style.display = "none";
        startGame();
      }
    });
  });

  /* ---------- Particles.js Setup ---------- */
  particlesJS("particles-js", {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: "#39ff14" },
      shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
      opacity: { value: 0.5 },
      size: { value: 4, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#39ff14",
        opacity: 0.4,
        width: 1
      },
      move: { enable: true, speed: 1, out_mode: "out" }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: false, mode: "push" },
        resize: true
      },
      modes: { repulse: { distance: 100, duration: 0.4 } }
    },
    retina_detect: true
  });

  /* ---------- Global State ---------- */
  let score = 0;
  let lives = 3;
  let currentEmail = null;
  let unlockedIndex = 0; // Only the first email unlocked in a stage
  let classifiedCount = 0;
  let stageLives = 3;
  let currentStageIndex = 0;
  let stages = [];
  let stageEmails = [];
  const totalStages = 3; // example: 3 sub-stages
  const enableTimer = false; // set to true for timed challenge
  let emailTimer;
  const timeLimit = 20; // seconds per email if timer enabled

  // ---------- Master Email Pool (with redflag elements and properties) ----------
  const emailPoolMaster = [
    {
      sender: "freegift@amazon-rewards.com",
      subject: "Claim Your FREE $100 Gift Card!",
      content: `
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="assets/images/amazon-logo.png" alt="Amazon" style="width:60px;">
          <div>
            <strong>From:</strong> <span class="redflag" data-info="Suspicious sender">freegift@amazon-rewards.com</span><br>
            <strong>Subject:</strong> 🎁 Claim Your FREE $100 Gift Card Now!
          </div>
        </div>
        <hr>
        <p>Hurry, <span class="redflag" data-info="Urgent language">Claim NOW!</span> before it expires!</p>
        <button class="email-action">CLAIM NOW</button>
        <br><br>
        <a href="#" class="email-link redflag" data-url="http://amaz0n-freegift.com" data-info="The URL looks off">amaz0n-freegift.com</a>
      `,
      phishing: true,
      difficulty: "easy",
      explanation: "Fake domain 'amaz0n', suspicious sender and urgent language.",
      redFlagsFound: 0,
      redFlagsRequired: 1
    },
    {
      sender: "security@paypal-support.com",
      subject: "URGENT: Your Account Has Been Suspended!",
      content: `
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="assets/images/paypal-logo.png" alt="PayPal" style="width:60px;">
          <div>
            <strong>From:</strong> <span class="redflag" data-info="Suspicious email">security@paypal-support.com</span><br>
            <strong>Subject:</strong> 🚨 URGENT: Your Account Has Been Suspended!
          </div>
        </div>
        <hr>
        <p>Your account has been locked due to <span class="redflag" data-info="Panic-inducing language">suspicious activity</span>.</p>
        <button class="email-action" style="background:#0070ba; color:#fff;">SECURE NOW</button>
        <br><br>
        <a href="#" class="email-link redflag" data-url="http://paypal-security-login.com" data-info="The login URL is not official">paypal-security-login.com</a>
      `,
      phishing: true,
      difficulty: "easy",
      explanation: "Sender's email is off and the link leads to a fake login page.",
      redFlagsFound: 0,
      redFlagsRequired: 1
    },
    {
      sender: "friend@example.com",
      subject: "A Friend in Trouble",
      content: `
        <strong>From:</strong> friend@example.com<br>
        <strong>Subject:</strong> A Friend in Trouble
        <hr>
        <p>Hey, can you do me a huge favor? I <span class="redflag" data-info="Unusual request">lost my phone</span> and need your phone number to recover my account!</p>
      `,
      phishing: true,
      difficulty: "medium",
      explanation: "Social engineering scam requesting personal data.",
      redFlagsFound: 0,
      redFlagsRequired: 1
    },
    {
      sender: "noreply@bank.com",
      subject: "Your Monthly Statement",
      content: `
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="assets/images/bank-logo.png" alt="Bank" style="width:60px;">
          <div>
            <strong>From:</strong> noreply@bank.com<br>
            <strong>Subject:</strong> Your Monthly Statement
          </div>
        </div>
        <hr>
        <p>Here is your statement for this month. Thank you for banking with us.</p>
        <button class="email-action" style="background:#004c99; color:#fff;">VIEW STATEMENT</button>
      `,
      phishing: false,
      difficulty: "easy",
      explanation: "Legitimate monthly statement.",
      redFlagsFound: 0,
      redFlagsRequired: 0
    },
    {
      sender: "invoice@service.com",
      subject: "Invoice Due: Immediate Payment Required",
      content: `
        <strong>From:</strong> invoice@service.com<br>
        <strong>Subject:</strong> Invoice Due: Immediate Payment Required
        <hr>
        <p>Your invoice of <strong>$250</strong> is due <span class="redflag" data-info="Threatening language">immediately</span>. Please pay now.</p>
        <button class="email-action" style="background:red; color:#fff;">PAY NOW</button>
      `,
      phishing: true,
      difficulty: "medium",
      explanation: "Fake invoice with urgent, threatening language.",
      redFlagsFound: 0,
      redFlagsRequired: 1
    },
    {
      sender: "promo@shopnow.com",
      subject: "Limited Time Offer – 50% Off!",
      content: `
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="assets/images/shop-logo.png" alt="ShopNow" style="width:60px;">
          <div>
            <strong>From:</strong> promo@shopnow.com<br>
            <strong>Subject:</strong> Limited Time Offer – 50% Off!
          </div>
        </div>
        <hr>
        <p>Enjoy huge discounts on top brands for a limited time!</p>
        <button class="email-action" style="background:#ffce00;">SHOP NOW</button>
      `,
      phishing: false,
      difficulty: "easy",
      explanation: "Legitimate promotional email.",
      redFlagsFound: 0,
      redFlagsRequired: 0
    },
    {
      sender: "help@techsupport.com",
      subject: "Free PC Cleanup!",
      content: `
        <strong>From:</strong> help@techsupport.com<br>
        <strong>Subject:</strong> Free PC Cleanup!
        <hr>
        <p>We noticed your computer might be slow. Click below to <span class="redflag" data-info="Too good to be true">fix all issues</span> instantly!</p>
        <button class="email-action" style="background:orange; color:#fff;">CLEAN MY PC</button>
        <br><br>
        <a href="#" class="email-link redflag" data-url="http://techsupport-scam.com" data-info="Suspicious URL">techsupport-scam.com</a>
      `,
      phishing: true,
      difficulty: "hard",
      explanation: "Fake tech support scam offering free cleanup.",
      redFlagsFound: 0,
      redFlagsRequired: 1
    },
    {
      sender: "rewards@storeonline.com",
      subject: "You Won a Prize!",
      content: `
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="assets/images/trophy-icon.png" alt="Prize" style="width:60px;">
          <div>
            <strong>From:</strong> rewards@storeonline.com<br>
            <strong>Subject:</strong> You Won a Prize!
          </div>
        </div>
        <hr>
        <p>Congratulations! You've been selected to receive a gift. <span class="redflag" data-info="Unexpected prize">Claim now</span> to claim your prize.</p>
        <button class="email-action" style="background:gold; color:#333;">CLAIM PRIZE</button>
      `,
      phishing: true,
      difficulty: "hard",
      explanation: "Scam email with a fake prize offer.",
      redFlagsFound: 0,
      redFlagsRequired: 1
    },
    {
      sender: "noreply@university.edu",
      subject: "Important Semester Update",
      content: `
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="assets/images/book-icon.png" alt="Book" style="width:60px;">
          <div>
            <strong>From:</strong> noreply@university.edu<br>
            <strong>Subject:</strong> Important Semester Update
          </div>
        </div>
        <hr>
        <p>Please review the latest changes to our academic calendar.</p>
        <button class="email-action" style="background:#0066cc; color:#fff;">VIEW UPDATE</button>
      `,
      phishing: false,
      difficulty: "easy",
      explanation: "Legitimate email about academic updates.",
      redFlagsFound: 0,
      redFlagsRequired: 0
    }
  ];
  
  // Divide selected emails into sub-stages (each stage will have 2 emails; last stage may have 1)
  function setupStages() {
    shuffleArray(emailPoolMaster);
    let num = Math.floor(Math.random() * 2) + 4; // randomly 4 or 5 emails
    let chosen = emailPoolMaster.slice(0, num);
    // Reassign sequential id and reset red flags
    chosen.forEach((email, idx) => { email.id = idx; email.redFlagsFound = 0; });
    let stages = [];
    for (let i = 0; i < chosen.length; i += 2) {
      stages.push(chosen.slice(i, i + 2));
    }
    return stages;
  }
  stages = setupStages();
  currentStageIndex = 0;
  stageEmails = stages[currentStageIndex];
  unlockedIndex = 0;
  classifiedCount = 0;
  lives = 3;
  stageLives = 3;
  
  // Utility: shuffle array in-place
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  // Optional per-email timer
  function startEmailTimer() {
    if (!enableTimer) return;
    let timeLeft = timeLimit;
    emailTimer = setInterval(() => {
      timeLeft--;
      // You can update a timer display here if desired.
      if (timeLeft <= 0) {
        clearInterval(emailTimer);
        showInPagePopup("Time's up! You missed this email.");
        lives--;
        stageLives--;
        checkLives();
      }
    }, 1000);
  }
  function stopEmailTimer() {
    if (emailTimer) clearInterval(emailTimer);
  }
  
  // Start or restart game
  function startGame() {
    score = 0;
    lives = 3;
    stageLives = 3;
    classifiedCount = 0;
    currentStageIndex = 0;
    stages = setupStages();
    stageEmails = stages[currentStageIndex];
    unlockedIndex = 0;
    loadInbox();
  }
  
  const inboxEl = document.getElementById("emailList");
  const emailPreviewEl = document.getElementById("emailPreview");
  
  // Load the inbox for the current stage
  function loadInbox() {
    inboxEl.innerHTML = "";
    stageEmails.forEach((email) => {
      let li = document.createElement("li");
      li.innerHTML = `<strong>${email.sender}</strong><br>${email.subject}`;
      if (email.id > unlockedIndex) {
        let lockImg = document.createElement("img");
        lockImg.src = "assets/images/lock-icon.png";
        lockImg.className = "lock-icon";
        li.appendChild(lockImg);
      }
      li.addEventListener("click", () => {
        if (email.id > unlockedIndex) {
          showInPagePopup("You must correctly classify the previous email to unlock this one!");
        } else {
          showEmail(email);
        }
      });
      inboxEl.appendChild(li);
    });
  }
  
  // Show email in preview panel and attach redflag click events
  function showEmail(email) {
    currentEmail = email;
    emailPreviewEl.innerHTML = email.content;
    gsap.fromTo(emailPreviewEl, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 });
    stopEmailTimer();
    startEmailTimer();
  
    // Attach click listeners to redflag elements
    const redflags = emailPreviewEl.querySelectorAll(".redflag");
    redflags.forEach((elem) => {
      elem.addEventListener("click", function handler() {
        if (!this.classList.contains("flagged")) {
          this.classList.add("flagged");
          currentEmail.redFlagsFound++;
          alert(this.getAttribute("data-info"));
        }
        this.removeEventListener("click", handler);
      });
    });
  
    // Attach listener to any CTA button – trigger hack simulation if clicked in a phishing email
    const actions = emailPreviewEl.querySelectorAll(".email-action");
    actions.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentEmail.phishing) {
          triggerHackSimulation();
          lives--;
          stageLives--;
          updateScore(-5);
          checkLives();
        }
      });
    });
  }
  
  // Update score and progress display
  function updateScore(points) {
    score += points;
    document.getElementById("scoreLabel").textContent = "Score: " + score;
    let floatEl = document.createElement("div");
    floatEl.className = "floating-score";
    floatEl.textContent = points > 0 ? `+${points}` : `${points}`;
    document.getElementById("scoreLabel").parentNode.appendChild(floatEl);
    gsap.to(floatEl, { y: -30, opacity: 0, duration: 1, onComplete: () => floatEl.remove() });
    let percent = Math.min(100, Math.floor((score / 100) * 100));
    document.getElementById("progressBar").style.width = percent + "%";
    document.getElementById("progressPercentLabel").textContent = percent + "%";
  }
  
  // Classification buttons
  const legitBtn = document.getElementById("legitBtn");
  const phishingBtn = document.getElementById("phishingBtn");
  const hintBtn = document.getElementById("hintBtn");
  
  legitBtn.addEventListener("click", () => {
    if (!currentEmail) return;
    if (currentEmail.redFlagsRequired > 0 && currentEmail.redFlagsFound < currentEmail.redFlagsRequired) {
      showInPagePopup("Identify at least one suspicious element before classifying!");
      return;
    }
    let correct = false;
    if (!currentEmail.phishing) {
      updateScore(10);
      showCelebrationPopup("Correct! This email is legitimate. " + getTrivia());
      correct = true;
    } else {
      updateScore(-5);
      showInPagePopup("Incorrect. " + currentEmail.explanation);
      lives--;
      stageLives--;
    }
    onEmailClassified(correct);
  });
  
  phishingBtn.addEventListener("click", () => {
    if (!currentEmail) return;
    if (currentEmail.redFlagsRequired > 0 && currentEmail.redFlagsFound < currentEmail.redFlagsRequired) {
      showInPagePopup("Identify at least one suspicious element before classifying!");
      return;
    }
    let correct = false;
    if (currentEmail.phishing) {
      gsap.to("#emailPreview", { backgroundColor: "#ff0000", duration: 0.1, yoyo: true, repeat: 3 });
      updateScore(10);
      showCelebrationPopup("Correct! This is a phishing email. " + getTrivia());
      correct = true;
    } else {
      updateScore(-5);
      showInPagePopup("Incorrect. " + currentEmail.explanation);
      lives--;
      stageLives--;
    }
    onEmailClassified(correct);
  });
  
  hintBtn.addEventListener("click", () => {
    if (!currentEmail) {
      showInPagePopup("Select an email first!");
      return;
    }
    if (currentEmail.phishing) {
      showInPagePopup("Hint: Look for urgent language, mismatched sender, or odd URLs.");
    } else {
      showInPagePopup("Hint: This email appears consistent with a legitimate source.");
    }
  });
  
  // When an email is classified
  function onEmailClassified(isCorrect) {
    stopEmailTimer();
    if (isCorrect) {
      classifiedCount++;
      if (unlockedIndex < stageEmails.length - 1) {
        unlockedIndex++;
      }
      setTimeout(() => {
        emailPreviewEl.innerHTML = "";
        emailPreviewEl.style.opacity = 0;
        loadInbox();
      }, 1000);
      // If current stage complete, move to next stage
      if (unlockedIndex >= stageEmails.length - 1) {
        setTimeout(() => { nextStage(); }, 1500);
      }
    } else {
      checkLives();
    }
  }
  
  function checkLives() {
    if (lives <= 0 || stageLives <= 0) {
      showInPagePopup("Game Over! You've used all your chances.");
      setTimeout(() => { startGame(); }, 2000);
    }
  }
  
  function nextStage() {
    if (currentStageIndex < stages.length - 1) {
      currentStageIndex++;
      stageEmails = stages[currentStageIndex];
      unlockedIndex = 0;
      stageLives = 3;
      showInPagePopup("Stage " + (currentStageIndex + 1) + " complete! " + getTrivia());
      setTimeout(loadInbox, 1500);
    } else {
      endLevel();
    }
  }
  
  function endLevel() {
    let rank = "";
    if (score >= 50) rank = "Phishing Expert!";
    else if (score >= 30) rank = "Phishing Apprentice";
    else rank = "Phishing Newbie – Try Again!";
    document.getElementById("endLevelMessage").textContent = "Your final score is: " + score;
    document.getElementById("rankMessage").textContent = rank;
    document.getElementById("endLevelPopup").classList.remove("hidden");
  }
  
  document.getElementById("replayLevelBtn").addEventListener("click", () => {
    document.getElementById("endLevelPopup").classList.add("hidden");
    startGame();
  });
  document.getElementById("nextLevelBtn").addEventListener("click", () => {
    window.location.href = "../level5.html";
  });
  
  // Phishing trivia
  const triviaFacts = [
    "Did you know? Over 90% of cyber attacks begin with phishing emails.",
    "Phishing emails often use urgent language to trick you.",
    "Hovering over links can reveal hidden malicious URLs.",
    "Subtle misspellings in sender emails are red flags.",
    "Always verify the source before clicking on any link!"
  ];
  function getTrivia() {
    return " Trivia: " + triviaFacts[Math.floor(Math.random() * triviaFacts.length)];
  }
  
  // Hack simulation overlay (Matrix-style effect)
  function triggerHackSimulation() {
    const hackOverlay = document.getElementById("hackOverlay");
    hackOverlay.classList.remove("hidden");
    gsap.to("#hackOverlay", { opacity: 1, duration: 0.5 });
    setTimeout(() => {
      gsap.to("#hackOverlay", {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          hackOverlay.classList.add("hidden");
        }
      });
    }, 5000); // show for 5 seconds
  }
  
  // Popup utilities
  function showInPagePopup(msg) {
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay fancy-popup";
    overlay.innerHTML = `
      <div class="popup-content" style="max-width:400px;">
        <p>${msg}</p>
        <button class="popup-btn" id="popupCloseBtn">OK</button>
      </div>
    `;
    document.body.appendChild(overlay);
    const content = overlay.querySelector(".popup-content");
    gsap.fromTo(content, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
    overlay.querySelector("#popupCloseBtn").addEventListener("click", () => {
      gsap.to(content, { opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.in", onComplete: () => overlay.remove() });
    });
  }
  
  function showCelebrationPopup(msg) {
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay fancy-popup";
    overlay.innerHTML = `
      <div class="popup-content celebrate" style="max-width:450px;">
        <h3>${msg}</h3>
        <button class="popup-btn" id="popupCloseBtn">Awesome!</button>
      </div>
    `;
    document.body.appendChild(overlay);
    const content = overlay.querySelector(".popup-content");
    gsap.fromTo(content, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
    overlay.querySelector("#popupCloseBtn").addEventListener("click", () => {
      gsap.to(content, { opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.in", onComplete: () => overlay.remove() });
    });
  }
  
  // Begin the game
  startGame();
});
