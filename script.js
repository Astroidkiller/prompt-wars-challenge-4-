// script.js - Core logic for Prompt Wars smart assistant

// Simple knowledge base for demo purposes
const jokes = [
  "Why did the programmer quit his job? Because he didn't get arrays.",
  "I told a joke about UDP, but I'm not sure if anyone got it.",
  "Why do Java developers wear glasses? Because they don't C#."
];

function getRandomJoke() {
  return jokes[Math.floor(Math.random() * jokes.length)];
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString();
}

function generateResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes("joke")) {
    return getRandomJoke();
  }
  if (lower.includes("time")) {
    return `The current time is ${getCurrentTime()}.`;
  }
  if (lower.includes("weather")) {
    return "I don't have live weather data, but you can check your favorite weather app!";
  }
  if (lower.includes("help")) {
    return "I can tell jokes, give the current time, or just chat with you. Try asking for a joke!";
  }
  return "I'm here to assist you. Ask me for a joke, the time, or just tell me what's on your mind.";
}

function addMessage(text, type) {
  const chat = document.getElementById("chat");
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${type}`;
  msgDiv.textContent = text;
  chat.appendChild(msgDiv);
  chat.scrollTop = chat.scrollHeight;
}

function simulateAssistantReply(userMsg) {
  const chat = document.getElementById("chat");
  const typingDiv = document.createElement("div");
  typingDiv.id = "typing-indicator";
  typingDiv.className = "message assistant";
  typingDiv.textContent = "Thinking...";
  chat.appendChild(typingDiv);
  chat.scrollTop = chat.scrollHeight;
  const delay = 500 + Math.random() * 1000;
  setTimeout(() => {
    const response = generateResponse(userMsg);
    const indicator = document.getElementById("typing-indicator");
    if (indicator) indicator.remove();
    addMessage(response, "assistant");
  }, delay);
}

document.getElementById("chatForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("userInput");
  const userText = input.value.trim();
  if (!userText) return;
  addMessage(userText, "user");
  input.value = "";
  simulateAssistantReply(userText);
});

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("userInput").focus();
});
