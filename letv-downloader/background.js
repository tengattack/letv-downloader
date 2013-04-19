// Copyright (c) 2013 tengattack

chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.download){
    chrome.downloads.download({url: message.url, filename: message.filename});
  } else { 
    chrome.tabs.create(message);
    sendResponse(true);
  }
});

