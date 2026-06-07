export enum MessageType {
  GET_STATUS = 'GET_STATUS',
  TOGGLE_SITE = 'TOGGLE_SITE',
  UNDO_SUPPRESSION = 'UNDO_SUPPRESSION',
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
  CLEAN_PAGE = 'CLEAN_PAGE',
}

export interface Message {
  type: MessageType;
  hostname: string;
  data?: unknown;
}

export interface MessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}
