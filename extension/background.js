/**
 * Dawn Lens — Background Service Worker
 *
 * Manages the side panel lifecycle and coordinates between content scripts
 * and the side panel.
 */

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

// Also allow opening from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'open-sidepanel') {
    chrome.sidePanel.open({ tabId: msg.tabId });
    sendResponse({ ok: true });
  }
  if (msg.type === 'get-page-text') {
    // Forward to content script
    chrome.tabs.sendMessage(msg.tabId, { type: 'extract-text' }, (response) => {
      sendResponse(response);
    });
    return true; // async response
  }
});

// Set side panel behavior: open on action click
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  .catch(() => { /* older Chrome versions */ });
