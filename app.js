/**
 * Thoryn AI Assistant Platform - Landing Page Interactions
 * Handles mock assistant console, preset workflows, WhatsApp/Telegram toast alerts,
 * pre-registration form state management, local storage, and 3D ticket tilting.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize current date on simulated dashboard
  initDashboardDate();

  // Assistant Console & Preset Workflows
  initAgentConsole();

  // WhatsApp/Telegram Notification Simulator
  initNotificationSimulator();

  // Pre-registration & Ticket System
  initRegistrationSystem();
});

/**
 * Dynamically format and display today's date on the dashboard.
 */
function initDashboardDate() {
  const dateEl = document.getElementById('dashboard-date');
  if (dateEl) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateEl.textContent = today.toLocaleDateString('en-US', options);
  }
}

/**
 * Handle terminal console output log simulation, preset buttons, and custom inputs.
 */
function initAgentConsole() {
  const terminalOutput = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  const terminalSendBtn = document.getElementById('terminal-send-btn');
  const presetBtns = document.querySelectorAll('.preset-cmd-btn');
  
  const mcpToggles = {
    web: document.getElementById('mcp-web'),
    pdf: document.getElementById('mcp-pdf'),
    slides: document.getElementById('mcp-slides')
  };

  let activeWorkflowTimeout = [];

  // Helper to append a line to the terminal console
  function appendLog(text, color = '#64748b') {
    if (!terminalOutput) return;
    const logSpan = document.createElement('span');
    logSpan.style.color = color;
    logSpan.innerHTML = text;
    terminalOutput.appendChild(logSpan);
    
    // Auto-scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  // Clear workflow timeouts when user triggers a new action
  function clearAllWorkflows() {
    activeWorkflowTimeout.forEach(t => clearTimeout(t));
    activeWorkflowTimeout = [];
    presetBtns.forEach(btn => btn.classList.remove('active'));
  }

  // Bind MCP Toggles to terminal feedback
  if (mcpToggles.web) {
    mcpToggles.web.addEventListener('change', (e) => {
      if (e.target.checked) {
        appendLog('[System]: Connected Web Browser Search tool.', '#22c55e');
      } else {
        appendLog('[System]: Disconnected Web Browser Search tool.', '#ef4444');
      }
    });
  }

  if (mcpToggles.pdf) {
    mcpToggles.pdf.addEventListener('change', (e) => {
      if (e.target.checked) {
        appendLog('[System]: Connected PDF File Exporter module.', '#22c55e');
      } else {
        appendLog('[System]: Disconnected PDF File Exporter module.', '#ef4444');
      }
    });
  }

  if (mcpToggles.slides) {
    mcpToggles.slides.addEventListener('change', (e) => {
      if (e.target.checked) {
        appendLog('[System]: Connected Slide Visualizer engine.', '#22c55e');
      } else {
        appendLog('[System]: Disconnected Slide Visualizer engine.', '#ef4444');
      }
    });
  }

  // Workflow script logs (General Purpose Edition)
  const workflows = {
    research: [
      { delay: 0, text: '[User]: Research beach resorts in Greece and plan a 5-day vacation itinerary.', color: '#f8fafc' },
      { delay: 1000, text: '[Assistant]: Launching web browser search tools...', color: '#a5b4fc' },
      { delay: 2200, text: '[Assistant]: Querying travel portals and local Greek tourism guides...', color: '#c084fc' },
      { delay: 3500, text: '[Assistant]: Found top 5 resort matches. Structuring daily activities...', color: '#c084fc' },
      { delay: 4800, text: '[Assistant]: Compiling printable PDF document: "Greece_Vacation_Itinerary.pdf"...', color: '#06b6d4' },
      { delay: 6000, text: '[Assistant]: PDF generated (4 pages). Caching to secure SQLite vault.', color: '#06b6d4' },
      { delay: 7000, text: '[Assistant]: Sending itinerary file to user via WhatsApp channel...', color: '#10b981' },
      { delay: 7100, triggerToast: { 
          channel: 'whatsapp', 
          msg: '📄 <strong>Trip Planner:</strong> Greece Vacation Itinerary PDF compiled successfully.<br><a href="#" style="color:#25d366; text-decoration:underline; font-weight:600;">Download Greece_Itinerary.pdf</a>' 
        } 
      }
    ],
    slides: [
      { delay: 0, text: '[User]: Generate weekly healthy meal prep slides from my diet sheets.', color: '#f8fafc' },
      { delay: 1000, text: '[Assistant]: Accessing nutrition files and family food preferences...', color: '#a5b4fc' },
      { delay: 2200, text: '[Assistant]: Structuring 7-day meal plan: 2,100 calories, high-protein recipes...', color: '#c084fc' },
      { delay: 3500, text: '[Assistant]: Building PowerPoint recipe slide presentation (PPTX format)...', color: '#06b6d4' },
      { delay: 4800, text: '[Assistant]: Presentation generated. Sending to user via Telegram channel...', color: '#10b981' },
      { delay: 4900, triggerToast: { 
          channel: 'telegram', 
          msg: '🍳 <strong>Meal Planner:</strong> Weekly meal prep recipes slides constructed.<br><a href="#" style="color:#229ED9; text-decoration:underline; font-weight:600;">Download Weekly_Menu.pptx</a>' 
        } 
      }
    ],
    cron: [
      { delay: 0, text: '[User]: Schedule a morning news and weather briefing to send to my phone every day.', color: '#f8fafc' },
      { delay: 1000, text: '[Assistant]: Configuring schedule automation module...', color: '#a5b4fc' },
      { delay: 2000, text: '[Assistant]: Scheduled task registered: "0 7 * * *" (Every morning at 7:00 AM).', color: '#22c55e' },
      { delay: 3200, text: '[Assistant]: Running weather API test summary & local calendar check...', color: '#c084fc' },
      { delay: 4500, text: '[Assistant]: Briefing text compiled successfully and sent to WhatsApp.', color: '#10b981' },
      { delay: 4600, triggerToast: { 
          channel: 'whatsapp', 
          msg: '⏰ <strong>Daily Schedule:</strong> Briefing automated! You will receive messages every morning at 7:00 AM.<br><a href="#" style="color:#25d366; text-decoration:underline; font-weight:600;">View Briefing settings</a>' 
        } 
      }
    ],
    skills: [
      { delay: 0, text: '[User]: Learn how to connect with DALL-E to generate cute illustrations for my recipes.', color: '#f8fafc' },
      { delay: 1000, text: '[Assistant]: Accessing skill installer. Registering custom tools...', color: '#a5b4fc' },
      { delay: 2200, text: '[Assistant]: Integrating DALL-E API auth tokens & style parameters...', color: '#c084fc' },
      { delay: 3500, text: '[Assistant]: Compiling image actions: --generate-image, --draw-diagram.', color: '#06b6d4' },
      { delay: 4800, text: '[Assistant]: Skill learned! Registered tools: image builder. Ready for prompts.', color: '#22c55e' },
      { delay: 4900, triggerToast: { 
          channel: 'telegram', 
          msg: '🎨 <strong>Skill Learned:</strong> Cute recipe illustrations generator connected! Ask me to "draw a recipe" anytime.' 
        } 
      }
    ]
  };

  // Run a preset agent workflow
  function runWorkflow(type) {
    clearAllWorkflows();
    if (terminalOutput) {
      terminalOutput.innerHTML = '<span style="color: #64748b;">[System]: Initializing assistant execution context...</span>';
    }

    const script = workflows[type];
    if (!script) return;

    script.forEach(step => {
      const timeout = setTimeout(() => {
        if (step.text) {
          appendLog(step.text, step.color);
        }
        if (step.triggerToast) {
          triggerAgentToast(step.triggerToast.channel, step.triggerToast.msg);
        }
      }, step.delay);
      activeWorkflowTimeout.push(timeout);
    });
  }

  // Preset buttons click handler
  presetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetBtn = e.currentTarget;
      const type = targetBtn.getAttribute('data-cmd');
      
      clearAllWorkflows();
      targetBtn.classList.add('active');
      runWorkflow(type);
    });
  });

  // Custom User Input Handler
  function handleCustomSend() {
    if (!terminalInput) return;
    const text = terminalInput.value.trim();
    if (!text) return;

    clearAllWorkflows();
    
    // Log user input
    appendLog(`[User]: ${text}`, '#f8fafc');
    terminalInput.value = '';

    // Simulated Agent thinking & response
    const t1 = setTimeout(() => {
      appendLog('[Assistant]: Got it. Fetching secure local workspace nodes...', '#a5b4fc');
    }, 800);
    
    const t2 = setTimeout(() => {
      appendLog('[Assistant]: Accessing private databases. Compiling response...', '#c084fc');
    }, 2000);

    const t3 = setTimeout(() => {
      appendLog('[Assistant]: Action completed. Memory updated & details synced.', '#22c55e');
      triggerAgentToast('telegram', `🤖 <strong>Response Compiled:</strong> Done processing "${text}".`);
    }, 3800);

    activeWorkflowTimeout.push(t1, t2, t3);
  }

  if (terminalSendBtn && terminalInput) {
    terminalSendBtn.addEventListener('click', handleCustomSend);
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleCustomSend();
      }
    });
  }
}

