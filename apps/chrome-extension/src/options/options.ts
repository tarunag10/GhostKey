const globalEnabled = document.getElementById('globalEnabled') as HTMLInputElement;
const aggressiveMode = document.getElementById('aggressiveMode') as HTMLInputElement;
const debugMode = document.getElementById('debugMode') as HTMLInputElement;
const allowlist = document.getElementById('allowlist') as HTMLTextAreaElement;
const saveBtn = document.getElementById('saveBtn')!;
const savedMsg = document.getElementById('savedMsg')!;

async function loadSettings() {
  const result = await chrome.storage.local.get([
    'globalEnabled', 'aggressiveMode', 'debugMode', 'allowlist',
  ]);
  globalEnabled.checked = result.globalEnabled ?? true;
  aggressiveMode.checked = result.aggressiveMode ?? false;
  debugMode.checked = result.debugMode ?? false;
  allowlist.value = (result.allowlist ?? []).join('\n');
}

saveBtn.addEventListener('click', async () => {
  const sites = allowlist.value
    .split('\n')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  await chrome.storage.local.set({
    globalEnabled: globalEnabled.checked,
    aggressiveMode: aggressiveMode.checked,
    debugMode: debugMode.checked,
    allowlist: sites,
  });

  savedMsg.classList.add('show');
  setTimeout(() => savedMsg.classList.remove('show'), 2000);
});

loadSettings();
