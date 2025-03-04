document.addEventListener("DOMContentLoaded", () => {
    // ---------------- Global Variables ----------------
    let currentRound = 1; // 1 or 2; quiz follows rounds
    let score = 0;
    const round1Posts = [
      {
        id: 1,
        image: "../assets/images/post1.jpg",
        caption: "Just had a great birthday party! My birthday is 05/12/2002. #celebrate",
        question: "Find the Date of Birth in this post.",
        answer: "05/12/2002"
      },
      {
        id: 2,
        image: "../assets/images/post2.jpg",
        caption: "I love my school! Studying at Sunshine Elementary.",
        question: "Find the school name in this post.",
        answer: "Sunshine Elementary"
      }
    ];
    let round2Posts = [
      {
        id: 3,
        image: "../assets/images/post3.jpg",
        caption: "Chilling at home! My address is 742 Evergreen Terrace.",
        question: "Does this post reveal private details?",
        leak: true,
        leakDetail: "Address"
      },
      {
        id: 4,
        image: "../assets/images/post4.jpg",
        caption: "Enjoying the park! Nothing personal here.",
        question: "Does this post reveal private details?",
        leak: false
      }
    ];
    
    const quizQuestions = [
      {
        question: "Which of these should never be shared online?",
        options: ["Home address", "Favorite color", "Hobby"],
        answer: 0
      },
      {
        question: "What is a sign that a post may be leaking private info?",
        options: ["No hashtags", "Personal phone number", "Nice scenery"],
        answer: 1
      },
      {
        question: "Why is it dangerous to share your full name and birthday together?",
        options: ["It’s fun!", "It can be used to steal your identity", "Everyone does it"],
        answer: 1
      }
    ];
    
    let currentPostIndex = 0;
    let currentPosts = []; // set based on round
    let quizIndex = 0;
    
    // ---------------- DOM Elements ----------------
    const feedArea = document.getElementById("feedArea");
    const instructionsContent = document.getElementById("instructionsContent");
    const answerContent = document.getElementById("answerContent");
    const scoreDisplay = document.getElementById("scoreDisplay");
    const roundDisplay = document.getElementById("roundDisplay");
    
    // Popups
    const introPopup = document.getElementById("introPopup");
    const introStoryText = document.getElementById("introStoryText");
    const introStartBtn = document.getElementById("introStartBtn");
    const modePopup = document.getElementById("modePopup");
    const round1Btn = document.getElementById("round1Btn"); // we'll add these in our popup if needed
    const round2Btn = document.getElementById("round2Btn");
    const leaveGamePopup = document.getElementById("leaveGamePopup");
    const leaveYes = document.getElementById("leaveYes");
    const leaveNo = document.getElementById("leaveNo");
    const quizPopup = document.getElementById("quizPopup");
    const quizContent = document.getElementById("quizContent");
    const quizNextBtn = document.getElementById("quizNextBtn");
    const messagePopup = document.getElementById("messagePopup");
    const messageText = document.getElementById("messageText");
    const messageCloseBtn = document.getElementById("messageCloseBtn");
    
    // Terminal & Explorer Elements (if used)
    const terminalWindow = document.getElementById("terminalWindow");
    const terminalScreen = document.getElementById("terminalScreen");
    const terminalInput = document.getElementById("terminalInput");
    const explorerWindow = document.getElementById("explorerWindow");
    const explorerBackBtn = document.getElementById("explorerBackBtn");
    const explorerContent = document.getElementById("explorerContent");
    
    // ----------------- Score Update -----------------
    function updateScore() {
      scoreDisplay.textContent = "Score: " + score;
    }
    
    // ----------------- Load Next Post -----------------
    function loadNextPost() {
      if (currentPostIndex >= currentPosts.length) {
        if (currentRound === 1) {
          // Advance to Round 2
          currentRound = 2;
          roundDisplay.textContent = "Round 2";
          currentPostIndex = 0;
          currentPosts = round2Posts;
          loadNextPost();
        } else {
          // All posts done, start final quiz
          startQuiz();
        }
        return;
      }
      const post = currentPosts[currentPostIndex];
      renderPost(post);
      renderTask(post);
    }
    
    // ----------------- Render Post (Left Panel) -----------------
    function renderPost(post) {
      feedArea.innerHTML = "";
      const postDiv = document.createElement("div");
      postDiv.className = "post";
      const img = document.createElement("img");
      img.src = post.image;
      const caption = document.createElement("div");
      caption.className = "caption";
      caption.textContent = post.caption;
      postDiv.appendChild(img);
      postDiv.appendChild(caption);
      feedArea.appendChild(postDiv);
    }
    
    // ----------------- Render Task (Right Bottom Window) -----------------
    function renderTask(post) {
      answerContent.innerHTML = "";
      if (currentRound === 1) {
        // Round 1: Identification Challenge
        const q = document.createElement("p");
        q.textContent = post.question;
        q.style.fontSize = "1.4rem";
        q.style.marginBottom = "10px";
        const input = document.createElement("input");
        input.type = "text";
        input.id = "roundAnswerInput";
        input.placeholder = "Type your answer...";
        input.style.fontSize = "1.4rem";
        const submitBtn = document.createElement("button");
        submitBtn.className = "popup-btn";
        submitBtn.textContent = "Submit";
        submitBtn.addEventListener("click", () => {
          const userAns = input.value.trim();
          if (userAns === "") {
            showMessage("Please enter an answer!");
            return;
          }
          if (userAns.toLowerCase().includes(post.answer.toLowerCase())) {
            showMessage("Correct!");
            score += 10;
            updateScore();
            currentPostIndex++;
            setTimeout(loadNextPost, 1000);
          } else {
            showMessage("Incorrect. Hint: Look closely at the caption.");
          }
        });
        answerContent.appendChild(q);
        answerContent.appendChild(input);
        answerContent.appendChild(submitBtn);
      } else if (currentRound === 2) {
        // Round 2: Leak Evaluation Challenge
        const q = document.createElement("p");
        q.textContent = post.question;
        q.style.fontSize = "1.4rem";
        q.style.marginBottom = "10px";
        const yesNoDiv = document.createElement("div");
        yesNoDiv.style.marginBottom = "10px";
        const yesBtn = document.createElement("button");
        yesBtn.className = "popup-btn";
        yesBtn.textContent = "Yes";
        const noBtn = document.createElement("button");
        noBtn.className = "popup-btn";
        noBtn.textContent = "No";
        yesNoDiv.appendChild(yesBtn);
        yesNoDiv.appendChild(noBtn);
        answerContent.appendChild(q);
        answerContent.appendChild(yesNoDiv);
        
        const dropdownDiv = document.createElement("div");
        dropdownDiv.style.display = "none";
        dropdownDiv.style.marginTop = "10px";
        const select = document.createElement("select");
        const options = ["Full Name", "Address", "Birthday", "Phone Number", "Email"];
        options.forEach(opt => {
          const option = document.createElement("option");
          option.value = opt;
          option.textContent = opt;
          select.appendChild(option);
        });
        dropdownDiv.appendChild(select);
        answerContent.appendChild(dropdownDiv);
        
        noBtn.addEventListener("click", () => {
          if (post.leak) {
            showMessage("Incorrect. Private details are leaking!");
          } else {
            showMessage("Correct! No leaks detected.");
            score += 10;
            updateScore();
          }
          currentPostIndex++;
          setTimeout(loadNextPost, 1000);
        });
        
        yesBtn.addEventListener("click", () => {
          if (!post.leak) {
            showMessage("Incorrect. This post does not reveal private details.");
            currentPostIndex++;
            setTimeout(loadNextPost, 1000);
          } else {
            dropdownDiv.style.display = "block";
            select.addEventListener("change", (e) => {
              if (e.target.value === post.leakDetail) {
                showMessage("Correct! You identified the leak.");
                score += 10;
                updateScore();
                currentPostIndex++;
                setTimeout(loadNextPost, 1000);
              } else {
                showMessage("Incorrect. Try again.");
              }
            });
          }
        });
      }
    }
    
    // ----------------- Final Quiz -----------------
    let quizCurrentIndex = 0;
    function startQuiz() {
      quizCurrentIndex = 0;
      showQuizQuestion();
    }
    
    function showQuizQuestion() {
      if (quizCurrentIndex >= quizQuestions.length) {
        showQuizResult();
        return;
      }
      quizContent.innerHTML = "";
      const currentQuiz = quizQuestions[quizCurrentIndex];
      const quizDiv = document.createElement("div");
      quizDiv.className = "quiz-question";
      const qP = document.createElement("p");
      qP.textContent = currentQuiz.question;
      qP.style.fontSize = "1.5rem";
      qP.style.marginBottom = "15px";
      quizDiv.appendChild(qP);
      
      currentQuiz.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.className = "popup-btn";
        btn.style.margin = "5px";
        btn.textContent = opt;
        btn.addEventListener("click", () => {
          if (i === currentQuiz.answer) {
            quizCurrentIndex++;
            showQuizQuestion();
          } else {
            shakePopup(quizPopup);
          }
        });
        quizDiv.appendChild(btn);
      });
      quizContent.appendChild(quizDiv);
      showPopup(quizPopup);
    }
    
    function showQuizResult() {
      quizContent.innerHTML = `<p style="font-size:1.5rem;">You answered all quiz questions correctly!</p>`;
      spawnConfettiQuiz();
      const playAgainBtn = document.createElement("button");
      playAgainBtn.className = "popup-btn";
      playAgainBtn.textContent = "Play Again";
      playAgainBtn.addEventListener("click", () => {
        hidePopup(quizPopup);
        initLevel3();
      });
      const nextLevelBtn = document.createElement("button");
      nextLevelBtn.className = "popup-btn";
      nextLevelBtn.textContent = "Next Level";
      nextLevelBtn.addEventListener("click", () => {
        window.location.href = "level4.html";
      });
      quizContent.appendChild(playAgainBtn);
      quizContent.appendChild(nextLevelBtn);
      showPopup(quizPopup);
    }
    
    function spawnConfettiQuiz() {
      for (let i = 0; i < 20; i++) {
        const conf = document.createElement("div");
        conf.style.position = "absolute";
        conf.style.width = "15px";
        conf.style.height = "15px";
        conf.style.borderRadius = "50%";
        conf.style.backgroundColor = getRandomColor();
        conf.style.left = Math.random() * 80 + "%";
        conf.style.top = "0px";
        conf.style.zIndex = 9999;
        quizContent.appendChild(conf);
        gsap.to(conf, {
          y: 150 + Math.random() * 100,
          x: (Math.random() - 0.5) * 200,
          rotation: 360 * Math.random(),
          duration: 1.5 + Math.random(),
          ease: "power1.out",
          onComplete: () => conf.remove()
        });
      }
    }
    
    function getRandomColor() {
      const colors = ["#ff4757", "#2ed573", "#1e90ff", "#ff6b81", "#ffa502", "#70a1ff"];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // ----------------- Message Popup Utility -----------------
    function showMessage(msg) {
      const overlay = document.createElement("div");
      overlay.className = "popup-overlay fancy-popup";
      overlay.innerHTML = `
        <div class="popup-content popup-animated" style="max-width:400px;">
          <p>${msg}</p>
          <button class="popup-btn" id="msgCloseBtn">OK</button>
        </div>
      `;
      document.body.appendChild(overlay);
      const content = overlay.querySelector(".popup-content");
      gsap.fromTo(content, {opacity:0, scale:0.8}, {opacity:1, scale:1, duration:0.3, ease:"power2.out"});
      overlay.querySelector("#msgCloseBtn").addEventListener("click", () => {
        gsap.to(content, {
          opacity:0, scale:0.8, duration:0.3, ease:"power2.in", onComplete:()=>overlay.remove()
        });
      });
    }
    
    // ----------------- Terminal Functions -----------------
    let terminalCurrentFolder = fileSystem;
    function showTerminal() {
      explorerWindow.classList.add("hidden");
      terminalWindow.classList.remove("hidden");
      terminalCurrentFolder = fileSystem;
      terminalScreen.textContent = "Welcome to Terminal Mode.\nType 'ls' to list, 'cd folderName' to enter, 'cat file.txt' to read.\n";
      terminalInput.value = "";
      terminalInput.focus();
    }
    
    terminalInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = terminalInput.value.trim();
        terminalInput.value = "";
        processTerminalCommand(cmd);
      }
    });
    
    function processTerminalCommand(cmd) {
      if (!cmd) return;
      terminalScreen.textContent += `\n$ ${cmd}\n`;
      const parts = cmd.split(" ");
      const mainCmd = parts[0];
      const arg = parts[1] || "";
    
      switch (mainCmd) {
        case "ls":
          listFolder(terminalCurrentFolder);
          break;
        case "cd":
          if (!arg) {
            terminalScreen.textContent += "Usage: cd <folderName>\n";
          } else {
            changeDirectory(arg);
          }
          break;
        case "cat":
          if (!arg) {
            terminalScreen.textContent += "Usage: cat <filename>\n";
          } else {
            catFile(arg);
          }
          break;
        default:
          terminalScreen.textContent += `Unknown command: ${mainCmd}\n`;
      }
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }
    
    function listFolder(folder) {
      folder.children?.forEach(item => {
        terminalScreen.textContent += (item.type === "folder") ? (item.name + "/\n") : (item.name + "\n");
      });
    }
    
    function changeDirectory(folderName) {
      if (folderName === "..") {
        terminalCurrentFolder = fileSystem;
        terminalScreen.textContent += "Moved back to root.\n";
        return;
      }
      const target = terminalCurrentFolder.children?.find(
        c => c.type === "folder" && c.name === folderName
      );
      if (!target) {
        terminalScreen.textContent += `Folder not found: ${folderName}\n`;
      } else {
        terminalCurrentFolder = target;
        terminalScreen.textContent += `Entered folder: ${folderName}\n`;
      }
    }
    
    function catFile(fileName) {
      const target = terminalCurrentFolder.children?.find(
        c => c.type === "file" && c.name === fileName
      );
      if (!target) {
        terminalScreen.textContent += `File not found: ${fileName}\n`;
      } else {
        terminalScreen.textContent += `--- ${fileName} ---\n${target.content}\n`;
      }
    }
    
    // ----------------- File Explorer Functions -----------------
    let currentFolder = fileSystem;
    explorerBackBtn.addEventListener("click", () => {
      currentFolder = fileSystem;
      renderExplorerFolder(fileSystem);
    });
    
    function showExplorer() {
      terminalWindow.classList.add("hidden");
      explorerWindow.classList.remove("hidden");
      currentFolder = fileSystem;
      renderExplorerFolder(currentFolder);
    }
    
    function renderExplorerFolder(folder) {
      explorerContent.innerHTML = `<h3>Folder: ${folder.name}</h3>`;
      const grid = document.createElement("div");
      grid.className = "explorer-grid";
      folder.children?.forEach(item => {
        const div = document.createElement("div");
        div.className = "explorer-item";
        const iconImg = document.createElement("img");
        iconImg.src = (item.type === "folder")
          ? "../assets/images/folder-icon.png"
          : "../assets/images/textfile-icon.png";
        div.appendChild(iconImg);
        const nameSpan = document.createElement("span");
        nameSpan.textContent = item.name;
        div.appendChild(nameSpan);
        div.addEventListener("dblclick", () => {
          if (item.type === "folder") {
            currentFolder = item;
            renderExplorerFolder(item);
          } else {
            showFileContentPopup(item);
          }
        });
        grid.appendChild(div);
      });
      explorerContent.appendChild(grid);
    }
    
    function showFileContentPopup(fileObj) {
      const overlay = document.createElement("div");
      overlay.className = "popup-overlay fancy-popup";
      overlay.innerHTML = `
        <div class="popup-content popup-animated" style="max-width:400px;">
          <h3>${fileObj.name}</h3>
          <p>${fileObj.content}</p>
          <button class="popup-btn" id="closeFileBtn">Close</button>
        </div>
      `;
      document.body.appendChild(overlay);
      const content = overlay.querySelector(".popup-content");
      gsap.fromTo(content, {opacity:0, scale:0.8}, {opacity:1, scale:1, duration:0.3, ease:"power2.out"});
      overlay.querySelector("#closeFileBtn").addEventListener("click", () => {
        gsap.to(content, {opacity:0, scale:0.8, duration:0.3, ease:"power2.in", onComplete:()=>overlay.remove()});
      });
    }
    
    // ----------------- Sample File System Data -----------------
    const fileSystem = {
      name: "root",
      type: "folder",
      children: [
        {
          name: "Secrets",
          type: "folder",
          children: [
            { name: "clue.txt", type: "file", content: `Clue: The ${chosen.name} might be in data.txt!` },
            { name: "data.txt", type: "file", content: `Match: ${chosen.value}` }
          ]
        },
        {
          name: "Docs",
          type: "folder",
          children: [
            { name: "notes.txt", type: "file", content: "Some infiltration notes" }
          ]
        },
        {
          name: "images",
          type: "folder",
          children: [
            { name: "random.png", type: "file", content: "An irrelevant image" }
          ]
        }
      ]
    };
    
    // ----------------- Particle Background (Optional) -----------------
    const bgCanvas = document.getElementById("levelCanvas");
    if (bgCanvas) {
      const ctx = bgCanvas.getContext("2d");
      let w = bgCanvas.width = window.innerWidth;
      let h = bgCanvas.height = window.innerHeight;
      class Particle {
        constructor() {
          this.x = Math.random() * w;
          this.y = Math.random() * h;
          this.dx = (Math.random()-0.5)*0.7;
          this.dy = (Math.random()-0.5)*0.7;
          this.size = Math.random()*2+1;
        }
        update() {
          this.x += this.dx;
          this.y += this.dy;
          if (this.x < 0) this.x = w; else if (this.x > w) this.x = 0;
          if (this.y < 0) this.y = h; else if (this.y > h) this.y = 0;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
          ctx.fillStyle = "rgba(50,205,50,0.6)";
          ctx.fill();
        }
      }
      const parts = [];
      for (let i = 0; i < 80; i++) { parts.push(new Particle()); }
      function animateParts() {
        ctx.clearRect(0, 0, w, h);
        parts.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParts);
      }
      animateParts();
      window.addEventListener("resize", () => {
        w = bgCanvas.width = window.innerWidth;
        h = bgCanvas.height = window.innerHeight;
      });
    }
    
    // ----------------- POPUP UTILS -----------------
    function showPopup(overlay) {
      overlay.classList.remove("hidden");
      const content = overlay.querySelector(".popup-content");
      if (content) {
        content.style.opacity = 0;
        content.style.transform = "scale(0.8)";
        gsap.to(content, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
      }
    }
    function hidePopup(overlay) {
      const content = overlay.querySelector(".popup-content");
      if (content) {
        gsap.to(content, { opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.in", onComplete: () => { overlay.classList.add("hidden"); } });
      }
    }
    
    // ----------------- INITIALIZE LEVEL 3 -----------------
    initLevel3();
  });
  