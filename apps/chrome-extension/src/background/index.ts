import { MessageType, type Message, type MessageResponse } from '@ghostkey/browser-shared/messaging/types';

chrome.runtime.onMessage.addListener(
  (message: Message, _sender, sendResponse: (resp: MessageResponse) => void) => {
    switch (message.type) {
      case MessageType.GET_STATUS:
        handleGetStatus(message.hostname).then(sendResponse);
        return true;
      case MessageType.TOGGLE_SITE:
        handleToggleSite(message.hostname).then(sendResponse);
        return true;
      case MessageType.UNDO_SUPPRESSION:
      case MessageType.CLEAN_PAGE:
        forwardToActiveTab(message).then(sendResponse);
        return true;
    }
  }
);

async function handleGetStatus(hostname: string): Promise<MessageResponse> {
  const result = await chrome.storage.local.get(['disabledSites', 'globalEnabled', 'aggressiveMode']);
  const disabledSites: string[] = result.disabledSites ?? [];
  const globalEnabled: boolean = result.globalEnabled ?? true;
  return {
    success: true,
    data: {
      enabled: globalEnabled && !disabledSites.includes(hostname),
      globalEnabled,
      aggressiveMode: result.aggressiveMode ?? false,
      disabledSites,
    },
  };
}

async function handleToggleSite(hostname: string): Promise<MessageResponse> {
  const result = await chrome.storage.local.get('disabledSites');
  const disabledSites: string[] = result.disabledSites ?? [];
  const idx = disabledSites.indexOf(hostname);
  if (idx >= 0) {
    disabledSites.splice(idx, 1);
  } else {
    disabledSites.push(hostname);
  }
  await chrome.storage.local.set({ disabledSites });
  return { success: true };
}

async function forwardToActiveTab(message: Message): Promise<MessageResponse> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return { success: false, error: 'No active tab' };
  try {
    const resp = await chrome.tabs.sendMessage(tab.id, message);
    return resp;
  } catch {
    return { success: false, error: 'Could not reach content script' };
  }
}

console.log('[GhostKey] Background service worker loaded');
