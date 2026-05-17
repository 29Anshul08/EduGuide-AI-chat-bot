/**
 * EduGuide AI - App Controller
 * Handles UI interactions, chat overlay, and animations.
 */

// ===== Chat State =====
let chatOpen = false;
let chatInitialized = false;

// ===== Chat Controls =====
function openChat() {
    const overlay = document.getElementById('chat-overlay');
    const fab = document.getElementById('chat-fab');
    overlay.classList.add('active');
    fab.style.display = 'none';
    chatOpen = true;

    if (!chatInitialized) {
        initChat();
        chatInitialized = true;
    }

    setTimeout(() => {
        document.getElementById('chat-input').focus();
    }, 400);
}

function openChatWith(message) {
    openChat();
    setTimeout(() => {
        sendQuickReply(message);
    }, 800);
}

function closeChat() {
    const overlay = document.getElementById('chat-overlay');
    const fab = document.getElementById('chat-fab');
    overlay.classList.remove('active');
    chatOpen = true;
    setTimeout(() => {
        fab.style.display = 'flex';
        // Remove badge after first open
        const badge = fab.querySelector('.fab-badge');
        if (badge) badge.style.display = 'none';
    }, 350);
}

// ===== Chat Initialization =====
function initChat() {
    const welcome = ChatBot.getWelcomeMessage();
    addBotMessage(welcome);
}

// ===== Message Handling =====
function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    addUserMessage(text);
    input.value = '';

    // Show typing indicator
    showTyping();

    // Simulate response delay
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
        hideTyping();
        const response = ChatBot.getResponse(text);
        addBotMessage(response);
    }, delay);
}

function sendQuickReply(text) {
    addUserMessage(text);

    showTyping();

    const delay = 500 + Math.random() * 600;
    setTimeout(() => {
        hideTyping();
        const response = ChatBot.getResponse(text);
        addBotMessage(response);
    }, delay);
}

function addUserMessage(text) {
    const container = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user';
    msgDiv.innerHTML = `
        <div class="message-avatar">U</div>
        <div class="message-bubble">${escapeHtml(text)}</div>
    `;
    container.appendChild(msgDiv);
    scrollToBottom();
}

function addBotMessage(text) {
    const container = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message bot';
    msgDiv.innerHTML = `
        <div class="message-avatar">E</div>
        <div class="message-bubble">${ChatBot.formatMessage(text)}</div>
    `;
    container.appendChild(msgDiv);
    scrollToBottom();
}

function showTyping() {
    const container = document.getElementById('chat-messages');
    const existingTyping = document.getElementById('typing-msg');
    if (existingTyping) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'message bot';
    msgDiv.id = 'typing-msg';
    msgDiv.innerHTML = `
        <div class="message-avatar">E</div>
        <div class="message-bubble">
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    container.appendChild(msgDiv);
    scrollToBottom();
}

function hideTyping() {
    const typing = document.getElementById('typing-msg');
    if (typing) typing.remove();
}

function scrollToBottom() {
    const container = document.getElementById('chat-messages');
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 50);
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// ===== Lead Form =====
function toggleLeadForm() {
    const form = document.getElementById('lead-form');
    form.classList.toggle('hidden');
}

function submitLeadForm(event) {
    event.preventDefault();

    const name = document.getElementById('lead-name').value.trim();
    const cls = document.getElementById('lead-class').value;
    const exam = document.getElementById('lead-exam').value;
    const phone = document.getElementById('lead-phone').value.trim();

    if (!name || !cls || !exam || !phone) return;

    // Save lead
    const leadData = ChatBot.saveLead({
        name, class: cls, targetExam: exam, phone,
        timestamp: new Date().toISOString()
    });

    // Show success
    const form = document.getElementById('lead-form');
    form.innerHTML = `
        <div style="text-align:center;padding:20px 0">
            <div style="font-size:48px;margin-bottom:12px">✅</div>
            <h3 style="font-family:var(--font-display);margin-bottom:8px">Thank You, ${escapeHtml(name)}!</h3>
            <p style="color:var(--text-muted);font-size:14px">Our counselor will call you within 30 minutes on <strong>${escapeHtml(phone)}</strong></p>
        </div>
    `;

    // Add confirmation in chat
    addBotMessage(`Thank you, **${name}**! 🎉\n\nYour details have been saved:\n• Name: ${name}\n• Class: ${cls}\n• Target Exam: ${exam}\n• Phone: ${phone}\n\nOur counselor will call you within **30 minutes**. In the meantime, feel free to ask me anything! 😊`);

    // Auto-hide form after 3 seconds
    setTimeout(() => {
        form.classList.add('hidden');
    }, 3000);
}

// ===== Utility =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Keyboard Shortcut =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatOpen) {
        closeChat();
    }
});

// ===== Intersection Observer for Animations =====
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.action-card, .result-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
});
