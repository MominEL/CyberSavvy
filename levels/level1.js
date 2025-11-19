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


  const hackerImg = document.getElementById("hackerImg");
  let hackerClickCount = 0;


  const cyberInstructions = document.getElementById("cyberInstructions");


  const part1 = document.querySelector(".part1");
  const part2 = document.querySelector(".part2");
  const part3 = document.querySelector(".part3");
  const part4 = document.querySelector(".part4");


  let currentPasswordArr = []; // for rookie
  let typedPassword = "";      // for pro
  let successfulPasswords = 0;


  const rookieWords = ["cat", "sun", "panda", "pizza", "sigma", "toy", "frog"];
  const proWords = ["kingkong", "unicorn", "f00bar", "n!nja", "b@n@n@", "SIGMA", "qu4ntum"];
  const numbers = ["123", "007", "42", "999", "2023", "000"];
  const symbols = ["!", "@", "#", "$", "%", "^", "&"];


  const quizPopup = document.getElementById("quizPopup");
  const quizQuestionsDiv = document.getElementById("quizQuestions");
  const quizFeedback = document.getElementById("quizFeedback");

  const allPossibleQuestions = [
    // Password Basics
    {
      id: "pb01",
      category: "password-basics",
      question: "Which is safer: '123456' or 'C@t42!'?",
      options: ["123456", "C@t42!"],
      correctAnswer: 1,
      explanation: "'C@t42!' is safer because it uses uppercase letters, numbers, symbols, and isn't a common pattern."
    },
    {
      id: "pb02", 
      category: "password-basics",
      question: "What's the best length for a password?",
      options: ["At least 8 chars", "3-4 is enough", "Doesn't matter", "5 chars is fine"],
      correctAnswer: 0,
      explanation: "Passwords should be at least 8 characters long, but 12+ is even better for security."
    },
    {
      id: "pb03",
      category: "password-basics", 
      question: "Which symbol might help a password?",
      options: ["@", "No symbols needed"],
      correctAnswer: 0,
      explanation: "Symbols like @ make passwords much harder for hackers to guess using automated tools."
    },
    {
      id: "pb04",
      category: "password-basics",
      question: "Is 'abc123' strong enough?",
      options: ["Yes", "No"],
      correctAnswer: 1,
      explanation: "'abc123' is very weak - it's a common pattern that hackers try first."
    },
    {
      id: "pb05",
      category: "password-basics",
      question: "Which is better: 'password' or 'pA$sW0rd'?",
      options: ["password", "pA$sW0rd"],
      correctAnswer: 1,
      explanation: "'pA$sW0rd' mixes uppercase, lowercase, numbers, and symbols, making it much harder to crack."
    },
    {
      id: "pb06",
      category: "password-basics",
      question: "What makes a password hard to guess?",
      options: ["Only letters", "Mixed characters", "All lowercase", "Short and simple"],
      correctAnswer: 1,
      explanation: "Mixed characters (uppercase, lowercase, numbers, symbols) create the most unpredictable passwords."
    },
    {
      id: "pb07",
      category: "password-basics",
      question: "How often should you change important passwords?",
      options: ["Never", "Every few months", "Daily", "Once a year"],
      correctAnswer: 1,
      explanation: "Changing passwords every few months helps protect against unknown breaches."
    },
    {
      id: "pb08",
      category: "password-basics",
      question: "Is 'Passw0rd!' a good password?",
      options: ["Yes", "No"],
      correctAnswer: 1,
      explanation: "While it has good character variety, 'Passw0rd!' is too common and easily guessed."
    },

    // Social Engineering
    {
      id: "se01",
      category: "social-engineering",
      question: "Should you share your password with friends?",
      options: ["Yes", "No"],
      correctAnswer: 1,
      explanation: "Never share passwords - even trusted friends can have their accounts hacked or accidentally reveal your password."
    },
    {
      id: "se02",
      category: "social-engineering",
      question: "Should you use personal info in your password?",
      options: ["Yes", "No"],
      correctAnswer: 1,
      explanation: "Personal info like birthdays, names, or pets can be found online and guessed by hackers."
    },
    {
      id: "se03",
      category: "social-engineering",
      question: "What if someone emails asking for your password?",
      options: ["Give it to them", "Don't respond", "Ask for proof", "Share part of it"],
      correctAnswer: 1,
      explanation: "Legitimate companies NEVER ask for passwords via email. Delete and report such messages."
    },
    {
      id: "se04",
      category: "social-engineering",
      question: "Should you reuse the same password everywhere?",
      options: ["Yes", "No"],
      correctAnswer: 1,
      explanation: "If one site gets hacked, using the same password everywhere puts all your accounts at risk."
    },
    {
      id: "se05",
      category: "social-engineering",
      question: "What's a phishing attack?",
      options: ["Fishing game", "Fake website to steal info", "Computer virus", "Password manager"],
      correctAnswer: 1,
      explanation: "Phishing uses fake emails/websites to trick you into revealing passwords and personal information."
    },
    {
      id: "se06",
      category: "social-engineering",
      question: "Someone calls claiming to be tech support and asks for your password. What do you do?",
      options: ["Give it to them", "Hang up and call the company directly", "Ask questions first", "Give partial info"],
      correctAnswer: 1,
      explanation: "Real tech support never asks for passwords. Hang up and contact the company through official channels."
    },
    {
      id: "se07",
      category: "social-engineering",
      question: "Your friend messages you asking for a password reset code. Should you share it?",
      options: ["Yes, they're my friend", "No, call them first", "Share half", "Ask for proof"],
      correctAnswer: 1,
      explanation: "Hackers can impersonate friends. Always verify through another channel before sharing security codes."
    },

    // Best Practices
    {
      id: "bp01",
      category: "best-practices",
      question: "Where should you store your passwords?",
      options: ["Written on paper", "In your head", "Password manager", "Text file on computer"],
      correctAnswer: 2,
      explanation: "Password managers securely encrypt and store all your passwords behind one master password."
    },
    {
      id: "bp02",
      category: "best-practices",
      question: "What's two-factor authentication (2FA)?",
      options: ["Two passwords", "Password + code from phone", "Double checking spelling", "Backup password"],
      correctAnswer: 1,
      explanation: "2FA requires both your password AND a second factor like a phone code, making accounts much safer."
    },
    {
      id: "bp03",
      category: "best-practices",
      question: "Should you use public WiFi for banking?",
      options: ["Yes, it's fine", "No, use secure connection", "Only with VPN", "Ask permission first"],
      correctAnswer: 2,
      explanation: "Public WiFi can be insecure. Use a VPN or your phone's data for sensitive activities like banking."
    },
    {
      id: "bp04",
      category: "best-practices",
      question: "What's the safest way to remember passwords?",
      options: ["Same password everywhere", "Password phrases", "Simple words", "Birthdays"],
      correctAnswer: 1,
      explanation: "Password phrases (like 'PurpleElephantDancesAtMidnight!') are long, memorable, and hard to crack."
    },
    {
      id: "bp05",
      category: "best-practices",
      question: "Should you write passwords on sticky notes?",
      options: ["Yes, it's convenient", "No, anyone can see them", "Only at home", "Hide them well"],
      correctAnswer: 1,
      explanation: "Written passwords can be found by anyone with physical access. Use a password manager instead."
    },
    {
      id: "bp06",
      category: "best-practices",
      question: "What makes a good security question?",
      options: ["Your first pet", "Favorite color", "Information not online", "Mother's maiden name"],
      correctAnswer: 2,
      explanation: "Good security questions use answers that can't be found online or through social media."
    },
    {
      id: "bp07",
      category: "best-practices",
      question: "Should you use password hints?",
      options: ["Yes, helpful", "No, helps hackers too", "Only vague hints", "Just for easy passwords"],
      correctAnswer: 1,
      explanation: "Password hints often make it easier for hackers to guess your passwords. Avoid them when possible."
    },
    {
      id: "bp08",
      category: "best-practices",
      question: "What's a password breach?",
      options: ["Forgetting password", "Hackers stealing password lists", "Password too long", "Typing wrong password"],
      correctAnswer: 1,
      explanation: "A breach occurs when hackers steal password databases from companies, exposing many users' credentials."
    },
    {
      id: "bp09",
      category: "best-practices",
      question: "Should you check if your email was in a data breach?",
      options: ["No, doesn't matter", "Yes, helps you stay safe", "Only if hacked", "Too much trouble"],
      correctAnswer: 1,
      explanation: "Checking breach status helps you know which passwords to change to protect your accounts."
    }
  ];

  let selectedQuestions = [];   
  let currentQuizIndex = 0;     
  let quizCorrectCount = 0;      
  let quizSessionQuestions = new Set(); // Track questions used in current session
  let quizAttempts = 0; // Track attempts for current question
  let requiredCorrectAnswers = 3; // Need 3 out of 4 correct to pass      


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


    selectedQuestions = [];
    currentQuizIndex = 0;
    quizCorrectCount = 0;
    quizSessionQuestions.clear();
    quizAttempts = 0;
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
    meterBar.style.background = "red";
    feedbackText.textContent = "";
    starRating.textContent = "";
    part1.classList.add("hidden");
    part2.classList.add("hidden");
    part3.classList.add("hidden");
    part4.classList.add("hidden");
    setHackerNormal();
    resetBtn.innerHTML = "🔄 Reset";
    
    // Reset quiz variables
    selectedQuestions = [];
    currentQuizIndex = 0;
    quizCorrectCount = 0;
    quizSessionQuestions.clear();
    quizAttempts = 0;
  }


  function startQuiz() {
    selectedQuestions = getBalancedQuestions(4);
    currentQuizIndex = 0;
    quizCorrectCount = 0;
    quizAttempts = 0;
    showNextQuizQuestion();
  }

  function showNextQuizQuestion() {
    // Check if quiz is complete
    if (currentQuizIndex >= selectedQuestions.length) {
      showQuizSummary();
      return;
    }

    const originalQuestion = selectedQuestions[currentQuizIndex];
    const q = shuffleQuestionOptions(originalQuestion);
    quizAttempts = 0;
    
    // Clear previous content
    quizQuestionsDiv.innerHTML = "";
    quizFeedback.textContent = "";

    // Create progress indicator
    const progressDiv = document.createElement("div");
    progressDiv.className = "quiz-progress";
    progressDiv.style.marginBottom = "20px";
    progressDiv.style.fontSize = "1.1rem";
    progressDiv.textContent = `Question ${currentQuizIndex + 1} of ${selectedQuestions.length} | Score: ${quizCorrectCount}/${requiredCorrectAnswers} needed`;
    quizQuestionsDiv.appendChild(progressDiv);

    // Create question container
    const div = document.createElement("div");
    div.className = "quiz-question";

    // Add question text with category indicator
    const p = document.createElement("p");
    p.innerText = q.question;
    p.style.fontSize = "1.5rem";
    p.style.marginBottom = "15px";
    div.appendChild(p);

    // Add category badge
    const categoryBadge = document.createElement("span");
    categoryBadge.className = "category-badge";
    categoryBadge.style.display = "inline-block";
    categoryBadge.style.padding = "4px 8px";
    categoryBadge.style.marginBottom = "15px";
    categoryBadge.style.borderRadius = "12px";
    categoryBadge.style.fontSize = "0.8rem";
    categoryBadge.style.fontWeight = "bold";
    
    // Set category color
    switch(q.category) {
      case "password-basics":
        categoryBadge.style.background = "#ff6b6b";
        categoryBadge.textContent = "Password Basics";
        break;
      case "social-engineering":
        categoryBadge.style.background = "#4ecdc4";
        categoryBadge.textContent = "Social Engineering";
        break;
      case "best-practices":
        categoryBadge.style.background = "#45b7d1";
        categoryBadge.textContent = "Best Practices";
        break;
    }
    div.appendChild(categoryBadge);

    // Add answer options
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "popup-btn quiz-option";
      btn.style.margin = "5px";
      btn.style.padding = "12px 16px";
      btn.style.minWidth = "120px";
      btn.innerText = opt;
      btn.addEventListener("click", () => handleQuizAnswer(i, q));
      div.appendChild(btn);
    });

    quizQuestionsDiv.appendChild(div);
    showPopup(quizPopup);
  }

  function handleQuizAnswer(selectedIndex, question) {
    quizAttempts++;
    
    if (selectedIndex === question.correctAnswer) {
      // Correct answer
      quizCorrectCount++;
      quizFeedback.innerHTML = `
        <div style="color: #2ed573; font-weight: bold; margin-bottom: 10px;">
          ✓ Correct! ${question.explanation}
        </div>
      `;
      
      // Disable all buttons
      const buttons = quizQuestionsDiv.querySelectorAll('.quiz-option');
      buttons.forEach(btn => btn.disabled = true);
      
      // Show correct answer highlight
      buttons[selectedIndex].style.background = "#2ed573";
      buttons[selectedIndex].style.color = "white";
      
      // Move to next question after delay
      setTimeout(() => {
        currentQuizIndex++;
        hidePopup(quizPopup);
        setTimeout(() => showNextQuizQuestion(), 400);
      }, 2000);
    } else {
      // Incorrect answer
      if (quizAttempts >= 2) {
        // Show explanation after 2 attempts
        quizFeedback.innerHTML = `
          <div style="color: #ff6b6b; font-weight: bold; margin-bottom: 10px;">
            ✗ Not quite. ${question.explanation}
          </div>
          <div style="color: #ffa502; font-size: 0.9rem;">
            The correct answer was: ${question.options[question.correctAnswer]}
          </div>
        `;
        
        // Disable all buttons and show correct answer
        const buttons = quizQuestionsDiv.querySelectorAll('.quiz-option');
        buttons.forEach(btn => btn.disabled = true);
        buttons[selectedIndex].style.background = "#ff6b6b";
        buttons[selectedIndex].style.color = "white";
        buttons[question.correctAnswer].style.background = "#2ed573";
        buttons[question.correctAnswer].style.color = "white";
        
        // Move to next question after delay
        setTimeout(() => {
          currentQuizIndex++;
          hidePopup(quizPopup);
          setTimeout(() => showNextQuizQuestion(), 3000);
        }, 3000);
      } else {
        // First attempt - simple feedback
        quizFeedback.innerHTML = `
          <div style="color: #ffa502; font-weight: bold;">
            Not quite! Try again. (${quizAttempts}/2 attempts)
          </div>
        `;
        shakePopup(quizPopup);
        
        // Highlight wrong answer briefly
        const buttons = quizQuestionsDiv.querySelectorAll('.quiz-option');
        buttons[selectedIndex].style.background = "#ff6b6b";
        buttons[selectedIndex].style.color = "white";
        setTimeout(() => {
          buttons[selectedIndex].style.background = "";
          buttons[selectedIndex].style.color = "";
        }, 1000);
      }
    }
  }

  function showQuizSummary() {
    quizQuestionsDiv.innerHTML = "";
    
    const passed = quizCorrectCount >= requiredCorrectAnswers;
    const score = `${quizCorrectCount}/${selectedQuestions.length}`;
    
    // Summary content
    const summaryDiv = document.createElement("div");
    summaryDiv.className = "quiz-summary";
    summaryDiv.style.textAlign = "center";
    
    // Result message
    const resultTitle = document.createElement("h2");
    resultTitle.style.fontSize = "2rem";
    resultTitle.style.marginBottom = "15px";
    
    if (passed) {
      resultTitle.innerHTML = "🎉 Quiz Passed!";
      resultTitle.style.color = "#2ed573";
      spawnConfettiQuiz();
    } else {
      resultTitle.innerHTML = "📚 Keep Learning!";
      resultTitle.style.color = "#ffa502";
    }
    summaryDiv.appendChild(resultTitle);
    
    // Score details
    const scoreDiv = document.createElement("div");
    scoreDiv.style.fontSize = "1.3rem";
    scoreDiv.style.marginBottom = "15px";
    scoreDiv.innerHTML = `
      Your Score: <strong>${score}</strong><br>
      Required: ${requiredCorrectAnswers}/${selectedQuestions.length} correct
    `;
    summaryDiv.appendChild(scoreDiv);
    
    // Feedback message
    const feedbackDiv = document.createElement("div");
    feedbackDiv.style.fontSize = "1.1rem";
    feedbackDiv.style.marginBottom = "20px";
    feedbackDiv.style.padding = "15px";
    feedbackDiv.style.borderRadius = "8px";
    feedbackDiv.style.background = passed ? "rgba(46, 213, 115, 0.1)" : "rgba(255, 165, 2, 0.1)";
    
    if (passed) {
      feedbackDiv.innerHTML = `
        <strong>Excellent work!</strong><br>
        You've mastered important cybersecurity concepts.<br>
        Ready for the next challenge?
      `;
    } else {
      feedbackDiv.innerHTML = `
        <strong>Good effort!</strong><br>
        Review the explanations and try again.<br>
        Cybersecurity takes practice!
      `;
    }
    summaryDiv.appendChild(feedbackDiv);
    
    // Action buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.style.marginTop = "20px";
    
    if (!passed) {
      const retryBtn = document.createElement("button");
      retryBtn.className = "popup-btn";
      retryBtn.textContent = "Try Quiz Again";
      retryBtn.addEventListener("click", () => {
        hidePopup(quizPopup);
        startQuiz();
      });
      buttonContainer.appendChild(retryBtn);
    }
    
    const againBtn = document.createElement("button");
    againBtn.className = "popup-btn";
    againBtn.textContent = "Play Level Again";
    againBtn.addEventListener("click", () => {
      hidePopup(quizPopup);
      doReset();
    });
    buttonContainer.appendChild(againBtn);
    
    if (passed) {
      const nextBtn = document.createElement("button");
      nextBtn.className = "popup-btn";
      nextBtn.textContent = "Next Level →";
      nextBtn.style.background = "#45b7d1";
      nextBtn.addEventListener("click", () => {
        window.location.href = "level2.html";
      });
      buttonContainer.appendChild(nextBtn);
    }
    
    summaryDiv.appendChild(buttonContainer);
    quizQuestionsDiv.appendChild(summaryDiv);
    showPopup(quizPopup);
  }


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

