/**
 * Thoryn AI Browser - Landing Page Interactions
 * Handles OS auto-detection for dynamic hero download CTA,
 * mock download feedback, "Download older versions" modal & toast,
 * interactive browser simulator with live task switching, and FAQ accordion.
 */

document.addEventListener('DOMContentLoaded', () => {
  initOSDetection();
  initDownloadHandlers();
  initOlderVersionsModal();
  initBrowserSimulator();
  initFAQAccordion();
  initPlatformTabs();
});

/**
 * OS Detection and Hero Customization
 * Automatically inspects navigator data to personalize hero text and default download target.
 */
function initOSDetection() {
  const heroDownloadBtn = document.getElementById('hero-download-btn');
  const heroDownloadText = document.getElementById('hero-download-text');
  const heroOsBadge = document.getElementById('hero-os-badge');
  const heroDownloadSub = document.getElementById('hero-download-sub');
  const heroOsIcon = document.getElementById('hero-os-icon');

  if (!heroDownloadBtn || !heroDownloadText) return;

  const userAgent = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const uadPlatform = (navigator.userAgentData && navigator.userAgentData.platform) ? navigator.userAgentData.platform : '';
  let detectedOS = 'windows'; // default fallback
  let osName = 'Windows';
  let osSubtext = 'Windows 10/11 64-bit • v1.0.0 Official Release';
  let osIcon = '🪟';
  let targetFile = 'ThorynBrowser-Setup-1.0.0.exe';

  // Check for macOS
  if (/macOS/i.test(uadPlatform) || /Macintosh|MacIntel|MacPPC|Mac68K/i.test(userAgent) || /Mac/i.test(platform)) {
    detectedOS = 'macos';
    osName = 'macOS';
    osSubtext = 'macOS 12+ • Apple Silicon & Intel • v1.0.0 Official Release';
    osIcon = '🍏';
    targetFile = 'ThorynBrowser-1.0.0-arm64.dmg';
  } 
  // Check for Linux
  else if (/Linux/i.test(uadPlatform) || /Linux/i.test(userAgent) || /Linux/i.test(platform)) {
    // Exclude Android
    if (!/Android/i.test(userAgent) && !/Android/i.test(uadPlatform)) {
      detectedOS = 'linux';
      osName = 'Linux';
      osSubtext = 'Ubuntu / Debian / Fedora / AppImage • v1.0.0 Official Release';
      osIcon = '🐧';
      targetFile = 'thoryn-browser_1.0.0_amd64.deb';
    }
  } 
  // Check for Windows
  else if (/Windows/i.test(uadPlatform) || /Win32|Win64|Windows|WinCE/i.test(userAgent) || /Win/i.test(platform)) {
    detectedOS = 'windows';
    osName = 'Windows';
    osSubtext = 'Windows 10/11 64-bit • v1.0.0 Official Release';
    osIcon = '🪟';
    targetFile = 'ThorynBrowser-Setup-1.0.0.exe';
  }

  // Check if visitor is on Mobile
  if (/iPhone|iPad|iPod|Android/i.test(userAgent)) {
    osName = 'Desktop';
    osSubtext = 'Available for Windows, macOS & Linux • v1.0.0';
    osIcon = '💻';
  }

  // Personalize Hero elements
  heroDownloadText.textContent = `Download Thoryn for ${osName}`;
  if (heroOsBadge) heroOsBadge.textContent = 'v1.0.0';
  if (heroDownloadSub) heroDownloadSub.textContent = osSubtext;
  if (heroOsIcon) heroOsIcon.textContent = osIcon;
  
  heroDownloadBtn.setAttribute('data-target-file', targetFile);
  heroDownloadBtn.setAttribute('data-target-os', osName);

  // Store detected OS in data attribute on body for conditional styling
  document.body.setAttribute('data-detected-os', detectedOS);
  
  // Highlight the detected OS tab in download matrix if present
  const defaultTabBtn = document.querySelector(`.platform-tab-btn[data-platform="${detectedOS}"]`);
  if (defaultTabBtn) {
    switchPlatformTab(detectedOS);
  }
}

/**
 * Handle Download Triggers and Mock Download Toast
 */
function initDownloadHandlers() {
  const downloadButtons = document.querySelectorAll('[data-download-trigger]');
  
  downloadButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const fileName = btn.getAttribute('data-target-file') || 'ThorynBrowser-1.0.0.dmg';
      const os = btn.getAttribute('data-target-os') || 'Your System';
      
      triggerDownloadFeedback(fileName, os);
    });
  });
}

function triggerDownloadFeedback(fileName, os) {
  showToast({
    title: `Starting Download: ${fileName}`,
    message: `Thoryn Browser v1.0.0 for ${os} is downloading. If your download doesn't start automatically, the mock CDN payload has been verified.`,
    icon: '⬇️',
    type: 'success'
  });
}

/**
 * "Download Older Versions" Modal & Notification
 */
