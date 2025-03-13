document.addEventListener("DOMContentLoaded", () => {

  const introTextEl = document.getElementById("introText");
  const introLines = [
    "Welcome to Level 3: Social Media Privacy!",
    "In this level, you'll view fake Instagram posts and identify private details.",
    "Round 1: Look at the post and type in the missing private detail.",
    "Round 2: Decide if a post is leaking private info and, if so, select the data type.",
    "Read carefully and have fun!",
    "When you're ready, click 'Start Game'."
  ];
  let currentLine = 0;
  function typeIntroText() {
    if (currentLine < introLines.length) {
      let line = introLines[currentLine];

      let el = document.createElement(currentLine === 0 ? "h2" : "p");
      el.className = currentLine === 0 ? "intro-title" : "intro-paragraph";
      introTextEl.appendChild(el);
      let charIndex = 0;
      function typeChar() {
        if (charIndex < line.length) {
          el.textContent += line.charAt(charIndex);
          charIndex++;
          setTimeout(typeChar, 40);
        } else {
          currentLine++;
          setTimeout(typeIntroText, 300);
        }
      }
      typeChar();
    }
  }
  const introPopup = document.getElementById("introPopup");
  introPopup.style.display = "flex";
  typeIntroText();
  

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
        startRound1();
      }
    });
  });
  

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
  

  let currentRound = 1;
  let currentPostIndex = 0;
  let score = 0;
  const round1Count = 2; 
  const round2Count = 3; 
  let postsR1 = [];
  let postsR2 = [];
  

  const poolRound1 = [
    {
      image: "../assets/images/post1.jpg",
      question: "What is John's new address?",
      answer: "204 high street",
      hint: "Look at the door number and street name behind him."
    },
    {
      image: "../assets/images/post2.jpg",
      question: "What school does the child attend?",
      answer: "william farr pre school",
      hint: "Focus on the school banner in the image."
    },
    {
      image: "../assets/images/post3.jpg",
      question: "What is the name of Momin's new company?",
      answer: "acme",
      hint: "Check the sign on the building."
    },
    {
      image: "../assets/images/post4.jpg",
      question: "Calculate her date of birth.",
      answer: "05/03/1985",
      hint: "Subtract 40 from 2025 (she was born on __/__/1985)."
    }
  ];
  

  const poolRound2 = [
    {
      image: "../assets/images/post1.jpg",
      privateData: "address",
      hint: "The door number and street name are visible."
    },
    {
      image: "../assets/images/post2.jpg",
      privateData: "school",
      hint: "The banner shows the school name."
    },
    {
      image: "../assets/images/post5.jpg",
      privateData: "",
      hint: "This post shows a guy in a park having a good time—no private info here."
    },
    {
      image: "../assets/images/post3.jpg",
      privateData: "company",
      hint: "Look at the building sign for the company name."
    },
    {
      image: "../assets/images/post6.jpg",
      privateData: "",
      hint: "This post shows a girl at home reading a book and having good time."
    }
  ];
  

  const quizPool = [
    { question: "Which of these should NEVER be shared online?", options: ["Home address", "Nickname", "Favorite color", "Pet's name"], correct: "Home address" },
    { question: "Why should your full name and birthdate be kept private?", options: ["For fun", "To protect your identity", "To impress friends", "Because it’s trendy"], correct: "To protect your identity" },
    { question: "Which information is considered sensitive?", options: ["Your favorite movie", "Your phone number", "The weather", "A random fact"], correct: "Your phone number" },
    { question: "What can happen if you share too much personal info online?", options: ["Increased privacy", "Identity theft", "More friends", "Better credit score"], correct: "Identity theft" },
    { question: "Which piece of information is best kept private?", options: ["Your email", "Your home address", "Your username", "Your hobby"], correct: "Your home address" },
    { question: "Sharing your exact birth date can put you at risk of:", options: ["Online dating", "Identity theft", "Job offers", "More likes on social media"], correct: "Identity theft" },
    { question: "What is a safe practice regarding personal data online?", options: ["Posting your bank details", "Sharing only necessary info", "Revealing your full address", "Using your real name everywhere"], correct: "Sharing only necessary info" },
    { question: "Why should you avoid posting your school information publicly?", options: ["It’s boring", "It can compromise your safety", "Everyone does it", "It makes you look smart"], correct: "It can compromise your safety" },
    { question: "What is an example of non-sensitive info?", options: ["Your favorite color", "Your full name", "Your date of birth", "Your address"], correct: "Your favorite color" },
    { question: "Why is online privacy important?", options: ["For fun", "To protect personal safety", "It’s not important", "To get more likes"], correct: "To protect personal safety" }
  ];
  
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  function initPosts() {
    shuffleArray(poolRound1);
    postsR1 = poolRound1.slice(0, round1Count);
    shuffleArray(poolRound2);
    postsR2 = poolRound2.slice(0, round2Count);
  }
  initPosts();
  
  // DOM References
  const phoneScreen = document.getElementById("phoneScreen");
  const roundInstructions = document.getElementById("roundInstructions");
  const roundContent = document.getElementById("roundContent");
  const scoreLabelEl = document.getElementById("scoreLabel");
  const progressBarEl = document.getElementById("progressBar");
  const progressPercentLabelEl = document.getElementById("progressPercentLabel");
  const finalQuizOverlay = document.getElementById("finalQuizOverlay");
  const finalQuizContent = document.getElementById("finalQuizContent");
  const endLevelOverlay = document.getElementById("endLevelOverlay");
  const endLevelMessage = document.getElementById("endLevelMessage");
  const replayLevelBtn = document.getElementById("replayLevelBtn");
  const nextLevelBtn = document.getElementById("nextLevelBtn");
  

  function updateScore(points) {
    score += points;
    scoreLabelEl.textContent = "Score: " + score;
  }
  function updateProgress(total, current) {
    const percent = Math.floor((current / total) * 100);
    progressPercentLabelEl.textContent = percent + "%";
    progressBarEl.style.width = percent + "%";
  }
  function clearScreen() {
    phoneScreen.innerHTML = "";
  }
  function showPost(post) {
    clearScreen();
    const img = document.createElement("img");
    img.src = post.image;
    img.alt = "Instagram Screenshot";
    img.className = "phone-screenshot";
    phoneScreen.appendChild(img);
    gsap.fromTo(img, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" });
  }
  function isAnswerClose(userAnswer, correctAnswer) {
    const normalize = str => str.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
    const normUser = normalize(userAnswer);
    const normCorrect = normalize(correctAnswer);
    if (correctAnswer.indexOf("/") !== -1) {
      const year = normCorrect.slice(-4);
      return normUser.indexOf(year) !== -1;
    }
    const words = normCorrect.split(/\s+/);
    return words.every(word => normUser.indexOf(word) !== -1);
  }
  function animateWrongAnswer(inputEl) {
    gsap.to(inputEl, { x: -5, duration: 0.1, yoyo: true, repeat: 5 });
    inputEl.style.borderColor = "red";
    setTimeout(() => {
      inputEl.value = "";
      inputEl.style.borderColor = "#39ff14";
    }, 1000);
  }
  function addHintButton(hint) {
    const existing = document.getElementById("hintBtn");
    if (existing) existing.remove();
    const btn = document.createElement("button");
    btn.id = "hintBtn";
    btn.className = "hint-btn";
    btn.textContent = "Hint";
    btn.addEventListener("click", () => {
      showInPagePopup(hint);
    });
    roundContent.appendChild(btn);
  }
  

  function startRound1() {
    currentRound = 1;
    currentPostIndex = 0;
    roundInstructions.innerHTML = `
      <h2 style="color:#81d4fa;">Round 1: Identify Private Info</h2>
      <p style="font-size:1.3rem;">Check the screenshot on the phone and type the <strong>private detail</strong> you see!</p>
    `;
    loadRound1Post();
  }
  function loadRound1Post() {
    if (currentPostIndex >= postsR1.length) {
      startRound2();
      return;
    }
    const post = postsR1[currentPostIndex];
    showPost(post);
    roundContent.innerHTML = `
      <div>
        <p style="font-size:1.3rem;"><strong>${post.question}</strong></p>
        <input type="text" id="round1AnswerInput" placeholder="Type private info" style="font-size:1.2rem; padding:10px;">
        <button id="round1SubmitBtn" class="popup-btn bigger-btn">Submit</button>
      </div>
    `;
    addHintButton(post.hint);
    document.getElementById("round1SubmitBtn").addEventListener("click", () => {
      const inputEl = document.getElementById("round1AnswerInput");
      const userAnswer = inputEl.value;
      if (!userAnswer) {
        showInPagePopup("Please enter an answer!");
        return;
      }
      if (isAnswerClose(userAnswer, post.answer)) {
        updateScore(10);
        showCelebrationPopup(`Great job! You found: "${post.answer}".`);
        currentPostIndex++;
        updateProgress(postsR1.length, currentPostIndex);
        loadRound1Post();
      } else {
        animateWrongAnswer(inputEl);
      }
    });
  }
  

  function startRound2() {
    currentRound = 2;
    currentPostIndex = 0;
    roundInstructions.innerHTML = `
      <h2 style="color:#ce93d8;">Round 2: Leak Evaluation</h2>
      <p style="font-size:1.3rem;">Decide if the post leaks private info. If yes, select the <strong>data type</strong>!</p>
    `;
    loadRound2Post();
  }
  function loadRound2Post() {
    if (currentPostIndex >= postsR2.length) {
      startFinalQuiz();
      return;
    }
    const post = postsR2[currentPostIndex];
    showPost(post);
    roundContent.innerHTML = `
      <div>
        <p style="font-size:1.3rem;"><strong>Does this post reveal private details?</strong></p>
        <button id="round2YesBtn" class="popup-btn bigger-btn">Yes</button>
        <button id="round2NoBtn" class="popup-btn bigger-btn">No</button>
      </div>
    `;
    addHintButton(post.hint);
    document.getElementById("round2YesBtn").addEventListener("click", () => {
      if (!post.privateData) {
        gsap.to(roundContent, { x: -5, duration: 0.1, yoyo: true, repeat: 5 });
      } else {
        roundContent.innerHTML += `
          <div id="leakOptions" style="margin-top:10px;">
            <p style="font-size:1.2rem;">What type of data is leaked?</p>
            <select id="leakSelect" style="font-size:1.2rem; padding:8px;">
              <option value="">Select a data type...</option>
              <option value="address">Address</option>
              <option value="school">School</option>
              <option value="company">Company</option>
              <option value="birthday">Birthday</option>
              <option value="phone number">Phone Number</option>
            </select>
            <button id="leakSubmitBtn" class="popup-btn">Submit</button>
          </div>
        `;
        document.getElementById("leakSubmitBtn").addEventListener("click", () => {
          const userSelection = document.getElementById("leakSelect").value;
          if (!userSelection) {
            showInPagePopup("Please select a data type!");
            return;
          }
          if (userSelection === post.privateData) {
            updateScore(10);
            showCelebrationPopup(`Great job! Correct leak: "${post.privateData}".`);
            currentPostIndex++;
            updateProgress(postsR2.length, currentPostIndex);
            loadRound2Post();
          } else {
            gsap.to(roundContent, { x: -5, duration: 0.1, yoyo: true, repeat: 5 });
          }
        });
      }
    });
    document.getElementById("round2NoBtn").addEventListener("click", () => {
      if (post.privateData) {
        gsap.to(roundContent, { x: -5, duration: 0.1, yoyo: true, repeat: 5 });
      } else {
        updateScore(10);
        showCelebrationPopup("Great! No leak detected.");
        currentPostIndex++;
        updateProgress(postsR2.length, currentPostIndex);
        loadRound2Post();
      }
    });
  }
  
  function startFinalQuiz() {
    roundInstructions.innerHTML = `
      <h2>Final Quiz</h2>
      <p style="font-size:1.3rem;">Answer these questions to test your privacy knowledge!</p>
    `;
    roundContent.innerHTML = `
      <button id="openQuizBtn" class="popup-btn bigger-btn">Open Final Quiz</button>
    `;
    document.getElementById("openQuizBtn").addEventListener("click", () => {
      showFinalQuiz();
    });
  }
  function selectQuizQuestions() {
    let shuffled = quizPool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }
  function showFinalQuiz() {
    const selectedQuestions = selectQuizQuestions();
    let quizHtml = "";
    selectedQuestions.forEach((q, i) => {
      quizHtml += `<div style="margin-bottom:20px; text-align:left;">
        <p style="font-size:1.3rem;"><strong>${i + 1}. ${q.question}</strong></p>`;
      q.options.forEach(option => {
        quizHtml += `<label style="font-size:1.2rem;">
          <input type="radio" name="q${i}" value="${option}"> ${option}
        </label><br>`;
      });
      quizHtml += `</div>`;
    });
    finalQuizOverlay.classList.remove("hidden");
    finalQuizContent.innerHTML = `
      <h2>Final Quiz: Privacy Knowledge</h2>
      <div id="quizQuestions">${quizHtml}</div>
      <button id="submitQuizBtn" class="popup-btn bigger-btn">Submit Quiz</button>
    `;
    document.getElementById("submitQuizBtn").addEventListener("click", () => {
      let quizScore = 0;
      selectedQuestions.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && selected.value === q.correct) {
          quizScore += 10;
        }
      });
      updateScore(quizScore);
      finalQuizOverlay.classList.add("hidden");
      endLevelMessage.textContent = `You scored ${score} points!`;
      endLevelOverlay.classList.remove("hidden");
    });
  }
  

  replayLevelBtn.addEventListener("click", () => {
    score = 0;
    updateScore(0);
    initPosts();
    startRound1();
  });
  nextLevelBtn.addEventListener("click", () => {
    window.location.href = "../levels/level4.html";
  });
  

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
  
});