// Enhanced quiz functions
function getBalancedQuestions(count = 4) {
  const categories = ["password-basics", "social-engineering", "best-practices"];
  const availableQuestions = allPossibleQuestions.filter(q => !quizSessionQuestions.has(q.id));
  
  // If we don't have enough unused questions, reset the session tracking
  if (availableQuestions.length < count) {
    quizSessionQuestions.clear();
    return getBalancedQuestions(count);
  }
  
  // Try to get balanced questions from different categories
  const selected = [];
  const questionsByCategory = {};
  
  // Group available questions by category
  categories.forEach(cat => {
    questionsByCategory[cat] = availableQuestions.filter(q => q.category === cat);
  });
  
  // Select questions ensuring category variety
  while (selected.length < count && selected.length < availableQuestions.length) {
    const availableCategories = categories.filter(cat => 
      questionsByCategory[cat].length > 0 && 
      selected.filter(q => q.category === cat).length < Math.ceil(count / 2)
    );
    
    if (availableCategories.length === 0) break;
    
    const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    const categoryQuestions = questionsByCategory[randomCategory];
    const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
    const question = categoryQuestions.splice(randomIndex, 1)[0];
    
    selected.push(question);
    quizSessionQuestions.add(question.id);
  }
  
  // If we still need more questions, fill from remaining pool
  while (selected.length < count && availableQuestions.length > 0) {
    const remaining = availableQuestions.filter(q => !selected.includes(q));
    if (remaining.length === 0) break;
    
    const randomIndex = Math.floor(Math.random() * remaining.length);
    const question = remaining[randomIndex];
    
    if (!selected.includes(question)) {
      selected.push(question);
      quizSessionQuestions.add(question.id);
    }
  }
  
  return selected;
}

function shuffleQuestionOptions(question) {
  const shuffledQuestion = {
    ...question,
    options: [...question.options],
    correctAnswer: question.correctAnswer
  };
  
  // Keep track of the correct answer while shuffling
  const correctOption = shuffledQuestion.options[shuffledQuestion.correctAnswer];
  const originalIndices = shuffledQuestion.options.map((_, index) => index);
  
  // Shuffle options
  shuffleArray(shuffledQuestion.options);
  
  // Find new index of correct answer
  shuffledQuestion.correctAnswer = shuffledQuestion.options.indexOf(correctOption);
  
  return shuffledQuestion;
}
});