function initOlderVersionsModal() {
  const olderVersionBtns = document.querySelectorAll('.btn-older-versions, #btn-older-versions');
  const modal = document.getElementById('older-versions-modal');
  const closeModalBtn = document.getElementById('close-older-modal-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');

  olderVersionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openOlderVersionsModal();
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeOlderVersionsModal);
  }

  if (modalDismissBtn) {
    modalDismissBtn.addEventListener('click', closeOlderVersionsModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeOlderVersionsModal();
      }
    });
  }

  // Handle escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeOlderVersionsModal();
    }
  });
}

function openOlderVersionsModal() {
  const modal = document.getElementById('older-versions-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    // Fallback toast if modal markup missing
    showToast({
      title: 'Older Releases Archive',
      message: 'No older version available right now. Version 1.0.0 is our inaugural release!',
      icon: 'ℹ️',
      type: 'info'
    });
  }
}

function closeOlderVersionsModal() {
  const modal = document.getElementById('older-versions-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Toast Notification System
 */
function showToast({ title, message, icon = '✨', type = 'info' }) {
  let toastContainer = document.getElementById('thoryn-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'thoryn-toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close notification">&times;</button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => toast.remove(), 300);
  });

  toastContainer.appendChild(toast);

  // Auto remove after 5.5s
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 300);
    }
  }, 5500);
}

/**
 * Platform Download Tab Switcher
 */
function initPlatformTabs() {
  const tabBtns = document.querySelectorAll('.platform-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.getAttribute('data-platform');
      switchPlatformTab(platform);
    });
  });

  // OS quick links in hero
  const quickLinks = document.querySelectorAll('.os-quick-link');
  quickLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const os = link.getAttribute('data-os');
      if (os) {
        switchPlatformTab(os);
      }
    });
  });
}

