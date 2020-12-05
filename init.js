const DEFAULT_BORDER_COLOR = '#feb';
const DEFAULT_TITLE_COLOR = '#feb';
const DEFAULT_DURATION_S = 4.0;

/** Installs the module's reactive behavior. */
function registerHooks() {
  Hooks.once('init', () => {
    registerSettings();
  });
  
  Hooks.once("ready", () => {
    // Don't turn on smooth scrolling until after the initial chat log
    // is populated, since otherwise this causes a long animation to play
    // on first page load.
    $('#chat-log').css('scroll-behavior', 'smooth');
  });

  Hooks.on("renderChatMessage", (message, html, data) => {
    // This hook is called for new messages on creation, but it is also
    // called when old messages are first added to the chat log on page
    // reload.
    onRenderChatMessage(message, html);
  });
}

/** Installs the module's settings in the central panel. */
function registerSettings() {
  game.settings.register("what-just-happened", "highlightType", {
    name: "WhatJustHappened.Settings.highlightType.Name",
    hint: "WhatJustHappened.Settings.highlightType.Hint",
    scope: "world",
    config: true,
    default: "BorderAndTitle",
    type: String,
    choices: {
      "BorderAndTitle": "WhatJustHappened.Settings.highlightType.BorderAndTitle",
      "Border": "WhatJustHappened.Settings.highlightType.Border",
      "Title": "WhatJustHappened.Settings.highlightType.Title",
    }
  });

  game.settings.register("what-just-happened", "borderColor", {
    name: "WhatJustHappened.Settings.borderColor.Name",
    hint: "WhatJustHappened.Settings.borderColor.Hint",
    scope: "world",
    config: true,
    default: DEFAULT_BORDER_COLOR,
    type: String
  });

  game.settings.register("what-just-happened", "titleColor", {
    name: "WhatJustHappened.Settings.titleColor.Name",
    hint: "WhatJustHappened.Settings.titleColor.Hint",
    scope: "world",
    config: true,
    default: DEFAULT_TITLE_COLOR,
    type: String
  });

  game.settings.register("what-just-happened", "highlightDuration", {
    name: "WhatJustHappened.Settings.highlightDuration.Name",
    hint: "WhatJustHappened.Settings.highlightDuration.Hint",
    scope: "world",
    config: true,
    default: "" + DEFAULT_DURATION_S,
    type: String
  });
}

function parseDurationMs() {
  const value = parseFloat(game.settings.get("what-just-happened", "highlightDuration"));
  return Math.round((isNaN(value) ? DEFAULT_DURATION_S : value) * 1000);
}

function parseColor(key, defaultValue) {
  let value = game.settings.get("what-just-happened", key);
  if (!value) {
    return defaultValue;
  }
  if (!value.startsWith("#")) {
    value = "#" + value;
  }
  if (!/^#[0-9a-fA-F]{3,6}$/.test(value)) {
    return defaultValue;
  }
  return value;
}

/** Called for each message. */
function onRenderChatMessage(message, html) {
  const durationMs = parseDurationMs();
  const type = game.settings.get("what-just-happened", "highlightType");
  const isBorder = (type == 'Border' || type == 'BorderAndTitle');
  const isTitle = (type == 'Title' || type == 'BorderAndTitle');
  const borderColor = parseColor('borderColor', DEFAULT_BORDER_COLOR);
  const titleColor = parseColor('titleColor', DEFAULT_TITLE_COLOR);
  const now = new Date().getTime();
  if (durationMs > 0 && message.data.timestamp >= now - durationMs) {
    // Color messages that are recent relative to the current time
    if (isBorder) {
      $(html).css('border', '2px solid ' + borderColor);
      $(html).css('transition', 'border-color 1.0s linear');
    }
    const header = isTitle ? $(html).find('.message-header') : null;
    if (header) {
      header.css('background-color', titleColor);
      header.css('transition', 'background-color 1.0s linear');
    }

    setTimeout(() => {
      if (isBorder) {
        $(html).css('border', '');
      }
      if (header) {
        header.css('background-color', '');
      }
    }, durationMs);
  }
  return true;
}

// Install
registerHooks();
