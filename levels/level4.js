document.addEventListener("DOMContentLoaded", () => {

  gsap.to(".welcome-hacker", {
    y: -15,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
    duration: 1.2
  });


  const introLines = [
    "Hello Cyber Investigator!",
    "In Round 1, explore 5–6 emails in your Inbox.",
    "Click suspicious red text for bonus points.",
    "If you click a scam button, watch out for the hack!",
    "Then proceed to Round 2 for a timed challenge.",
    "Have fun and stay alert!"
  ];
  let iLine = 0, iChar = 0;
  const introEl = document.getElementById("typingIntro");
  function typeIntro() {
    if (iLine < introLines.length) {
      if (iChar < introLines[iLine].length) {
        introEl.textContent += introLines[iLine].charAt(iChar);
        iChar++;
        setTimeout(typeIntro, 40);
      } else {
        introEl.textContent += "\n\n";
        iLine++;
        iChar = 0;
        setTimeout(typeIntro, 400);
      }
    }
  }
  typeIntro();


  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }


  let score = 0;
  let currentEmailIndex = 0;
  let emails = [];
  let round1Correct = 0;
  let totalEmails = 0;
  const round2MaxImages = 5;
  let round2Images = [];
  let round2Index = 0;
  let round2Timer = null;
  let round2TimeLeft = 30;
  let round2Correct = 0;
  let isEmailClassified = {};


  const introPopupEl = document.getElementById("introPopup");
  const startRound1Btn = document.getElementById("startRound1Btn");
  const round1Container = document.getElementById("round1Container");
  const inboxEl = document.getElementById("emailList");
  const emailTitleEl = document.getElementById("emailTitle");
  const emailContentEl = document.getElementById("emailContent");
  const round1ResultsPopup = document.getElementById("round1ResultsPopup");
  const round1ResultsEl = document.getElementById("round1Results");
  const round2StoryPopup = document.getElementById("round2StoryPopup");
  const startRound2Btn = document.getElementById("startRound2Btn");
  const round2Container = document.getElementById("round2Container");
  const endLevelPopup = document.getElementById("endLevelPopup");
  const endLevelMessageEl = document.getElementById("endLevelMessage");
  const endLevelRankEl = document.getElementById("endLevelRank");
  const round2RetryPopup = document.getElementById("round2RetryPopup");
  const retryYesBtn = document.getElementById("retryYes");
  const retryNoBtn = document.getElementById("retryNo");
  const homeBtn = document.getElementById("homeBtn");
  const replayBtn = document.getElementById("replayBtn");
  const timeLeftEl = document.getElementById("timeLeft");


  homeBtn.addEventListener("click", () => {
    console.log("Home button clicked");

    window.location.href = "../index.html";
  });

  replayBtn.addEventListener("click", () => {
    console.log("Replay button clicked");

    endLevelPopup.classList.add("hidden");
    startRound1();
  });


  const bubbleLinks = document.querySelectorAll(".bubble-bar-right a");
  const leaveGamePopup = document.getElementById("leaveGamePopup");
  const leaveYes = document.getElementById("leaveYes");
  const leaveNo = document.getElementById("leaveNo");
  let pendingLink = null;

  bubbleLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      pendingLink = link.getAttribute("href");
      leaveGamePopup.classList.remove("hidden");
    });
  });
  if (leaveYes && leaveNo) {
    leaveYes.addEventListener("click", () => {
      if (pendingLink) window.location.href = pendingLink;
    });
    leaveNo.addEventListener("click", () => {
      leaveGamePopup.classList.add("hidden");
      pendingLink = null;
    });
  }


  function updateScore(points) {
    score += points;
    document.getElementById("scoreLabel").textContent = "Score: " + score;
    const percent = Math.min(100, Math.floor((score / 100) * 100));
    document.getElementById("progressBar").style.width = percent + "%";
    document.getElementById("progressPercentLabel").textContent = percent + "%";


    const floatEl = document.createElement("div");
    floatEl.style.position = "absolute";
    floatEl.style.fontSize = "1.2rem";
    floatEl.style.fontWeight = "bold";
    floatEl.style.color = points > 0 ? "#39ff14" : "red";
    floatEl.style.top = "0";
    floatEl.style.right = "0";
    floatEl.textContent = points > 0 ? `+${points}` : `${points}`;
    document.querySelector(".score-bar").appendChild(floatEl);
    gsap.to(floatEl, {
      y: -30,
      opacity: 0,
      duration: 1,
      onComplete: () => floatEl.remove()
    });
  }


  let matrixInterval = null;
  function triggerHackSimulation() {
    const hackOverlay = document.getElementById("hackOverlay");
    const canvas = document.getElementById("matrixCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    hackOverlay.classList.remove("hidden");
    gsap.to("#hackOverlay", { opacity: 1, duration: 0.3 });

    let letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZ1234567890';
    letters = letters.split('');
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    function drawMatrix() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    matrixInterval = setInterval(drawMatrix, 50);


    setTimeout(() => {
      clearInterval(matrixInterval);
      gsap.to("#hackOverlay", {
        opacity: 0,
        duration: 0.5,
        onComplete: () => hackOverlay.classList.add("hidden")
      });
    }, 5000);
  }


  const emailPool = [

    {
      sender: "freegift@amazon-rewards.com",
      subject: "Claim Your FREE $100 Gift Card!",
      content: `
        <p><strong>From:</strong> <span class="redflag" data-info="Fake sender domain">freegift@amazon-rewards.com</span></p>
        <p><strong>Subject:</strong> Claim Your FREE $100 Gift Card!</p>
        <hr>
        <p>Hurry, <span class="redflag" data-info="Urgent language">Claim NOW</span> before it expires!</p>
        <div style="text-align:center;">
          <button class="email-action">CLAIM NOW</button>
        </div>
      `,
      phishing: true,
      explanation: "Fake Amazon sender and urgent claim button."
    },
    {
      sender: "security@paypal-support.com",
      subject: "URGENT: Your Account Suspended",
      content: `
        <p><strong>From:</strong> <span class="redflag" data-info="Suspicious domain">security@paypal-support.com</span></p>
        <p><strong>Subject:</strong> URGENT: Your Account Suspended</p>
        <hr>
        <p>Your account has been locked due to <span class="redflag" data-info="Scare tactic">suspicious activity</span>.</p>
        <div style="text-align:center;">
          <button class="email-action" style="background:#0070ba;color:#fff;">SECURE NOW</button>
        </div>
      `,
      phishing: true,
      explanation: "Fake PayPal domain, panic language."
    },
    {
      sender: "noreply@bank.com",
      subject: "Your Monthly Statement",
      content: `
        <p><strong>From:</strong> noreply@bank.com</p>
        <p><strong>Subject:</strong> Your Monthly Statement</p>
        <hr>
        <p>Here is your statement for this month. Thank you for banking with us.</p>
        <div style="text-align:center;">
          <button class="email-action" style="background:#004c99;color:#fff;">VIEW STATEMENT</button>
        </div>
      `,
      phishing: false,
      explanation: "Legitimate bank statement from a real domain."
    },
    {
      sender: "invoice@service.com",
      subject: "Invoice Due: Immediate Payment Required",
      content: `
        <p><strong>From:</strong> invoice@service.com</p>
        <p><strong>Subject:</strong> Invoice Due: Immediate Payment Required</p>
        <hr>
        <p>Your invoice of <strong>$250</strong> is due <span class="redflag" data-info="Threatening language">immediately</span>. Please pay now.</p>
        <div style="text-align:center;">
          <button class="email-action" style="background:red;color:#fff;">PAY NOW</button>
        </div>
      `,
      phishing: true,
      explanation: "Fake invoice with threatening language."
    },
    {
      sender: "promo@shopnow.com",
      subject: "Limited Time Offer – 50% Off!",
      content: `
        <p><strong>From:</strong> promo@shopnow.com</p>
        <p><strong>Subject:</strong> Limited Time Offer – 50% Off!</p>
        <hr>
        <p>Enjoy huge discounts on top brands for a limited time!</p>
        <div style="text-align:center;">
          <button class="email-action" style="background:#ffce00;">SHOP NOW</button>
        </div>
      `,
      phishing: false,
      explanation: "Legitimate promotional offer from a real store."
    },
    {
      sender: "help@techsupport.com",
      subject: "Free PC Cleanup!",
      content: `
        <p><strong>From:</strong> <span class="redflag" data-info="Common scam domain">help@techsupport.com</span></p>
        <p><strong>Subject:</strong> Free PC Cleanup!</p>
        <hr>
        <p>We noticed your computer might be slow. Click below to <span class="redflag" data-info="Too good to be true">fix all issues</span> instantly!</p>
        <div style="text-align:center;">
          <button class="email-action" style="background:orange;color:#fff;">CLEAN MY PC</button>
        </div>
      `,
      phishing: true,
      explanation: "Tech support scam promising free cleanup."
    },
    {
      sender: "friend@example.com",
      subject: "A Friend in Trouble",
      content: `
        <p><strong>From:</strong> friend@example.com</p>
        <p><strong>Subject:</strong> A Friend in Trouble</p>
        <hr>
        <p>Hey, can you do me a huge favor? I <span class="redflag" data-info="Suspicious request">lost my phone</span> and need your phone number to recover my account!</p>
      `,
      phishing: true,
      explanation: "Social engineering attempt from a 'friend'."
    },
    {
      sender: "noreply@university.edu",
      subject: "Important Semester Update",
      content: `
        <p><strong>From:</strong> noreply@university.edu</p>
        <p><strong>Subject:</strong> Important Semester Update</p>
        <hr>
        <p>Please review the latest changes to our academic calendar.</p>
        <div style="text-align:center;">
          <button class="email-action" style="background:#0066cc;color:#fff;">VIEW UPDATE</button>
        </div>
      `,
      phishing: false,
      explanation: "Legitimate academic update from a known domain."
    },
    {
      sender: "rewards@storeonline.com",
      subject: "You Won a Prize!",
      content: `
        <p><strong>From:</strong> <span class="redflag" data-info="Unknown reward domain">rewards@storeonline.com</span></p>
        <p><strong>Subject:</strong> You Won a Prize!</p>
        <hr>
        <p>Congratulations! You've been selected to receive a gift. <span class="redflag" data-info="Unsolicited prize">Claim now</span> to get your reward!</p>
        <div style="text-align:center;">
          <button class="email-action" style="background:gold;color:#333;">CLAIM PRIZE</button>
        </div>
      `,
      phishing: true,
      explanation: "Typical unsolicited prize scam email."
    },
    {
      sender: "support@videogame.com",
      subject: "Account Security Alert",
      content: `
        <p><strong>From:</strong> support@videogame.com</p>
        <p><strong>Subject:</strong> Account Security Alert</p>
        <hr>
        <p>We detected a new login from an unknown device. If this wasn't you, please reset your password.</p>
        <div style="text-align:center;">
          <button class="email-action" style="background:#008080;color:#fff;">RESET PASSWORD</button>
        </div>
      `,
      phishing: false,
      explanation: "Legitimate security alert from a known game platform."
    },
    {
      sender: "invoice@random.com",
      subject: "Payment Overdue!",
      content: `
        <p><strong>From:</strong> <span class="redflag" data-info="Unknown invoice domain">invoice@random.com</span></p>
        <p><strong>Subject:</strong> Payment Overdue!</p>
        <hr>
        <p>Your account is overdue by <strong>$400</strong>. Please pay or <span class="redflag" data-info="Threatening language">legal action</span> may follow.</p>
        <div style="text-align:center;">
          <button class="email-action" style="background:red;color:#fff;">PAY NOW</button>
        </div>
      `,
      phishing: true,
      explanation: "Threatening invoice from unknown domain."
    }
  ];


  const round2Pool = [
    "../assets/images/round2_1.png",
    "../assets/images/round2_2.png",
    "../assets/images/round2_3.png",
    "../assets/images/round2_4.png",
    "../assets/images/round2_5.png",
    "../assets/images/round2_6.png",
    "../assets/images/round2_7.png",
    "../assets/images/round2_8.png",
    "../assets/images/round2_9.png",
    "../assets/images/round2_10.png"
  ];


  startRound1Btn.addEventListener("click", () => {
    gsap.to(introPopupEl, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        introPopupEl.classList.add("hidden");
        startRound1();
      }
    });
  });


  function startRound1() {
    shuffleArray(emailPool);
    const pickCount = Math.floor(Math.random() * 2) + 5;
    emails = emailPool.slice(0, pickCount);
    totalEmails = pickCount;
    currentEmailIndex = 0;
    round1Correct = 0;
    score = 0;
    updateScore(0);
    isEmailClassified = {};

    round1Container.classList.remove("hidden");
    round2Container.classList.add("hidden");
    endLevelPopup.classList.add("hidden");
    round1ResultsPopup.classList.add("hidden");
    round2RetryPopup.classList.add("hidden");

    loadInbox();
    clearEmailPreview();
  }

  function loadInbox() {
    inboxEl.innerHTML = "";
    emails.forEach((em, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${em.sender}</strong><br>${em.subject}`;
      if (i > currentEmailIndex) {
        li.style.filter = "brightness(0.3)";
        const lockImg = document.createElement("img");
        lockImg.src = "../assets/images/lock-icon.png";
        lockImg.alt = "Locked";
        lockImg.className = "lock-symbol";
        li.appendChild(lockImg);
      }
      li.addEventListener("click", () => {
        if (i > currentEmailIndex) {
          showPopup("You must classify the previous email first!");
        } else {
          showEmail(i);
          inboxEl.querySelectorAll("li").forEach(l => l.classList.remove("selectedEmail"));
          li.classList.add("selectedEmail");
        }
      });
      inboxEl.appendChild(li);
    });
  }

  function showEmail(idx) {
    const emailObj = emails[idx];
    emailTitleEl.textContent = emailObj.subject;
    emailContentEl.innerHTML = emailObj.content;
    gsap.fromTo("#emailContent", { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 });

    const redFlags = emailContentEl.querySelectorAll(".redflag");
    redFlags.forEach((rf) => {
      rf.addEventListener("click", function handler() {
        if (!this.classList.contains("flagged")) {
          this.classList.add("flagged");
          updateScore(5);
        }
        this.removeEventListener("click", handler);
      });
    });

    const ctas = emailContentEl.querySelectorAll(".email-action");
    ctas.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (emailObj.phishing) {
          triggerHackSimulation();
          updateScore(-5);
        }
      });
    });

    document.getElementById("legitBtn").onclick = () => classifyEmail(idx, false);
    document.getElementById("phishingBtn").onclick = () => classifyEmail(idx, true);
  }

  function classifyEmail(idx, userChoicePhish) {
    if (isEmailClassified[idx]) {
      showPopup("You already classified this email!");
      return;
    }
    isEmailClassified[idx] = true;

    const emailObj = emails[idx];
    if (userChoicePhish === emailObj.phishing) {
      updateScore(10);
      round1Correct++;
    } else {
      updateScore(-5);
    }

    animateChoiceBubble(idx, userChoicePhish);

    currentEmailIndex++;
    if (currentEmailIndex >= totalEmails) {
      setTimeout(endRound1, 1000);
    } else {
      loadInbox();
      clearEmailPreview();
    }
  }


  function animateChoiceBubble(idx, isPhish) {
    const li = inboxEl.querySelectorAll("li")[idx];

    const lockIcon = li.querySelector(".lock-symbol");
    if (lockIcon) lockIcon.remove();


    const label = document.createElement("div");
    label.textContent = isPhish ? "SPAM" : "SAFE";
    label.style.position = "absolute";
    label.style.background = isPhish ? "red" : "#39ff14";
    label.style.color = "#000";
    label.style.padding = "5px 10px";
    label.style.borderRadius = "8px";
    label.style.fontSize = "1rem";
    label.style.zIndex = "3000";
    label.style.fontWeight = "bold";
    document.body.appendChild(label);

    const previewRect = document.getElementById("emailPreviewPanel").getBoundingClientRect();
    const liRect = li.getBoundingClientRect();


    label.style.left = (previewRect.left + previewRect.width / 2) + "px";
    label.style.top = (previewRect.top + previewRect.height / 2) + "px";

    gsap.to(label, {
      x: liRect.left - previewRect.left + 30,
      y: liRect.top - previewRect.top - 10,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        label.remove();

        li.style.position = "relative";
        const finalBubble = document.createElement("div");
        finalBubble.textContent = isPhish ? "SPAM" : "SAFE";
        finalBubble.style.position = "absolute";
        finalBubble.style.top = "5px";
        finalBubble.style.right = "5px";
        finalBubble.style.background = isPhish ? "red" : "#39ff14";
        finalBubble.style.color = "#000";
        finalBubble.style.padding = "3px 8px";
        finalBubble.style.borderRadius = "8px";
        finalBubble.style.fontSize = "1rem";
        finalBubble.style.fontWeight = "bold";
        finalBubble.style.zIndex = "500";
        li.appendChild(finalBubble);
      }
    });
  }

  function clearEmailPreview() {
    emailTitleEl.textContent = "Email Preview";
    emailContentEl.innerHTML = "";
  }

  function endRound1() {
    round1Container.classList.add("hidden");
    round1ResultsEl.textContent = `You classified ${round1Correct} out of ${totalEmails} emails correctly! Your score: ${score}`;
    round1ResultsPopup.classList.remove("hidden");
  }

  document.getElementById("goRound2Btn").addEventListener("click", () => {
    round1ResultsPopup.classList.add("hidden");
    round2StoryPopup.classList.remove("hidden");
  });


  startRound2Btn.addEventListener("click", () => {
    round2StoryPopup.classList.add("hidden");
    startRound2();
  });

  function startRound2() {
    round2Container.classList.remove("hidden");
    shuffleArray(round2Pool);
    round2Images = round2Pool.slice(0, round2MaxImages);
    round2Index = 0;
    round2Correct = 0;
    round2TimeLeft = 30;
    showRound2Image();
    startRound2Timer();
  }

  function showRound2Image() {
    if (round2Index >= round2Images.length) {
      endRound2();
      return;
    }
    const box = document.getElementById("round2ImageBox");
    box.innerHTML = `<img src="${round2Images[round2Index]}" alt="Message" style="max-width:100%; max-height:100%;">`;
  }

  document.getElementById("round2SafeBtn").addEventListener("click", () => classifyRound2(false));
  document.getElementById("round2PhishBtn").addEventListener("click", () => classifyRound2(true));

  function classifyRound2(isPhish) {

    const fileName = round2Images[round2Index];
    const actualPhish = fileName.includes("3") || fileName.includes("5");
    if (actualPhish === isPhish) {
      updateScore(10);
      round2Correct++;
    } else {
      updateScore(-5);
    }
    round2Index++;
    if (round2Index >= round2Images.length) {
      endRound2();
    } else {
      showRound2Image();
    }
  }

  function startRound2Timer() {
    timeLeftEl.textContent = round2TimeLeft;
    round2Timer = setInterval(() => {
      round2TimeLeft--;
      timeLeftEl.textContent = round2TimeLeft;


      gsap.fromTo("#timerBar", { scale: 1 }, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });


      if (round2TimeLeft === 5) {
        gsap.fromTo("#timerBar", { x: -4 }, {
          x: 4,
          duration: 0.1,
          repeat: 8,
          yoyo: true,
          ease: "power1.inOut"
        });
      }

      if (round2TimeLeft <= 0) {
        clearInterval(round2Timer);

        round2Container.classList.add("hidden");
        round2RetryPopup.classList.remove("hidden");
      }
    }, 1000);
  }


  retryYesBtn.addEventListener("click", () => {
    round2RetryPopup.classList.add("hidden");
    startRound2();
  });
  retryNoBtn.addEventListener("click", () => {
    round2RetryPopup.classList.add("hidden");

    endLevelMessageEl.textContent = `You ended Round 2 early. Final Score: ${score}`;
    endLevelRankEl.textContent = "No Rank";
    endLevelPopup.classList.remove("hidden");
  });

  function endRound2() {
    clearInterval(round2Timer);
    round2Container.classList.add("hidden");

    let rank = "";
    if (score >= 100) rank = "Phishing Master!";
    else if (score >= 60) rank = "Phishing Apprentice";
    else rank = "Phishing Newbie";

    endLevelMessageEl.textContent = `You got ${round2Correct} out of ${round2Images.length} correct in Round 2. Final Score: ${score}`;
    endLevelRankEl.textContent = rank;
    endLevelPopup.classList.remove("hidden");
  }


  function showPopup(msg) {
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";
    overlay.innerHTML = `
      <div class="popup-content" style="max-width:400px;">
        <p>${msg}</p>
        <button class="popup-btn" id="popupCloseBtn">OK</button>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector("#popupCloseBtn").addEventListener("click", () => {
      overlay.remove();
    });
  }


  particlesJS("particles-js", {
    particles: {
      number: { value: 40, density: { enable: true, value_area: 800 } },
      color: { value: "#39ff14" },
      shape: { type: "circle", stroke: { width: 0, color: "#000" } },
      opacity: { value: 0.5 },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 150, color: "#39ff14", opacity: 0.4, width: 1 },
      move: { enable: true, speed: 1, out_mode: "out" }
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: false }, resize: true },
      modes: { repulse: { distance: 100, duration: 0.4 } }
    },
    retina_detect: true
  });
});
