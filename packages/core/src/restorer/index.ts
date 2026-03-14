import { type SuppressionRecord, type AppliedAction, SuppressionActionType } from '../types/index.js';
import { Suppressor } from '../suppressor/index.js';

export class Restorer {
  constructor(private suppressor: Suppressor) {}

  restoreAll(): void {
    const records = this.suppressor.getRecords();
    for (let i = records.length - 1; i >= 0; i--) {
      this.restoreRecord(records[i]);
    }
  }

  restoreLast(): void {
    const record = this.suppressor.getLastRecord();
    if (record) this.restoreRecord(record);
  }

  private restoreRecord(record: SuppressionRecord): void {
    for (let i = record.actions.length - 1; i >= 0; i--) {
      this.restoreAction(record.actions[i]);
    }
  }

  private restoreAction(action: AppliedAction): void {
    const el = action.target as HTMLElement;
    if (!el) return;

    switch (action.type) {
      case SuppressionActionType.HIDE_ELEMENT:
        el.style.display = action.originalState.display ?? '';
        el.style.visibility = action.originalState.visibility ?? '';
        el.style.opacity = action.originalState.opacity ?? '';
        break;

      case SuppressionActionType.REMOVE_ELEMENT: {
        const parent = (action.target as any).__ghostkey_parent;
        const next = (action.target as any).__ghostkey_next;
        if (parent) {
          if (next) parent.insertBefore(action.target, next);
          else parent.appendChild(action.target);
        }
        break;
      }

      case SuppressionActionType.UNLOCK_SCROLL: {
        const body = document.body;
        const html = document.documentElement;
        body.style.overflow = action.originalState.bodyOverflow ?? '';
        body.style.overflowY = action.originalState.bodyOverflowY ?? '';
        html.style.overflow = action.originalState.htmlOverflow ?? '';
        html.style.overflowY = action.originalState.htmlOverflowY ?? '';
        if (action.originalState.bodyClass) {
          body.className = action.originalState.bodyClass;
        }
        break;
      }

      case SuppressionActionType.REMOVE_BLUR: {
        const selectors = ['main', '#root', '#app', '#__next', '[role="main"]', '.content'];
        for (const sel of selectors) {
          const target = document.querySelector(sel) as HTMLElement | null;
          if (!target) continue;
          if (action.originalState[`${sel}_filter`] !== undefined) {
            target.style.filter = action.originalState[`${sel}_filter`];
          }
          if (action.originalState[`${sel}_opacity`] !== undefined) {
            target.style.opacity = action.originalState[`${sel}_opacity`];
          }
        }
        break;
      }

      case SuppressionActionType.RESTORE_POINTER_EVENTS: {
        document.body.style.pointerEvents = action.originalState.bodyPointerEvents ?? '';
        break;
      }
    }
  }
}
