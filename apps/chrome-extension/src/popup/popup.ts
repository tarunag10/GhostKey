import { MessageType } from '@ghostkey/browser-shared/messaging/types';

const statusDot = document.getElementById('statusDot')!;
const siteName = document.getElementById('siteName')!;
const toggleBtn = document.getElementById('toggleBtn')!;
const undoBtn = document.getElementById('undoBtn')!;
const stats = document.getElementById('stats')!;

let currentHostname = '';

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) {
    siteName.textContent = 'No active page';
    return;
  }

  try {
    const url = new URL(tab.url);
    currentHostname = url.hostname;
    siteName.textContent = currentHostname;
  } catch {
    siteName.textContent = 'Invalid URL';
    return;
  }

  const response = await chrome.runtime.sendMessage({
    type: MessageType.GET_STATUS,
    hostname: currentHostname,
  });

  if (response?.success) {
    updateUI(response.data.enabled);
  }
}

function updateUI(isEnabled: boolean) {
  statusDot.className = `status-dot ${isEnabled ? 'active' : 'inactive'}`;
  toggleBtn.textContent = isEnabled ? 'Disable on this site' : 'Enable on this site';
  toggleBtn.className = `btn btn-toggle ${isEnabled ? '' : 'disabled'}`;
  stats.textContent = isEnabled ? 'Actively suppressing popups' : 'Paused on this site';
}

toggleBtn.addEventListener('click', async () => {
  const response = await chrome.runtime.sendMessage({
    type: MessageType.TOGGLE_SITE,
    hostname: currentHostname,
  });
  if (response?.success) {
    // Re-fetch status
    init();
  }
});

undoBtn.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({
    type: MessageType.UNDO_SUPPRESSION,
    hostname: currentHostname,
  });
});

init();