/**
 * Slide-in toast alerts simulating Thoryn's bot channels.
 */
let toastTimeout = null;

function triggerAgentToast(channel, message) {
  const toast = document.getElementById('telegram-toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastAvatar = document.getElementById('toast-brand-avatar');
  const toastName = document.getElementById('toast-brand-name');

  if (!toast || !toastMsg || !toastAvatar || !toastName) return;

  // Clear pending hide events
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  // Update styles depending on channel type
  if (channel === 'whatsapp') {
    toastAvatar.style.backgroundColor = '#25d366';
    toastAvatar.textContent = 'W';
    toastName.textContent = 'Thoryn Assistant';
    toast.style.borderColor = 'rgba(37, 211, 102, 0.4)';
  } else {
    toastAvatar.style.backgroundColor = '#229ED9';
    toastAvatar.textContent = 'T';
    toastName.textContent = 'Thoryn Telegram Bot';
    toast.style.borderColor = 'rgba(34, 158, 217, 0.4)';
  }

  toastMsg.innerHTML = message;
  toast.classList.add('show');

  // Auto close after 7 seconds
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 7000);
}

function initNotificationSimulator() {
  const whatsappBtn = document.getElementById('whatsapp-notify-btn');
  const closeBtn = document.getElementById('toast-close-btn');
  const toast = document.getElementById('telegram-toast');

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      triggerAgentToast('whatsapp', '💬 <strong>WhatsApp Connection:</strong> Chat session connection validated! Message sync active.');
    });
  }

  if (closeBtn && toast) {
    closeBtn.addEventListener('click', () => {
      toast.classList.remove('show');
      if (toastTimeout) clearTimeout(toastTimeout);
    });
  }
}

