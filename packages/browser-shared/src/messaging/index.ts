import { type Message, type MessageResponse } from './types.js';

export const messagingFacade = {
  async send(message: Message): Promise<MessageResponse> {
    return chrome.runtime.sendMessage(message);
  },

  onMessage(handler: (msg: Message, sender: chrome.runtime.MessageSender, sendResponse: (resp: MessageResponse) => void) => boolean | void) {
    chrome.runtime.onMessage.addListener(handler);
  },
};

export * from './types.js';
