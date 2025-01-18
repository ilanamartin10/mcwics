const chatWindow = document.getElementById("messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

const backendUrl = "http://localhost:5000/chatbot"; // Replace with your backend URL

// Function to add messages to the chat window
function addMessage(message, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}-message`;

  // Render code blocks for bot messages if necessary
  if (sender === "bot" && message.includes("```")) {
    const codeBlock = message.split("```")[1]; // Extract code block
    const preElement = document.createElement("pre");
    preElement.textContent = codeBlock;
    messageDiv.textContent = message.split("```")[0]; // Add initial text
    messageDiv.appendChild(preElement);
  } else {
    messageDiv.textContent = message;
  }

  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll
}

// Send user message to backend
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    addMessage(data.reply, "bot");
  } catch (error) {
    addMessage("Sorry, something went wrong.", "bot");
  }
}

// Event listener for send button
sendButton.addEventListener("click", sendMessage);

// Event listener for pressing Enter
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