function switchPlatformTab(platformKey) {
  const tabBtns = document.querySelectorAll('.platform-tab-btn');
  const tabPanels = document.querySelectorAll('.platform-panel');

  tabBtns.forEach(btn => {
    if (btn.getAttribute('data-platform') === platformKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  tabPanels.forEach(panel => {
    if (panel.getAttribute('data-platform') === platformKey) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });
}

/**
 * Interactive Browser Simulator
 * Simulates real AI-controlled browsing across multiple high-impact task presets.
 */
function initBrowserSimulator() {
  const taskButtons = document.querySelectorAll('.simulator-task-btn');
  const simUrl = document.getElementById('sim-url-text');
  const simAgentStatus = document.getElementById('sim-agent-status');
  const simWebviewContent = document.getElementById('sim-webview-content');
  const simAgentLogs = document.getElementById('sim-agent-logs');
  const simActionBadge = document.getElementById('sim-action-badge');

  if (!taskButtons.length || !simWebviewContent) return;

  const tasksData = {
    travel: {
      url: 'https://flights.thoryn.ai/search?from=SFO&to=CDG&date=2026-09-15',
      badge: 'Autonomous Flight Booking',
      status: 'Comparing 3 airlines & calculating baggage rules',
      logs: [
        { text: '🔒 Verified Thoryn credential session with airline bridge...', color: '#10b981' },
        { text: '🔍 Queried Air France, Delta, and United for nonstop flights...', color: '#94a3b8' },
        { text: '⚡ Found Delta Flight #84 ($620). Cheaper by $180 than competitors.', color: '#38bdf8' },
        { text: '💳 Auto-applied SkyMiles loyalty #49281903 from Thoryn Vault.', color: '#c084fc' },
        { text: '✋ Human-in-the-loop: Ready for payment authorization ($620.00).', color: '#f59e0b' }
      ],
      html: `
        <div class="sim-flight-card">
          <div class="sim-flight-header">
            <div>
              <span class="sim-airline">Delta Air Lines • DL 84</span>
              <span class="sim-badge-best">Best Value Deal</span>
            </div>
            <div class="sim-flight-price">$620 <span class="sim-price-sub">roundtrip</span></div>
          </div>
          <div class="sim-flight-route">
            <div class="sim-route-col">
              <div class="sim-time">05:40 PM</div>
              <div class="sim-airport">SFO (San Francisco)</div>
            </div>
            <div class="sim-route-line">
              <span class="sim-duration">10h 45m</span>
              <div class="sim-line-bar"><span class="sim-plane-dot">✈️</span></div>
              <span class="sim-nonstop">Nonstop</span>
            </div>
            <div class="sim-route-col text-right">
              <div class="sim-time">02:25 PM +1</div>
              <div class="sim-airport">CDG (Paris Charles de Gaulle)</div>
            </div>
          </div>
          <div class="sim-agent-highlight-box">
            <div class="sim-highlight-title">🤖 Thoryn Agent Action</div>
            <p>Seating preference matched (Window, Exit row). Meal preference (Standard) attached. Loyalty discount applied.</p>
          </div>
        </div>
      `
    },
    research: {
      url: 'https://arxiv.org/abs/2607.08912/multimodal-agents',
      badge: 'Academic Research & Synthesis',
      status: 'Extracting key findings from 4 PDF papers across tabs',
      logs: [
        { text: '📑 Parsing paper: "Autonomous Agent Architectures in 2026"...', color: '#94a3b8' },
        { text: '📊 Extracting benchmark tables from section 4.2...', color: '#38bdf8' },
        { text: '🧠 Cross-referencing methodology with Stanford AI 2025 paper...', color: '#c084fc' },
        { text: '💾 Generating structured markdown comparison in local vault...', color: '#10b981' },
        { text: '✅ Summary exported to your Thoryn Knowledge Graph.', color: '#10b981' }
      ],
      html: `
        <div class="sim-research-card">
          <div class="sim-paper-meta">
            <span class="sim-paper-tag">arXiv:2607.08912 [cs.AI]</span>
            <span class="sim-paper-date">Published July 2026</span>
          </div>
          <h4 class="sim-paper-title">Recursive Action-Space Navigation in Autonomous Web Agents</h4>
          <p class="sim-paper-abstract">
            We introduce a dual-loop policy allowing client-side agents to execute DOM mutation trees 4x faster while maintaining 100% human-controlled security boundaries...
          </p>
          <div class="sim-key-takeaways">
            <div class="sim-takeaway-header">💡 Thoryn Instant Synthesis:</div>
            <ul>
              <li><strong>Latency Reduction:</strong> 72% faster execution using client-side DOM bridges.</li>
              <li><strong>Accuracy:</strong> 99.4% on WebArena multi-step checkout benchmarks.</li>
            </ul>
          </div>
        </div>
      `
    },
    ecommerce: {
      url: 'https://store.apple.com/us/shop/buy-mac/macbook-pro',
      badge: 'Price & Inventory Monitor',
      status: 'Tracking refurbished stock & price drops across 5 stores',
      logs: [
        { text: '🛒 Scanning Apple Refurbished Store, BestBuy, and B&H...', color: '#94a3b8' },
        { text: '📉 Detected $350 price drop on M4 Max 36GB configuration...', color: '#38bdf8' },
        { text: '🔔 Triggering push notification to Telegram & WhatsApp...', color: '#10b981' },
        { text: '⚡ Session reserved in cart for 15 minutes.', color: '#c084fc' },
        { text: '✋ Prompting user confirmation to complete checkout.', color: '#f59e0b' }
      ],
      html: `
        <div class="sim-ecommerce-card">
          <div class="sim-ecom-header">
            <div class="sim-ecom-img">💻</div>
            <div class="sim-ecom-info">
              <h4>16-inch MacBook Pro (Space Black)</h4>
              <p>Apple M4 Max Chip • 36GB Unified Memory • 1TB SSD</p>
              <div class="sim-price-tag">
                <span class="sim-new-price">$3,149.00</span>
                <span class="sim-old-price">$3,499.00</span>
                <span class="sim-save-badge">Save $350.00 (10% OFF)</span>
              </div>
            </div>
          </div>
          <div class="sim-inventory-status">
            <span class="sim-dot-green"></span> 2 units in stock • Auto-held in cart by Thoryn Agent
          </div>
        </div>
      `
    }
  };

  let logTimeouts = [];

  function loadTask(taskKey) {
    const data = tasksData[taskKey];
    if (!data) return;

    // Clear previous timeouts
    logTimeouts.forEach(t => clearTimeout(t));
    logTimeouts = [];

    // Update buttons
    taskButtons.forEach(btn => {
      if (btn.getAttribute('data-task') === taskKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update URL & status
    if (simUrl) simUrl.textContent = data.url;
    if (simAgentStatus) simAgentStatus.textContent = data.status;
    if (simActionBadge) simActionBadge.textContent = data.badge;

    // Update webview content with smooth transition
    simWebviewContent.style.opacity = '0';
    setTimeout(() => {
      simWebviewContent.innerHTML = data.html;
      simWebviewContent.style.opacity = '1';
    }, 150);

    // Stream logs
    if (simAgentLogs) {
      simAgentLogs.innerHTML = '';
      data.logs.forEach((log, index) => {
        const timeout = setTimeout(() => {
          const logLine = document.createElement('div');
          logLine.className = 'sim-log-line';
          logLine.style.color = log.color;
          logLine.innerHTML = `<span class="sim-log-prompt">&gt;</span> ${log.text}`;
          simAgentLogs.appendChild(logLine);
          simAgentLogs.scrollTop = simAgentLogs.scrollHeight;
        }, index * 400);
        logTimeouts.push(timeout);
      });
    }
  }

  taskButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const taskKey = btn.getAttribute('data-task');
      loadTask(taskKey);
    });
  });

  // Initial load
  loadTask('travel');
}

/**
 * FAQ Accordion Interaction
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.browser-faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.browser-faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}
