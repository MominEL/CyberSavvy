document.addEventListener("DOMContentLoaded", () => {
    // ---------------------------
    // Utility: showPopup & hidePopup
    // ---------------------------
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
  
    // ---------------------------
    // BUBBLE MENU & LEAVE GAME
    // ---------------------------
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
  
    // ---------------------------
    // INTRO POPUP & SLOW TYPING
    // ---------------------------
    const introPopup = document.getElementById("introPopup");
    const introStoryText = document.getElementById("introStoryText");
    const introStartBtn = document.getElementById("introStartBtn");
  
    // Our possible secrets
    const possibleTargets = [
      { name: "Birthday", value: "05/12/2002" },
      { name: "PIN Code", value: "1337" },
      { name: "Favorite Color", value: "Magenta" },
      { name: "Magic Word", value: "Abracadabra" },
      { name: "Top Secret Code", value: "XYZ-123" },
      { name: "Secret Phrase", value: "OpenSesame" }
    ];
  
    let currentRound = 1;  // We'll do 2 rounds total
    let chosen = pickNewSecret();
  
    function pickNewSecret() {
      return possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
    }
  
    function startTypingStory() {
      const typedStory = `Round ${currentRound}:\nYour mission: locate the ${chosen.name} secret.\nSearch every folder – the truth is hidden!`;
      let idx = 0;
      introStoryText.textContent = "";
      function typeOneChar() {
        if (idx < typedStory.length) {
          introStoryText.textContent += typedStory.charAt(idx);
          idx++;
          setTimeout(typeOneChar, 50);
        }
      }
      typeOneChar();
    }
  
    // Show intro popup
    showPopup(introPopup);
    startTypingStory();
  
    introStartBtn.addEventListener("click", () => {
      hidePopup(introPopup);
      showPopup(modePopup);
    });
  
    // ---------------------------
    // MODE POPUP
    // ---------------------------
    const modePopup = document.getElementById("modePopup");
    const explorerBtn = document.getElementById("explorerBtn");
    const terminalBtn = document.getElementById("terminalBtn");
    let currentMode = "explorer";
  
    explorerBtn.addEventListener("click", () => {
      currentMode = "explorer";
      hidePopup(modePopup);
      showExplorer();
      document.getElementById("instructionsText").innerHTML =
        `<h2 style="font-size:1.8rem; color:#FFD700;">File Explorer Mode</h2>
         <p style="font-size:1.4rem;">Double-click folders to open them and search for the secret <span class="secret-name">${chosen.name}</span>!</p>`;
    });
    terminalBtn.addEventListener("click", () => {
      currentMode = "terminal";
      hidePopup(modePopup);
      showTerminal();
      document.getElementById("instructionsText").innerHTML =
        `<h2 style="font-size:1.8rem; color:#FFD700;">Terminal Mode</h2>
         <p style="font-size:1.4rem;">Use commands to navigate and search for the secret <span class="secret-name">${chosen.name}</span>!</p>
         <ul style="font-size:1.4rem;">
           <li><code style="color:#FFD700;">ls</code> - list files/folders</li>
           <li><code style="color:#FFD700;">cd folderName</code> - enter folder</li>
           <li><code style="color:#FFD700;">cat file.txt</code> - read file</li>
           <li><code style="color:#FFD700;">cd ..  </code> - Go back</li>
         </ul>`;
    });
  
    // ---------------------------
    // ANSWER SUBMISSION (2-round secret)
    // ---------------------------
    const answerInput = document.getElementById("answerInput");
    const submitAnswerBtn = document.getElementById("submitAnswerBtn");
  
    submitAnswerBtn.addEventListener("click", () => {
      const userAnswer = answerInput.value.trim();
      if (!userAnswer) {
        showInPagePopup("Please enter an answer!");
        return;
      }
      if (userAnswer.toLowerCase() === chosen.value.toLowerCase()) {
        if (currentRound === 1) {
          showInPagePopup(`ACCESS GRANTED!\nYou found the ${chosen.name} secret.\nNow, your next mission: find the secret <strong>${pickNewSecret().name}</strong>.`);
          currentRound = 2;
          const newSecret = pickNewSecret();
          chosen = newSecret; // keep it consistent
          buildExplorerStructure(chosen.value);
          buildTerminalFileSystem(chosen.value);
          answerInput.value = "";
          if (currentMode === "explorer") {
            document.getElementById("instructionsText").innerHTML =
              `<h2 style="font-size:1.8rem; color:#FFD700;">File Explorer Mode</h2>
               <p style="font-size:1.4rem;">Now search for the secret <span class="secret-name">${chosen.name}</span>!</p>`;
          } else {
            document.getElementById("instructionsText").innerHTML =
              `<h2 style="font-size:1.8rem; color:#FFD700;">Terminal Mode</h2>
               <p style="font-size:1.4rem;">Now search for the secret <span class="secret-name">${chosen.name}</span>!</p>`;
          }
        } else {
          showInPagePopup(`ACCESS GRANTED!\nExcellent! You found the secret: ${chosen.name} = ${chosen.value}.\nLevel Complete!`);
          triggerConfetti();
          setTimeout(() => {
            showLevelCompletePopup();
          }, 1500);
        }
      } else {
        showInPagePopup(`ACCESS DENIED!\nKeep searching for the secret ${chosen.name}!`);
      }
    });
  
    function showLevelCompletePopup() {
      const overlay = document.createElement("div");
      overlay.className = "popup-overlay fancy-popup";
      overlay.innerHTML =
        `<div class="popup-content final-popup" style="max-width:500px; font-size:1.6rem;">
           <img src="../assets/images/hacker-normal.png" alt="Hacker">
           <div>
             <h2>Level Complete!</h2>
             <p>You found both secrets and proved your hacking skills! Great job, hacker!</p>
             <div>
               <button class="popup-btn" id="replayBtn">Play Again</button>
               <button class="popup-btn" id="goLevel3Btn">Go to Level 3</button>
             </div>
           </div>
         </div>`;
      document.body.appendChild(overlay);
      const content = overlay.querySelector(".popup-content");
      gsap.fromTo(content, {opacity:0, scale:0.8}, {opacity:1, scale:1, duration:0.4, ease:"power2.out"});
      overlay.querySelector("#replayBtn").addEventListener("click", () => {
        window.location.reload();
      });
      overlay.querySelector("#goLevel3Btn").addEventListener("click", () => {
        window.location.href = "../levels/level3.html";
      });
    }
  
    // ---------------------------
    // TERMINAL vs. EXPLORER
    // ---------------------------
    const terminalWindow = document.getElementById("terminalWindow");
    const explorerWindow = document.getElementById("explorerWindow");
    let terminalCurrentFolder = null;
  
    function showTerminal() {
      explorerWindow.classList.add("hidden");
      terminalWindow.classList.remove("hidden");
      terminalCurrentFolder = fileSystem;
      terminalScreen.textContent = "Welcome to Terminal Mode.\nType 'ls' to list, 'cd folderName' to enter, 'cat file.txt' to read.\n";
      createNewPromptLine();
    }
    function showExplorer() {
      terminalWindow.classList.add("hidden");
      explorerWindow.classList.remove("hidden");
    }
  
    // ---------------------------
    // Terminal Logic
    // ---------------------------
    const terminalScreen = document.getElementById("terminalScreen");
  
    // Create each prompt line in the same background color
    function createNewPromptLine() {
      const lineContainer = document.createElement("div");
      lineContainer.className = "terminal-line";
      lineContainer.style.marginBottom = "10px"; // extra spacing
  
      // Prompt text
      const promptSpan = document.createElement("span");
      promptSpan.className = "prompt";
      promptSpan.textContent = "user@machine:~$ ";
      lineContainer.appendChild(promptSpan);
  
      // The user’s contenteditable input
      const inputSpan = document.createElement("span");
      inputSpan.className = "terminal-input";
      inputSpan.contentEditable = "true";
      lineContainer.appendChild(inputSpan);
  
      terminalScreen.appendChild(lineContainer);
      inputSpan.focus();
  
      inputSpan.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const cmd = inputSpan.textContent.trim();
  
          // Finalize line
          lineContainer.removeChild(inputSpan);
          lineContainer.textContent = promptSpan.textContent + cmd;
  
          // Process command => show results
          processTerminalCommand(cmd);
  
          // Create next line
          createNewPromptLine();
        }
      });
  
      // Always scroll to bottom
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }
  
    function processTerminalCommand(cmd) {
      if (!cmd) return;
      const parts = cmd.split(" ");
      const mainCmd = parts[0];
      const arg = parts[1] || "";
      switch (mainCmd) {
        case "ls":
          handleLS();
          break;
        case "cd":
          if (!arg) {
            appendOutputLine("Usage: cd <folderName>");
          } else {
            handleCD(arg);
          }
          break;
        case "cat":
          if (!arg) {
            appendOutputLine("Usage: cat <filename>");
          } else {
            handleCAT(arg);
          }
          break;
        default:
          appendOutputLine(`Unknown command: ${mainCmd}`);
      }
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }
  
    function appendOutputLine(text) {
      const outLine = document.createElement("div");
      outLine.style.marginBottom = "10px"; // extra spacing for output
      outLine.textContent = text;
      terminalScreen.appendChild(outLine);
    }
  
    function handleLS() {
      if (!terminalCurrentFolder || !terminalCurrentFolder.children) return;
      terminalCurrentFolder.children.forEach(item => {
        appendOutputLine(item.type === "folder" ? item.name + "/" : item.name);
      });
    }
  
    function handleCD(folderName) {
      if (folderName === "..") {
        terminalCurrentFolder = fileSystem;
        appendOutputLine("Moved back to root.");
        return;
      }
      const target = terminalCurrentFolder.children.find(
        c => c.type === "folder" && c.name === folderName
      );
      if (!target) {
        appendOutputLine(`Folder not found: ${folderName}`);
      } else {
        terminalCurrentFolder = target;
        appendOutputLine(`Entered folder: ${folderName}`);
      }
    }
  
    function handleCAT(fileName) {
      if (!terminalCurrentFolder || !terminalCurrentFolder.children) return;
      const target = terminalCurrentFolder.children.find(
        c => c.type === "file" && c.name === fileName
      );
      if (!target) {
        appendOutputLine(`File not found: ${fileName}`);
      } else {
        appendOutputLine(`--- ${fileName} ---\n${target.content}`);
      }
    }
  
    // ---------------------------
    // File Explorer Logic
    // ---------------------------
    const explorerList = document.getElementById("explorerList");
    const goBackBtn = document.getElementById("goBackBtn");
    const fileViewer = document.getElementById("fileViewer");
    const viewerFilename = document.getElementById("viewerFilename");
    const viewerContent = document.getElementById("viewerContent");
    const closeFileBtn = document.getElementById("closeFileBtn");
    const currentPathSpan = document.getElementById("currentPath");
  
    goBackBtn.addEventListener("click", () => {
      explorerList.querySelectorAll('.folder').forEach(folder => {
        folder.classList.remove('open');
      });
      updateCurrentPath("root");
    });
    closeFileBtn.addEventListener("click", () => {
      fileViewer.classList.add("hidden");
    });
  
    let fileSystem = {};
  
    function buildExplorerStructure(secretValue) {
      const extraFolders = [
        { name: "Archive", children: [{ name: "old.txt", content: "Outdated data..." }] },
        { name: "Projects", children: [{ name: "plan.doc", content: "Project plan details..." }] },
        { name: "Logs", children: [{ name: "error.log", content: "No errors found." }] }
      ];
      const randomFolders = ["Candy", "Cartoons", "Music", "Mystery", "Hidden", "Stuff", "Work", "Games"];
      const secretFolderName = randomFolders[Math.floor(Math.random() * randomFolders.length)];
  
      let structure = [
        {
          name: "Documents",
          children: [
            { name: "info.txt", content: "Nothing important here." },
            { name: "notes.txt", content: "Just some notes..." }
          ]
        },
        {
          name: secretFolderName,
          children: [
            { name: "clue.txt", content: "Maybe the secret is in another file!" },
            { name: generateWeirdFilename(), content: `Hidden SECRET: ${secretValue}` }
          ]
        },
        {
          name: "Images",
          children: [
            { name: "cool-pic.png", content: "This is just a random image." }
          ]
        },
        {
          name: "Music",
          children: [
            { name: "song.mp3", content: "Imagine hearing music here." }
          ]
        }
      ];
      structure = structure.concat(extraFolders);
      structure.sort(() => Math.random() - 0.5);
  
      explorerList.innerHTML = "";
      structure.forEach(folderObj => {
        const li = createFolderItem(folderObj);
        explorerList.appendChild(li);
      });
      updateCurrentPath("root");
      wireExplorerEvents();
    }
  
    function buildTerminalFileSystem(secretValue) {
      const randomFolders = ["Candy", "Cartoons", "Music", "Mystery", "Hidden", "Stuff", "Work", "Games"];
      const secretFolderName = randomFolders[Math.floor(Math.random() * randomFolders.length)];
  
      fileSystem = {
        name: "root",
        type: "folder",
        children: [
          {
            name: "Documents",
            type: "folder",
            children: [
              { name: "info.txt", type: "file", content: "Nothing important here." },
              { name: "notes.txt", type: "file", content: "Just some notes..." }
            ]
          },
          {
            name: secretFolderName,
            type: "folder",
            children: [
              { name: "clue.txt", type: "file", content: "Maybe the secret is in another file!" },
              { name: generateWeirdFilename(), type: "file", content: `Hidden SECRET: ${secretValue}` }
            ]
          },
          {
            name: "Images",
            type: "folder",
            children: [
              { name: "cool-pic.png", type: "file", content: "This is just a random image." }
            ]
          },
          {
            name: "Music",
            type: "folder",
            children: [
              { name: "song.mp3", type: "file", content: "Imagine hearing music here." }
            ]
          }
        ]
      };
    }
  
    function generateWeirdFilename() {
      const randomWords = ["glitch", "x19", "secretX", "mydata", "hiddenX", "zzz9"];
      const ext = ["txt", "dat", "cfg", "log"];
      const w = randomWords[Math.floor(Math.random() * randomWords.length)];
      const e = ext[Math.floor(Math.random() * ext.length)];
      return `${w}.${e}`;
    }
  
    function createFolderItem(folderObj) {
      const li = document.createElement("li");
      li.className = "folder";
  
      const div = document.createElement("div");
      div.className = "folder-item";
      div.innerHTML = `<i class="fas fa-folder"></i> ${folderObj.name}`;
      li.appendChild(div);
  
      const subUl = document.createElement("ul");
      folderObj.children.forEach(child => {
        if (child.children) {
          subUl.appendChild(createFolderItem(child));
        } else {
          const fileLi = document.createElement("li");
          fileLi.className = "file";
          fileLi.dataset.name = child.name;
          fileLi.dataset.content = child.content;
          const fileDiv = document.createElement("div");
          fileDiv.className = "file-item";
          fileDiv.innerHTML = `<i class="fas fa-file-alt"></i> ${child.name}`;
          fileLi.appendChild(fileDiv);
          subUl.appendChild(fileLi);
        }
      });
      li.appendChild(subUl);
      return li;
    }
  
    function wireExplorerEvents() {
      explorerList.querySelectorAll('.folder-item').forEach(folder => {
        folder.addEventListener('dblclick', () => {
          const parent = folder.closest('.folder');
          parent.classList.toggle('open');
          updateCurrentPath(parent);
        });
      });
      explorerList.querySelectorAll('.file-item').forEach(file => {
        file.addEventListener('dblclick', () => {
          const parent = file.closest('.file');
          const fileName = parent.dataset.name;
          const fileContent = parent.dataset.content;
          viewerFilename.textContent = fileName;
          viewerContent.textContent = fileContent;
          if (fileContent.includes("Hidden SECRET:")) {
            closeFileBtn.style.backgroundColor = "green";
            closeFileBtn.style.color = "white";
          } else {
            closeFileBtn.style.backgroundColor = "red";
            closeFileBtn.style.color = "white";
          }
          fileViewer.classList.remove('hidden');
        });
      });
    }
  
    function updateCurrentPath(folder) {
      if (typeof folder === "string") {
        currentPathSpan.textContent = "Current Folder: " + folder;
      } else {
        const name = folder.querySelector('.folder-item').textContent.trim();
        currentPathSpan.textContent = "Current Folder: " + name;
      }
    }
  
    // Initialize the file systems with the first secret
    buildExplorerStructure(chosen.value);
    buildTerminalFileSystem(chosen.value);
  
    // ---------------------------
    // Confetti
    // ---------------------------
    function triggerConfetti() {
      const confettiCount = 150;
      for (let i = 0; i < confettiCount; i++) {
        createConfettiParticle();
      }
    }
    function createConfettiParticle() {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      const colors = ['#ff0', '#0f0', '#0ff', '#f0f', '#f00', '#ff8c00'];
      confetti.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.zIndex = 3000;
      confetti.style.top = '-10px';
      confetti.style.left = (Math.random() * window.innerWidth) + 'px';
      document.body.appendChild(confetti);
      const endPos = window.innerHeight + 50;
      const xOffset = (Math.random()-0.5)*300;
      gsap.to(confetti, {
        duration: 3 + Math.random()*2,
        y: endPos,
        x: `+=${xOffset}`,
        rotation: Math.random()*720,
        onComplete: () => confetti.remove()
      });
    }
  
    // ---------------------------
    // Final Popup for Level Complete
    // ---------------------------
    function showLevelCompletePopup() {
      const overlay = document.createElement("div");
      overlay.className = "popup-overlay fancy-popup";
      overlay.innerHTML =
        `<div class="popup-content final-popup" style="max-width:500px; font-size:1.6rem;">
           <img src="../assets/images/hacker-normal.png" alt="Hacker">
           <div>
             <h2>Level Complete!</h2>
             <p>You found both secrets and proved your hacking skills! Great job, hacker!</p>
             <div>
               <button class="popup-btn" id="replayBtn">Play Again</button>
               <button class="popup-btn" id="goLevel3Btn">Go to Level 3</button>
             </div>
           </div>
         </div>`;
      document.body.appendChild(overlay);
      const content = overlay.querySelector(".popup-content");
      gsap.fromTo(content, {opacity:0, scale:0.8}, {opacity:1, scale:1, duration:0.4, ease:"power2.out"});
      overlay.querySelector("#replayBtn").addEventListener("click", () => {
        window.location.reload();
      });
      overlay.querySelector("#goLevel3Btn").addEventListener("click", () => {
        window.location.href = "../levels/level3.html";
      });
    }
  
    // ---------------------------
    // In-Page Popup
    // ---------------------------
    function showInPagePopup(msg) {
      // Check if we have "ACCESS GRANTED" or "ACCESS DENIED" to apply special style
      let styleClass = "";
      if (msg.includes("ACCESS GRANTED")) {
        styleClass = "popup-access-granted"; 
      } else if (msg.includes("ACCESS DENIED")) {
        styleClass = "popup-access-denied";
      }
  
      const overlay = document.createElement("div");
      overlay.className = "popup-overlay fancy-popup";
      overlay.innerHTML =
        `<div class="popup-content popup-animated ${styleClass}" style="max-width:500px; font-size:1.6rem;">
           <p>${msg}</p>
           <button class="popup-btn" id="popupCloseBtn">OK</button>
         </div>`;
      document.body.appendChild(overlay);
      const content = overlay.querySelector(".popup-content");
      gsap.fromTo(content, {opacity:0, scale:0.8}, {opacity:1, scale:1, duration:0.3, ease:"power2.out"});
      overlay.querySelector("#popupCloseBtn").addEventListener("click", () => {
        gsap.to(content, {opacity:0, scale:0.8, duration:0.3, ease:"power2.in", onComplete:()=>overlay.remove()});
      });
    }
  });
  