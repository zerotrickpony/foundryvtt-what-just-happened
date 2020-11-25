const WJH_HIGHLIGHT_DURATION_MS = 4000;

// Don't turn on smooth scrolling until after the initial chat log
// is populated, since otherwise this causes a long animation to play
// on first page load.
Hooks.once("ready", () => {
  $('#chat-log').css('scroll-behavior', 'smooth');
});

// This hook is called for new messages on creation, but it is also
// called when old messages are first added to the chat log on page
// reload.
Hooks.on("renderChatMessage", (message, html, data) => {
  const now = new Date().getTime();
  if (message.data.timestamp >= now - WJH_HIGHLIGHT_DURATION_MS) {
    // Color messages that are recent relative to the current time
    $(html).css('border', '2px solid #f00');

    // Fade out the color after 4 seconds.
    $(html).css('transition', 'border-color 1.0s linear');
    setTimeout(() => $(html).css('border', ''), WJH_HIGHLIGHT_DURATION_MS);
  }
  return true;
});
