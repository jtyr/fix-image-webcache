// Icon onclick listener
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({url: '../html/options.html'});
});


// Show options after installation
function install_notice() {
  if (localStorage.getItem('install_time')) {
    return;
  }

  var now = new Date().getTime();
  localStorage.setItem('install_time', now);
  chrome.tabs.create({url: '../html/options.html'});
}

install_notice();
