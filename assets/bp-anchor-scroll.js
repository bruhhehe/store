(function () {
  function scrollToId(id, smooth) {
    if (!id) return false;
    var target = document.getElementById(id);
    if (!target) return false;
    var headerOffset = 100;
    var rect = target.getBoundingClientRect();
    var targetTop = rect.top + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: smooth ? 'smooth' : 'auto',
    });
    return true;
  }

  function tryScrollFromHash() {
    if (!window.location.hash) return;
    var id = decodeURIComponent(window.location.hash.slice(1));
    // Retry a few times in case images/carousels are still shifting layout.
    var attempts = 0;
    var maxAttempts = 10;
    var interval = setInterval(function () {
      attempts += 1;
      var found = scrollToId(id, false);
      if (found || attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 150);
  }

  // Handle the initial page load (typed/pasted URL, or a link from another page).
  if (document.readyState === 'complete') {
    tryScrollFromHash();
  } else {
    window.addEventListener('load', tryScrollFromHash);
  }

  // Handle clicks on same-page anchor links, in case native fragment
  // navigation is being blocked or interfered with by something else on
  // the page (extensions, other scripts, etc.).
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href*="#"]');
    if (!link) return;

    var href = link.getAttribute('href') || '';
    var hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    var path = href.slice(0, hashIndex);
    var id = href.slice(hashIndex + 1);
    if (!id) return;

    var isSamePage =
      path === '' ||
      path === '/' ||
      path === window.location.pathname ||
      path === window.location.origin + window.location.pathname;

    if (!isSamePage) return;

    var target = document.getElementById(id);
    if (!target) return; // let the browser handle it normally (e.g. navigates then jumps)

    event.preventDefault();
    if (window.location.hash !== '#' + id) {
      history.pushState(null, '', '#' + id);
    }
    scrollToId(id, true);
  });
})();
