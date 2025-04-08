// THEME TOGGLE
function toggleTheme() {
    const body = document.body;
    const toggleBtn = document.querySelector(".theme-toggle");
  
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
      toggleBtn.textContent = "☀️";
    } else {
      toggleBtn.textContent = "🌙";
    }
  }
  
  // AUTH LOGIC (Frontend mock only)
  function signup() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
  
    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }
  
    if (password.length < 8 || !/[A-Z]/.test(password)) {
      alert("Password must be at least 8 characters with 1 uppercase letter.");
      return;
    }
  
    localStorage.setItem("user", JSON.stringify({ name, email }));
    alert("Signup successful!");
    showApp();
  }
  
  function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
  
    const saved = JSON.parse(localStorage.getItem("user"));
  
    if (!saved || saved.email !== email) {
      alert("User not found. Please sign up first.");
      return;
    }
  
    if (password.length < 8 || !/[A-Z]/.test(password)) {
      alert("Invalid password format.");
      return;
    }
  
    alert(`Welcome back, ${saved.name}!`);
    showApp();
  }
  
  function showApp() {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("app-section").style.display = "block";
  }
  
  // VOICE GENERATION
  async function generateVoice() {
    const text = document.getElementById("text-input").value.trim();
    const voice_id = document.getElementById("voice-select").value;
    const audioPlayer = document.getElementById("audio-player");
    const downloadBtn = document.getElementById("download-btn");
  
    if (!text) {
      alert("Please enter some text.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice_id })
      });
  
      if (!response.ok) {
        alert("Something went wrong.");
        return;
      }
  
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
  
      audioPlayer.src = url;
      audioPlayer.play();
  
      downloadBtn.style.display = "inline-block";
      downloadBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = url;
        a.download = "ai-voice.mp3";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
  
      addToHistory(url, text, voice_id);
    } catch (error) {
      console.error(error);
      alert("Error generating voice.");
    }
  }
  
  function addToHistory(audioUrl, text, voice_id) {
    const historyContainer = document.getElementById("history-container");
  
    const entry = document.createElement("div");
    entry.className = "history-entry";
  
    const description = document.createElement("p");
    description.innerHTML = `<strong>Voice:</strong> ${getVoiceName(voice_id)}<br/><strong>Text:</strong> "${text}"`;
  
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = audioUrl;
  
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
      historyContainer.removeChild(entry);
    };
  
    entry.appendChild(description);
    entry.appendChild(audio);
    entry.appendChild(deleteBtn);
  
    historyContainer.prepend(entry);
  }
  
  function clearAllHistory() {
    document.getElementById("history-container").innerHTML = "";
  }
  
  function getVoiceName(id) {
    switch (id) {
      case "21m00Tcm4TlvDq8ikWAM": return "Rachel";
      case "29vD33N1CtxCmqQRPOHJ": return "Domi";
      case "EXAVITQu4vr4xnSDxMaL": return "Bella";
      default: return "Unknown";
    }
  }
  