/**
 * Handle form submissions, ticket generation, local storage caches, and card tilting.
 */
function initRegistrationSystem() {
  const form = document.getElementById('registration-form');
  const formCardContainer = document.getElementById('register-card-container');
  const ticketContainer = document.getElementById('ticket-container');
  const resetBtn = document.getElementById('reset-registration-btn');

  // Check if user has already pre-registered
  const cachedUser = localStorage.getItem('thoryn_pre_registered_user');
  if (cachedUser) {
    try {
      const userData = JSON.parse(cachedUser);
      renderTicket(userData);
      formCardContainer.style.display = 'none';
      ticketContainer.style.display = 'flex';
    } catch (e) {
      localStorage.removeItem('thoryn_pre_registered_user');
    }
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('reg-name');
      const emailInput = document.getElementById('reg-email');
      const usecaseSelect = document.getElementById('reg-usecase');

      if (!nameInput || !emailInput || !usecaseSelect) return;

      const queueRank = '#' + String(Math.floor(Math.random() * (2900 - 2100 + 1)) + 2100).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const barcodeSeed = Math.floor(10000000 + Math.random() * 90000000);

      const userData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        useCase: usecaseSelect.options[usecaseSelect.selectedIndex].text.split(' ')[0].toUpperCase(),
        rank: queueRank,
        barcode: `TH-${barcodeSeed}-X`
      };

      // Save to cache
      localStorage.setItem('thoryn_pre_registered_user', JSON.stringify(userData));

      // Display ticket
      renderTicket(userData);
      
      // Animate transition
      formCardContainer.style.opacity = 0;
      setTimeout(() => {
        formCardContainer.style.display = 'none';
        ticketContainer.style.display = 'flex';
        ticketContainer.style.opacity = 0;
        setTimeout(() => {
          ticketContainer.style.opacity = 1;
        }, 50);
      }, 300);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem('thoryn_pre_registered_user');
      if (form) form.reset();
      
      ticketContainer.style.opacity = 0;
      setTimeout(() => {
        ticketContainer.style.display = 'none';
        formCardContainer.style.display = 'block';
        formCardContainer.style.opacity = 0;
        setTimeout(() => {
          formCardContainer.style.opacity = 1;
        }, 50);
      }, 300);
    });
  }

  // 3D Card Hover Tilt Effects
  initTicket3DEffects();
}

/**
 * Inject registered user details into the access ticket.
 */
function renderTicket(userData) {
  const tName = document.getElementById('ticket-user-name');
  const tEmail = document.getElementById('ticket-user-email');
  const tClass = document.getElementById('ticket-user-class');
  const tRank = document.getElementById('ticket-user-rank');
  const tBarcode = document.getElementById('ticket-barcode-num');

  if (tName) tName.textContent = userData.name.toUpperCase();
  if (tEmail) tEmail.textContent = userData.email;
  if (tClass) tClass.textContent = userData.useCase;
  if (tRank) tRank.textContent = userData.rank;
  if (tBarcode) tBarcode.textContent = userData.barcode;
}

/**
 * Core mathematical functions to trigger 3D perspective rotates on hover.
 */
function initTicket3DEffects() {
  const ticket = document.getElementById('access-ticket');
  if (!ticket) return;

  ticket.addEventListener('mousemove', (e) => {
    const rect = ticket.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate inside element
    const y = e.clientY - rect.top;  // y coordinate inside element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Maximum tilt angles (degrees)
    const maxTiltX = 15;
    const maxTiltY = 15;

    // Calculate mouse percentage displacement from center
    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    // Apply 3D transforms. Y moves control X rot, X moves control Y rot.
    const rotateX = (-percentY * maxTiltX).toFixed(2);
    const rotateY = (percentX * maxTiltY).toFixed(2);

    ticket.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  });

  ticket.addEventListener('mouseleave', () => {
    ticket.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}
