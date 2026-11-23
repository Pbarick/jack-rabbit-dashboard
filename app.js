/* Jack Rabbit dashboard: dark theme. Plain JavaScript; AG Grid (community) for the summary grid.
   Sample values and names are placeholders; replace with live data. */

(function () {
  "use strict";

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DOW = ["S", "M", "T", "W", "T", "F", "S"];

  var HOLIDAYS = {
    "2024-12-25": "Christmas Day",
    "2025-01-01": "New Year's Day",
    "2026-05-25": "Memorial Day"
  };

  var FILTER_GROUPS = [
    ["Rabbit USA", "Rabbit Run USA One", "Rabbit Run USA Two"],
    ["Rabbit South", "Rabbit One South One", "Rabbit One South Two", "Rabbit One South Three"],
    ["CM DPG", "Nikko America", "Manubank", "Leasing Finance"]
  ];

  var TRADE_DATES = ["1 Jun 2024", "2 Jun 2024", "3 Jun 2024", "4 Jun 2024", "5 Jun 2024", "6 Jun 2024",
                     "7 Jun 2024", "8 Jun 2024", "9 Jun 2024", "10 Jun 2024", "11 Jun 2024", "12 Jun 2024"];
  var TRADE_COUNTS = [61, 58, 72, 66, 70, 64, 69, 75, 63, 68, 71, 65];
  var TRADE_STP = [51, 49, 53, 55, 54, 52, 56, 57, 53, 55, 58, 54];

  var PERF_BLUE = [640, 880, 780, 860, 720, 1180, 900, 1010, 1040, 880, 1120, 980];
  var PERF_GREEN = [380, 520, 470, 540, 430, 470, 560, 620, 500, 700, 440, 390];
  var PERF_DASH = [300, 520, 480, 500, 350, 380, 470, 540, 430, 380, 880, 520];

  var PERFORMERS_TOP = [
    { name: "Gamma Partners", value: "8.4%" },
    { name: "Alpha Capital", value: "8.4%" },
    { name: "Delta Capital", value: "8.4%" }
  ];
  var PERFORMERS_BOTTOM = [
    { name: "Beta Partners", value: "8.4%" },
    { name: "Kapa Capital", value: "8.4%" },
    { name: "Omicron Partners", value: "8.4%" }
  ];

  var REPORTS = [
    { name: "Realized / Unrealized Gain / Loss Report", date: "7-May-2024", lastRun: "12-Aug-2024", records: 1284, matched: 1236, exceptions: 48, funds: 6, status: "Completed", tone: "ok", owner: "Operations" },
    { name: "Position / Cash Balance Report", date: "14-May-2024", lastRun: "13-Aug-2024", records: 642, matched: 630, exceptions: 12, funds: 4, status: "Completed", tone: "ok", owner: "Fund Accounting" },
    { name: "Transaction History", date: "16-May-2024", lastRun: "17-Aug-2024", records: 3410, matched: 3198, exceptions: 212, funds: 9, status: "Needs review", tone: "warn", owner: "Trade Support" },
    { name: "Unrealized Gain / Loss Report", date: "17-May-2024", lastRun: "12-Sep-2024", records: 958, matched: 904, exceptions: 54, funds: 5, status: "Past due", tone: "bad", owner: "Valuation" }
  ];

  // Summary stepper: step 1 done, step 2 in progress, the rest not started.
  var STEPS = [
    { title: "Cap Stepper" },
    { title: "Cap Transactions", num: "145", label: "Alerts" },
    { title: "Rabbit Recon" },
    { title: "Jack Vals", num: "25", label: "Notifications" },
    { title: "Cap Accruals" },
    { title: "Rabbit P&L" },
    { title: "Cap Allocation", num: "93", label: "EXCEPTIONS", upper: true }
  ];
  var STEP_ACTIVE = 1;

  // Grid row patterns taken from the summary screenshot.
  var GRID_PATTERNS = [
    { sev: "high", fund: "RABBIT ALPHA FUND", from: "125.77", to: "76.51", status: "Complete" },
    { sev: "low", fund: "RABBIT ALPHA FUND 2", from: "235.47", to: "76.51", status: "Pending" },
    { sev: "low", fund: "RABBIT ALPHA FUND 3", from: "125.77", to: "76.51", status: "Complete" },
    { sev: "low", fund: "RABBIT ALPHA FUND 3", from: "125.77", to: "76.51", status: "Pending" },
    { sev: "high", fund: "RABBIT ALPHA FUND", from: "125.77", to: "76.51", status: "Complete" },
    { sev: "low", fund: "RABBIT ALPHA FUND 3", from: "125.77", to: "76.51", status: "Complete" },
    { sev: "low", fund: "RABBIT ALPHA FUND 3", from: "125.77", to: "76.51", status: "Past Due" },
    { sev: "high", fund: "RABBIT ALPHA FUND", from: "125.77", to: "76.51", status: "Complete" },
    { sev: "low", fund: "RABBIT ALPHA FUND 3", from: "125.77", to: "76.51", status: "Complete" },
    { sev: "low", fund: "RABBIT ALPHA FUND 3", from: "125.77", to: "76.51", status: "Past Due" },
    { sev: "low", fund: "RABBIT ALPHA FUND 2", from: "235.47", to: "76.51", status: "Pending" },
    { sev: "high", fund: "RABBIT ALPHA FUND", from: "125.77", to: "76.51", status: "Complete" },
    { sev: "low", fund: "RABBIT ALPHA FUND 3", from: "125.77", to: "76.51", status: "Complete" },
    { sev: "low", fund: "RABBIT ALPHA FUND 3", from: "125.77", to: "76.51", status: "Past Due" },
    { sev: "high", fund: "RABBIT ALPHA FUND", from: "125.77", to: "76.51", status: "Complete" }
  ];
  var STAGES = ["Active", "Pending", "Validated", "Resolved"];
  var TOTAL_ROWS = 127;
  var LIVE_INTERVAL_MS = 4000;

  var SEV_LABEL = { high: "High", med: "Medium", low: "Low" };
  var SEV_RANK = { high: 0, med: 1, low: 2 };
  var STATUS_RANK = { "Complete": 0, "Pending": 1, "Past Due": 2 };
  var STATUS_ORDER = ["Complete", "Pending", "Past Due"];

  var ROWS = [];
  for (var r = 0; r < TOTAL_ROWS; r++) {
    var p = GRID_PATTERNS[r % GRID_PATTERNS.length];
    ROWS.push({
      id: r + 1,
      sev: p.sev,
      fund: p.fund,
      reason: "Quantity",
      expected: p.from + " - " + p.to,
      status: p.status,
      created: new Date(2024, 7, 12, 8, 7),
      stage: STAGES[r % STAGES.length]
    });
  }

  var state = {
    selectedDate: new Date(2024, 11, 16),
    calMonth: new Date(2024, 11, 1),
    stage: "All",
    tradeIndex: 2,
    assetTab: 0,
    filterChecked: {},
    filterOpen: false,
    dateOpen: false,
    live: true
  };

  FILTER_GROUPS.forEach(function (group) {
    group.forEach(function (name) { state.filterChecked[name] = true; });
  });

  var grid = null;
  var liveTimer = null;

  // >>> START: Helpers
  // ---------- Helpers ----------

  // >>> START: function pad
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  // <<< END: function pad
  function $(id) { return document.getElementById(id); }

  // >>> START: function formatDate
  function formatDate(d) {
    return pad(d.getDate()) + "-" + MONTHS[d.getMonth()] + "-" + d.getFullYear();
  }
  // <<< END: function formatDate

  // >>> START: function formatSpecTitle
  function formatSpecTitle(d) {
    return WEEKDAYS[d.getDay()] + ", " + MONTHS[d.getMonth()] + " " + d.getDate();
  }
  // <<< END: function formatSpecTitle

  // >>> START: function formatDateTime
  function formatDateTime(d) {
    var h = d.getHours();
    var h12 = h % 12 || 12;
    return pad(d.getDate()) + "-" + MONTHS[d.getMonth()] + "-" + d.getFullYear() + " " +
      pad(h12) + ":" + pad(d.getMinutes()) + " " + (h >= 12 ? "PM" : "AM");
  }
  // <<< END: function formatDateTime

  // >>> START: function isoKey
  function isoKey(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  // <<< END: function isoKey

  // >>> START: function sameDay
  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  // <<< END: function sameDay

  // >>> START: function startOfDay
  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  // <<< END: function startOfDay

  // >>> START: function parseISODay
  function parseISODay(s) {
    var parts = String(s).split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }
  // <<< END: function parseISODay

  var ICON_TRIANGLE = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3L2 21h20z"/><path d="M12 10v5M12 18h0"/></svg>';
  var ICON_CHECK_CIRCLE = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/></svg>';
  var ICON_CHECK = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  // <<< END: Helpers
  // >>> START: Date picker
  // ---------- Date picker ----------

  // >>> START: function renderCalendar
  function renderCalendar() {
    var m = state.calMonth;
    var year = m.getFullYear();
    var month = m.getMonth();
    var offset = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var today = new Date();

    var cells = [];
    for (var i = 0; i < offset; i++) {
      cells.push({ date: new Date(year, month, 1 - (offset - i)), outside: true });
    }
    for (var d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), outside: false });
    }
    var extra = 1;
    while (cells.length < 42) {
      cells.push({ date: new Date(year, month + 1, extra), outside: true });
      extra++;
    }

    var dayButtons = cells.map(function (c) {
      var key = isoKey(c.date);
      var cls = ["cal-day"];
      if (c.outside) cls.push("is-outside");
      if (HOLIDAYS[key]) cls.push("has-holiday");
      if (sameDay(c.date, state.selectedDate)) cls.push("is-selected");
      if (sameDay(c.date, today)) cls.push("is-today");
      return '<button type="button" class="' + cls.join(" ") + '" data-action="pick-day" data-date="' + key +
        '" aria-label="' + formatSpecTitle(c.date) + '">' + c.date.getDate() + "</button>";
    }).join("");

    var dows = DOW.map(function (w) { return '<div class="cal-dow">' + w + "</div>"; }).join("");

    var holidayBar = "";
    Object.keys(HOLIDAYS).sort().forEach(function (key) {
      if (!holidayBar && key.indexOf(year + "-" + pad(month + 1)) === 0) {
        holidayBar = '<div class="cal-holiday-bar">' + HOLIDAYS[key] + "</div>";
      }
    });

    $("datepicker").innerHTML =
      '<p class="cal-select-label">SELECT DATE</p>' +
      '<p class="cal-title">' + formatSpecTitle(state.selectedDate) + "</p>" +
      '<div class="cal-month-row">' +
        '<span class="cal-month">' + MONTHS_LONG[month].toUpperCase() + " " + year + "</span>" +
        '<span class="cal-nav">' +
          '<button type="button" data-action="cal-prev" aria-label="Previous month">&#8249;</button>' +
          '<button type="button" data-action="cal-next" aria-label="Next month">&#8250;</button>' +
        "</span>" +
      "</div>" +
      '<div class="cal-grid">' + dows + dayButtons + "</div>" +
      holidayBar;
  }
  // <<< END: function renderCalendar

  // >>> START: function setDatePickerOpen
  function setDatePickerOpen(open) {
    state.dateOpen = open;
    $("datepicker").hidden = !open;
    $("dateBtn").setAttribute("aria-expanded", String(open));
    if (open) {
      state.calMonth = new Date(state.selectedDate.getFullYear(), state.selectedDate.getMonth(), 1);
      renderCalendar();
    }
  }
  // <<< END: function setDatePickerOpen

  // >>> START: function selectDate
  function selectDate(isoStr) {
    state.selectedDate = parseISODay(isoStr);
    $("dateLabel").textContent = formatDate(state.selectedDate);
    setDatePickerOpen(false);
  }
  // <<< END: function selectDate

  // <<< END: Date picker
  // >>> START: Fund filter
  // ---------- Fund filter ----------

  // >>> START: function renderFilter
  function renderFilter() {
    var names = [];
    FILTER_GROUPS.forEach(function (g) { names = names.concat(g); });
    var checked = names.filter(function (n) { return state.filterChecked[n]; });

    var label = "All Funds";
    if (checked.length === 0) label = "No Funds";
    else if (checked.length < names.length) label = checked.length + " selected";
    $("filterLabel").textContent = label;

    var allOn = checked.length === names.length;
    var groups = FILTER_GROUPS.map(function (g) {
      var items = g.map(function (name) {
        return '<label class="filter-item"><input type="checkbox" class="check" data-action="filter-item" data-name="' +
          name + '"' + (state.filterChecked[name] ? " checked" : "") + "><span>" + name + "</span></label>";
      }).join("");
      return '<div class="filter-group">' + items + "</div>";
    }).join("");

    $("filterPanel").innerHTML =
      '<label class="filter-item filter-all"><input type="checkbox" class="check" data-action="filter-all"' +
        (allOn ? " checked" : "") + "><span>All Funds</span></label>" +
      groups;
  }
  // <<< END: function renderFilter

  // >>> START: function setFilterOpen
  function setFilterOpen(open) {
    state.filterOpen = open;
    $("filterPanel").hidden = !open;
    $("filterBtn").setAttribute("aria-expanded", String(open));
  }
  // <<< END: function setFilterOpen

  // <<< END: Fund filter
  // >>> START: Dashboard charts
  // ---------- Dashboard charts ----------

  // >>> START: function areaDefs
  function areaDefs() {
    return '<defs><linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#3B82F6" stop-opacity="0.35"/>' +
      '<stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>' +
      "</linearGradient>" +
      '<linearGradient id="lineBlue" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#2D6BF0"/><stop offset="100%" stop-color="#4FB3FF"/></linearGradient></defs>';
  }
  // <<< END: function areaDefs

  // >>> START: function pathFor
  function pathFor(values, xFor, yFor) {
    return values.map(function (v, i) {
      return (i === 0 ? "M" : "L") + xFor(i).toFixed(1) + " " + yFor(v).toFixed(1);
    }).join(" ");
  }
  // <<< END: function pathFor

  // >>> START: function performanceChartSVG
  function performanceChartSVG(w, h) {
    var left = 34, right = 8, top = 10, bottom = 24;
    var plotW = w - left - right, plotH = h - top - bottom;
    var yFor = function (v) { return top + plotH - (v / 1500) * plotH; };
    var xFor = function (i) { return left + (i * plotW) / (PERF_BLUE.length - 1); };

    var grid = "", labels = "";
    [0, 500, 1000, 1500].forEach(function (t) {
      var y = yFor(t);
      grid += '<line class="chart-grid" x1="' + left + '" x2="' + (w - right) + '" y1="' + y + '" y2="' + y + '"/>';
      labels += '<text class="chart-axis" x="' + (left - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + t + "</text>";
    });

    var bluePath = pathFor(PERF_BLUE, xFor, yFor);
    var areaPath = bluePath + " L" + xFor(PERF_BLUE.length - 1).toFixed(1) + " " + yFor(0).toFixed(1) +
      " L" + xFor(0).toFixed(1) + " " + yFor(0).toFixed(1) + " Z";

    var monthLabels = "";
    MONTHS.forEach(function (mo, i) {
      monthLabels += '<text class="chart-axis chart-axis-sm" x="' + xFor(i).toFixed(1) + '" y="' + (h - 6) + '" text-anchor="middle">' + mo + "</text>";
    });

    return '<svg class="chart" style="width:' + w + "px;height:" + h + 'px" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Rabbit performance chart">' +
      areaDefs() + grid + labels +
      '<path class="chart-area-blue" d="' + areaPath + '"/>' +
      '<path class="chart-line-blue" d="' + bluePath + '"/>' +
      '<path class="chart-line-green" d="' + pathFor(PERF_GREEN, xFor, yFor) + '"/>' +
      '<path class="chart-line-dash" d="' + pathFor(PERF_DASH, xFor, yFor) + '"/>' +
      monthLabels +
      "</svg>";
  }
  // <<< END: function performanceChartSVG

  // Trades combo chart: stacked bars, translucent area band behind them,
  // STP line with markers, and a dashed crosshair on the active day.
  // >>> START: function tradeGeometry
  function tradeGeometry(w, h) {
    var left = 40, right = 16, top = 24, bottom = 28;
    var plotW = w - left - right, plotH = h - top - bottom;
    var slot = plotW / TRADE_COUNTS.length;
    return {
      w: w, h: h, left: left, right: right, top: top, plotH: plotH,
      slot: slot, barW: slot * 0.42,
      yFor: function (v) { return top + plotH - (v / 120) * plotH; },
      cxFor: function (i) { return left + slot * i + slot / 2; }
    };
  }
  // <<< END: function tradeGeometry

  // >>> START: function tradeChartSVG
  function tradeChartSVG(w, h) {
    var g = tradeGeometry(w, h);
    var base = g.yFor(0);

    var axis = "";
    [0, 40, 80, 120].forEach(function (t) {
      var y = g.yFor(t);
      axis += '<line class="chart-grid" x1="' + g.left + '" x2="' + (g.w - g.right) + '" y1="' + y + '" y2="' + y + '"/>';
      axis += '<text class="chart-axis" x="' + (g.left - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + t + "</text>";
    });

    var bandTop = TRADE_COUNTS.map(function (c, i) {
      return g.cxFor(i).toFixed(1) + " " + g.yFor(c).toFixed(1);
    });
    var bandPath = "M" + bandTop.join(" L") + " L" + g.cxFor(TRADE_COUNTS.length - 1).toFixed(1) + " " + base.toFixed(1) +
      " L" + g.cxFor(0).toFixed(1) + " " + base.toFixed(1) + " Z";

    var bars = "";
    TRADE_COUNTS.forEach(function (count, i) {
      var x = g.cxFor(i) - g.barW / 2;
      var active = i === state.tradeIndex;
      var lower = Math.round(count * 0.55);
      var yLow = g.yFor(lower);
      var yTop = g.yFor(count);
      bars += '<rect class="trade-bar-base' + (active ? " is-active" : "") + '" data-trade="' + i +
        '" x="' + x.toFixed(1) + '" y="' + yLow.toFixed(1) + '" width="' + g.barW.toFixed(1) +
        '" height="' + (base - yLow).toFixed(1) + '" rx="2"/>';
      bars += '<rect class="trade-bar-top' + (active ? " is-active" : "") + '" data-trade="' + i +
        '" x="' + x.toFixed(1) + '" y="' + yTop.toFixed(1) + '" width="' + g.barW.toFixed(1) +
        '" height="' + (yLow - yTop).toFixed(1) + '" rx="2"/>';
    });

    var linePts = [], dots = "";
    TRADE_STP.forEach(function (rate, i) {
      var cx = g.cxFor(i);
      var cy = g.yFor(rate * 1.2);
      linePts.push(cx.toFixed(1) + " " + cy.toFixed(1));
      dots += '<circle class="trade-dot' + (i === state.tradeIndex ? " is-active" : "") + '" cx="' +
        cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + (i === state.tradeIndex ? 5 : 3) + '"/>';
    });

    var cross = g.cxFor(state.tradeIndex);
    var crossY = g.yFor(TRADE_STP[state.tradeIndex] * 1.2);
    var crosshair = '<line class="trade-cross" x1="' + cross.toFixed(1) + '" x2="' + cross.toFixed(1) +
      '" y1="' + crossY.toFixed(1) + '" y2="' + base.toFixed(1) + '"/>';

    var dayLabels = "";
    TRADE_DATES.forEach(function (d, i) {
      dayLabels += '<text class="chart-axis chart-axis-sm" x="' + g.cxFor(i).toFixed(1) + '" y="' + (g.h - 8) +
        '" text-anchor="middle">' + (i + 1) + " Jun</text>";
    });

    return '<svg class="chart chart-trades" style="width:' + g.w + "px;height:" + g.h + 'px" viewBox="0 0 ' + g.w + " " + g.h + '" role="img" aria-label="Trades combo chart">' +
      '<defs><linearGradient id="tradeArea" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#20C8C0" stop-opacity="0.22"/>' +
        '<stop offset="100%" stop-color="#20C8C0" stop-opacity="0.02"/>' +
      "</linearGradient>" +
        '<linearGradient id="tradeBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3F7BFF"/><stop offset="100%" stop-color="#2249C4"/></linearGradient>' +
        '<linearGradient id="tradeTeal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5BE6DD"/><stop offset="100%" stop-color="#17AFA8"/></linearGradient>' +
        '<linearGradient id="tradeLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#FF6B6B"/><stop offset="100%" stop-color="#FF9A8B"/></linearGradient></defs>' +
      axis +
      '<path class="trade-area" d="' + bandPath + '"/>' +
      bars + crosshair +
      '<polyline class="trade-line" points="' + linePts.join(" ") + '"/>' +
      dots + dayLabels +
      "</svg>";
  }
  // <<< END: function tradeChartSVG

  // >>> START: function ringSVG
  function ringSVG(done, total) {
    var pct = total ? Math.max(0, Math.min(100, (done / total) * 100)) : 0;
    var r = 52, c = 2 * Math.PI * r;
    var dash = (pct / 100) * c;
    return '<svg class="ring" viewBox="0 0 120 120" role="img" aria-label="' + done + " of " + total + ' complete">' +
      '<defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#1FC7BE"/><stop offset="100%" stop-color="#7BE8E2"/>' +
      "</linearGradient></defs>" +
      '<circle class="ring-track" cx="60" cy="60" r="' + r + '"/>' +
      '<circle class="ring-value" cx="60" cy="60" r="' + r + '" stroke-dasharray="' + dash.toFixed(2) + " " + c.toFixed(2) + '"/>' +
      '<text class="ring-text" x="60" y="58">' + done + "</text>" +
      '<text class="ring-sub" x="60" y="74">of ' + total + "</text>" +
      "</svg>";
  }
  // <<< END: function ringSVG

  // Semicircle gauge for the summary page (arc starts at the left).
  // >>> START: function semicircleSVG
  function semicircleSVG(pct) {
    var cx = 75, cy = 78, r = 62;
    var theta = Math.PI * (1 - Math.max(0, Math.min(100, pct)) / 100);
    var ex = cx + r * Math.cos(theta), ey = cy - r * Math.sin(theta);
    var track = "M" + (cx - r) + " " + cy + " A" + r + " " + r + " 0 0 1 " + (cx + r) + " " + cy;
    var value = "M" + (cx - r) + " " + cy + " A" + r + " " + r + " 0 0 1 " + ex.toFixed(2) + " " + ey.toFixed(2);
    return '<svg viewBox="0 0 150 84" role="img" aria-label="' + pct + ' percent complete">' +
      '<path class="gauge-track" d="' + track + '"/>' +
      '<path class="gauge-value" d="' + value + '"/>' +
      "</svg>";
  }
  // <<< END: function semicircleSVG

  // <<< END: Dashboard charts
  // >>> START: Dashboard cards
  // ---------- Dashboard cards ----------

  // >>> START: function performerList
  function performerList(title, rows, dir) {
    var arrow = dir === "up" ? "&#8593;" : "&#8595;";
    var items = rows.map(function (r) {
      return '<li class="performer-row"><span>' + r.name + '</span><span class="perf-' + dir + '">' +
        arrow + " " + r.value + "</span></li>";
    }).join("");
    return '<div><h3 class="perf-title">' + title + '</h3><ul class="performer-list">' + items + "</ul></div>";
  }
  // <<< END: function performerList

  // Draws the performance chart at the box's real size so it fills the card height.
  // >>> START: function drawPerformance
  function drawPerformance() {
    var box = $("perfChart");
    if (!box) return;
    var w = Math.round(box.clientWidth), h = Math.round(box.clientHeight);
    if (w < 120 || h < 120) return;
    box.innerHTML = performanceChartSVG(w, h);
  }
  // <<< END: function drawPerformance

  // >>> START: function renderPerformance
  function renderPerformance() {
    $("performance").innerHTML =
      '<div class="perf-value"><span class="big-number">$7.65</span><span class="delta">&#8599; 25%</span></div>' +
      '<div class="perf-chart" id="perfChart" role="img" aria-label="Rabbit performance chart"></div>' +
      '<div class="performers">' +
        performerList("Top Performers", PERFORMERS_TOP, "up") +
        performerList("Bottom Performers", PERFORMERS_BOTTOM, "down") +
      "</div>";
    drawPerformance();
    var box = $("perfChart");
    if (box && window.ResizeObserver) new ResizeObserver(drawPerformance).observe(box);
  }
  // <<< END: function renderPerformance

  // >>> START: function observeTrades
  function observeTrades() {
    if (!window.ResizeObserver) return;
    new ResizeObserver(renderTrades).observe($("trades"));
  }
  // <<< END: function observeTrades

  // Sample data for the three Assets tabs (RABBIT, ITEM 2, ITEM 3).
  var ASSET_SETS = [
    { updated: "12/20/24", caught: true, tx: "3,410", txNote: "Need your attention", trades: "12", tradesNote: "Ready for approval", pending: "37", pendingNote: "Pending approval", done: 68, total: 288, of: "6 of 88" },
    { updated: "12/18/24", caught: false, activity: "4 items to review", tx: "1,286", txNote: "Need your attention", trades: "7", tradesNote: "Ready for approval", pending: "19", pendingNote: "Pending approval", done: 41, total: 120, of: "3 of 40" },
    { updated: "12/15/24", caught: true, tx: "864", txNote: "Need your attention", trades: "0", tradesNote: "Ready for approval", pending: "5", pendingNote: "Pending approval", done: 112, total: 150, of: "9 of 12" }
  ];

  // >>> START: function renderAssets
  function renderAssets() {
    var d = ASSET_SETS[state.assetTab];
    var people = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="10" r="4"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5"/></svg>';
    var activityText = d.caught ? "You&#8217;re all caught up!" : d.activity;
    $("assetsUpdated").textContent = "Last Updated " + d.updated;
    $("assets").innerHTML =
      '<div class="metric-grid">' +
        '<div class="metric">' +
          '<span class="metric-label">Rabbit Activity</span>' +
          '<div class="check-big">' + (d.caught ? '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>' : ICON_TRIANGLE) + "</div>" +
          '<span class="metric-foot">' + activityText + "</span>" +
        "</div>" +
        '<div class="metric">' +
          '<span class="metric-label">Transactions</span>' +
          '<span class="metric-num"><span class="num-icon">' + people + "</span>" + d.tx + "</span>" +
          '<span class="metric-sub">' + d.txNote + "</span>" +
          '<button type="button" class="btn-primary">Fix Trades</button>' +
        "</div>" +
        '<div class="metric">' +
          '<span class="metric-label">Trades in Progress</span>' +
          '<span class="metric-num"><span class="num-icon">' + people + "</span>" + d.trades + "</span>" +
          '<span class="metric-sub">' + d.tradesNote + "</span>" +
          '<button type="button" class="btn-primary">View Approvals</button>' +
        "</div>" +
        '<div class="metric">' +
          '<span class="metric-label">Pending</span>' +
          '<span class="metric-num"><span class="num-icon">' + people + "</span>" + d.pending + "</span>" +
          '<span class="metric-sub">' + d.pendingNote + "</span>" +
          '<button type="button" class="btn-primary">Approve New</button>' +
        "</div>" +
      "</div>";
  }
  // <<< END: function renderAssets

  // >>> START: function renderComplete
  function renderComplete() {
    var d = ASSET_SETS[state.assetTab];
    $("complete").innerHTML = ringSVG(d.done, d.total);
    $("completeOf").textContent = d.of;
  }
  // <<< END: function renderComplete

  // Draws the Trades chart at the card body's real size so it fills the card height.
  // Width is at least 560px; on narrow screens the chart box scrolls sideways.
  // >>> START: function renderTrades
  function renderTrades() {
    var i = state.tradeIndex;
    var body = $("trades");
    var w = Math.max(560, Math.round(body.clientWidth));
    var h = Math.max(120, Math.round(body.clientHeight));
    var g = tradeGeometry(w, h);
    body.innerHTML =
      '<div class="trade-chart" id="tradeChart">' +
        tradeChartSVG(w, h) +
        '<div class="trade-tooltip" id="tradeTooltip" style="left:' + g.cxFor(i).toFixed(1) + 'px">' +
          '<div class="tt-date">' + TRADE_DATES[i] + "</div>" +
          '<div class="tt-main">' + TRADE_COUNTS[i] + ' Trades<span class="tt-chip">' + TRADE_STP[i] + "% STP Rate</span></div>" +
        "</div>" +
      "</div>";
  }
  // <<< END: function renderTrades

  // >>> START: function reportTile
  function reportTile(label, value, tone) {
    return '<div class="rd-tile' + (tone ? " is-" + tone : "") + '"><span>' + label + "</span><b>" + value + "</b></div>";
  }
  // <<< END: function reportTile

  // >>> START: function renderReports
  function renderReports() {
    var items = REPORTS.map(function (r, i) {
      var pct = Math.round((r.matched / r.records) * 100);
      return '<li class="report-item" id="report-' + i + '">' +
        '<div class="report-row">' +
          '<span class="report-name">' + r.name + '<span class="report-date">' + r.date + "</span></span>" +
          '<span class="report-last">Last run on ' + r.lastRun + "</span>" +
          '<button type="button" class="report-toggle" data-action="toggle-report" data-index="' + i + '" aria-expanded="false">View Report</button>' +
          '<svg class="chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>' +
        "</div>" +
        '<div class="report-detail">' +
          '<div class="rd-head">' +
            '<span class="rd-status is-' + r.tone + '">' + r.status + "</span>" +
            "<span>Owner: " + r.owner + "</span>" +
          "</div>" +
          '<div class="rd-grid">' +
            reportTile("Records", r.records.toLocaleString("en-US")) +
            reportTile("Matched", r.matched.toLocaleString("en-US")) +
            reportTile("Exceptions", r.exceptions, r.exceptions > 100 ? "bad" : "warn") +
            reportTile("Funds covered", r.funds) +
          "</div>" +
          '<div class="rd-match">' +
            '<div class="rd-match-top"><span>Match rate</span><b>' + pct + "%</b></div>" +
            '<div class="rd-bar"><span style="width:' + pct + '%"></span></div>' +
          "</div>" +
          '<div class="rd-foot">' +
            "<span>Report date " + r.date + " &middot; Last run " + r.lastRun + "</span>" +
            '<div class="rd-actions"><button type="button" class="btn-outline btn-sm">Download CSV</button>' +
            '<button type="button" class="btn-primary btn-sm">Open Report</button></div>' +
          "</div>" +
        "</div>" +
      "</li>";
    }).join("");
    $("reports").innerHTML = '<ul class="report-list">' + items + "</ul>";
  }
  // <<< END: function renderReports

  // <<< END: Dashboard cards
  // >>> START: Summary page: stepper, gauge, stage filters
  // ---------- Summary page: stepper, gauge, stage filters ----------

  // >>> START: function renderStepper
  function renderStepper() {
    var last = STEPS.length - 1;
    $("stepper").innerHTML = STEPS.map(function (s, i) {
      var nodeState = i < STEP_ACTIVE ? "is-done" : i === STEP_ACTIVE ? "is-active" : "";
      var segState = i < STEP_ACTIVE ? "is-done" : (i <= STEP_ACTIVE + 1 && i < last) ? "is-active" : "is-future";
      var nodeIcon = i < STEP_ACTIVE ? ICON_CHECK : "";
      var divider = (i === 1 || i === 3 || i === 6) ? '<span class="sm-divider"></span>' : "";
      var count = s.num
        ? '<div class="sm-count' + (s.upper ? " is-upper" : "") + '"><b>' + s.num + '</b><span>' + s.label + "</span></div>"
        : "";
      return '<li class="sm-step">' +
        '<span class="sm-step-label">' + s.title + "</span>" +
        '<div class="sm-node-row">' +
          '<span class="sm-node ' + nodeState + '">' + nodeIcon + "</span>" +
          (i < last ? '<span class="sm-seg ' + segState + '"></span>' : "") +
        "</div>" +
        count + divider +
      "</li>";
    }).join("");
  }
  // <<< END: function renderStepper

  // >>> START: function renderGauge
  function renderGauge() {
    $("gauge").innerHTML = semicircleSVG(17) +
      '<p class="sm-gauge-text">17%</p><p class="sm-gauge-sub">Complete</p>';
  }
  // <<< END: function renderGauge

  // >>> START: function stageMatches
  function stageMatches(row) {
    return state.stage === "All" || row.stage === state.stage;
  }
  // <<< END: function stageMatches

  // >>> START: function renderStageFilters
  function renderStageFilters() {
    var counts = { All: ROWS.length };
    STAGES.forEach(function (s) { counts[s] = 0; });
    ROWS.forEach(function (r) { counts[r.stage]++; });
    var labels = ["All"].concat(STAGES);
    $("statusFilters").innerHTML = labels.map(function (label) {
      return '<button type="button" class="sm-filter' + (state.stage === label ? " is-active" : "") +
        '" data-action="status-filter" data-status="' + label + '">' + label + " (" + counts[label] + ")</button>";
    }).join("");
  }
  // <<< END: function renderStageFilters

  // <<< END: Summary page: stepper, gauge, stage filters
  // >>> START: Summary page: AG Grid (infinite row model)
  // ---------- Summary page: AG Grid (infinite row model) ----------

  // >>> START: function gridTheme
  function gridTheme() {
    var AG = window.agGrid;
    return AG.themeQuartz.withPart(AG.colorSchemeDark).withParams({
      backgroundColor: "#0A1424",
      foregroundColor: "#E6EDF7",
      headerBackgroundColor: "#0C1729",
      headerTextColor: "#FFFFFF",
      borderColor: "#1B2D48",
      oddRowBackgroundColor: "#0C1A2E",
      rowHoverColor: "#12233D",
      accentColor: "#2D6BF0",
      selectedRowBackgroundColor: "rgba(45, 107, 240, 0.12)",
      fontFamily: "Inter, Roboto, Arial, sans-serif",
      fontSize: 14,
      headerFontSize: 13,
      headerFontWeight: 700,
      rowHeight: 51,
      headerHeight: 48,
      cellHorizontalPadding: 20,
      wrapperBorderRadius: 0
    });
  }
  // <<< END: function gridTheme

  // >>> START: function el
  function el(html) {
    var span = document.createElement("span");
    span.innerHTML = html;
    return span;
  }
  // <<< END: function el

  // >>> START: function sevCell
  function sevCell(p) {
    var r = p.data;
    if (!r) return el("");
    var icon = r.sev === "low" ? ICON_CHECK : ICON_TRIANGLE;
    return el('<span class="sm-sev is-' + r.sev + '">' + icon + SEV_LABEL[r.sev] + "</span>");
  }
  // <<< END: function sevCell

  // >>> START: function statusCell
  function statusCell(p) {
    var s = p.value;
    var cls = s === "Complete" ? "is-complete" : s === "Pending" ? "is-pending" : "is-pastdue";
    var icon = s === "Complete" ? ICON_CHECK_CIRCLE : ICON_TRIANGLE;
    return el('<span class="sm-pill ' + cls + '">' + icon + s + "</span>");
  }
  // <<< END: function statusCell

  // >>> START: function actionCell
  function actionCell() {
    return el('<button type="button" class="sm-link">View Report</button>');
  }
  // <<< END: function actionCell

  // Date filter: compare calendar days only.
  // >>> START: function dateFilterComparator
  function dateFilterComparator(filterDate, cellValue) {
    if (!cellValue) return 0;
    var cell = startOfDay(cellValue);
    return cell.getTime() - filterDate.getTime();
  }
  // <<< END: function dateFilterComparator

  var COLUMNS = [
    {
      colId: "sev", headerName: "Severity", field: "sev", width: 150,
      cellRenderer: sevCell,
      comparator: function (a, b) { return SEV_RANK[a] - SEV_RANK[b]; },
    },
    {
      colId: "fund", headerName: "Fund", field: "fund", flex: 1.2, minWidth: 180,
      cellClass: "sm-cell-fund"
    },
    {
      colId: "reason", headerName: "Reason", field: "reason", flex: 1, minWidth: 120,
    },
    {
      colId: "expected", headerName: "Expected Value from/to", field: "expected", flex: 1.4, minWidth: 170,
    },
    {
      colId: "status", headerName: "Status", field: "status", width: 170,
      cellRenderer: statusCell,
      comparator: function (a, b) { return STATUS_RANK[a] - STATUS_RANK[b]; },
    },
    {
      colId: "created", headerName: "Date Created", field: "created", flex: 1.2, minWidth: 180,
      valueFormatter: function (p) { return p.value ? formatDateTime(p.value) : ""; },
      comparator: function (a, b) { return (a ? a.getTime() : 0) - (b ? b.getTime() : 0); },
    },
    {
      colId: "actions", headerName: "Actions", field: "id", width: 150,
      cellRenderer: actionCell, sortable: false, filter: false
    }
  ];

  // >>> START: function sortValue
  function sortValue(row, colId) {
    if (colId === "sev") return SEV_RANK[row.sev];
    if (colId === "status") return STATUS_RANK[row.status];
    if (colId === "created") return row.created.getTime();
    return row[colId] === undefined ? "" : row[colId];
  }
  // <<< END: function sortValue

  // >>> START: function sortRows
  function sortRows(rows, sortModel) {
    if (!sortModel || !sortModel.length) return rows;
    var s = sortModel[0];
    var dir = s.sort === "desc" ? -1 : 1;
    return rows.slice().sort(function (a, b) {
      var va = sortValue(a, s.colId), vb = sortValue(b, s.colId);
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return a.id - b.id;
    });
  }
  // <<< END: function sortRows

  // >>> START: function matchDate
  function matchDate(d, m) {
    var day = startOfDay(d).getTime();
    var from = m.dateFrom ? parseISODay(m.dateFrom).getTime() : null;
    var to = m.dateTo ? parseISODay(m.dateTo).getTime() : null;
    switch (m.type) {
      case "equals": return day === from;
      case "notEqual": return day !== from;
      case "greaterThan": return day > from;
      case "lessThan": return day < from;
      case "inRange": return day >= from && day <= to;
      default: return true;
    }
  }
  // <<< END: function matchDate

  // >>> START: function matchText
  function matchText(value, m) {
    var v = String(value || "").toLowerCase();
    var f = String(m.filter || "").toLowerCase();
    switch (m.type) {
      case "equals": return v === f;
      case "notEqual": return v !== f;
      case "startsWith": return v.indexOf(f) === 0;
      case "endsWith": return v.length >= f.length && v.slice(v.length - f.length) === f;
      case "notContains": return v.indexOf(f) === -1;
      default: return v.indexOf(f) !== -1;
    }
  }
  // <<< END: function matchText

  // >>> START: function matchFilters
  function matchFilters(row, filterModel) {
    var keys = Object.keys(filterModel || {});
    for (var k = 0; k < keys.length; k++) {
      var colId = keys[k];
      var m = filterModel[colId];
      if (!m) continue;
      if (colId === "created") {
        if (!matchDate(row.created, m)) return false;
      } else if (!matchText(row[colId], m)) {
        return false;
      }
    }
    return true;
  }
  // <<< END: function matchFilters

  // >>> START: function visibleRows
  function visibleRows() {
    return ROWS.filter(stageMatches);
  }
  // <<< END: function visibleRows

  // >>> START: function updateFoot
  function updateFoot(extra) {
    var count = visibleRows().length;
    $("gridFoot").textContent = "Showing " + count + " rows" + (extra ? ". " + extra : "") + ".";
  }
  // <<< END: function updateFoot

  // Infinite row model data source: the grid asks for one block at a time,
  // and sort and filter changes reach here as models.
  // >>> START: function makeDatasource
  function makeDatasource() {
    return {
      getRows: function (params) {
        var rows = visibleRows().filter(function (row) { return matchFilters(row, params.filterModel); });
        rows = sortRows(rows, params.sortModel);
        // Copies, so the grid sees changed status values when the cache is refreshed.
        var block = rows.slice(params.startRow, params.endRow).map(function (row) { return Object.assign({}, row); });
        params.successCallback(block, rows.length);
        updateFoot();
      }
    };
  }
  // <<< END: function makeDatasource

  // >>> START: function onGridCellClicked
  function onGridCellClicked(event) {
    if (event.colDef && event.colDef.colId === "actions" && event.data) {
      updateFoot("Opened report for row " + event.data.id);
    }
  }
  // <<< END: function onGridCellClicked

  // >>> START: function ensureGrid
  function ensureGrid() {
    if (grid) return;
    var AG = window.agGrid;
    AG.ModuleRegistry.registerModules([AG.AllCommunityModule]);
    grid = AG.createGrid($("summaryGrid"), {
      columnDefs: COLUMNS,
      defaultColDef: { sortable: true, filter: false, resizable: false },  /* ascending/descending sort only, no filters */
      rowModelType: "infinite",
      cacheBlockSize: 40,
      maxBlocksInCache: 8,
      infiniteInitialRowCount: 1,
      datasource: makeDatasource(),
      theme: gridTheme(),
      onCellClicked: onGridCellClicked
    });
  }
  // <<< END: function ensureGrid

  // >>> START: function refreshGridForStage
  function refreshGridForStage() {
    if (!grid) return;
    grid.setGridOption("datasource", makeDatasource());
    updateFoot();
  }
  // <<< END: function refreshGridForStage

  // Live updates: while On, three rows near the top of the grid change status every few seconds,
  // so the change is visible without scrolling.
  // >>> START: function tickLive
  function tickLive() {
    var visibleCount = Math.min(ROWS.length, 20);
    for (var n = 0; n < 3; n++) {
      var row = ROWS[Math.floor(Math.random() * visibleCount)];
      row.status = STATUS_ORDER[(STATUS_ORDER.indexOf(row.status) + 1) % STATUS_ORDER.length];
    }
    if (grid) grid.refreshInfiniteCache();
  }
  // <<< END: function tickLive

  // >>> START: function setLive
  function setLive(on) {
    state.live = on;
    $("liveLabel").textContent = on ? "On" : "Off";
    $("liveToggle").checked = on;
    if (liveTimer) clearInterval(liveTimer);
    liveTimer = null;
    if (on) liveTimer = setInterval(tickLive, LIVE_INTERVAL_MS);
  }
  // <<< END: function setLive

  // >>> START: function renderSummary
  function renderSummary() {
    renderStepper();
    renderGauge();
    renderStageFilters();
    updateFoot();
  }
  // <<< END: function renderSummary

  // <<< END: Summary page: AG Grid (infinite row model)
  // >>> START: Routing and events
  // ---------- Routing and events ----------

  // >>> START: function route
  function route() {
    var showSummary = window.location.hash.replace("#", "") === "summary";
    $("view-dashboard").hidden = showSummary;
    $("view-summary").hidden = !showSummary;
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("data-nav") === (showSummary ? "summary" : "dashboard"));
    });
    if (showSummary) {
      ensureGrid();
      if (grid && grid.sizeColumnsToFit) grid.sizeColumnsToFit();
    }
    window.scrollTo(0, 0);
  }
  // <<< END: function route

  // >>> START: function onClick
  function onClick(e) {
    if (state.dateOpen && !e.target.closest(".date-wrap")) setDatePickerOpen(false);
    if (state.filterOpen && !e.target.closest(".filter-wrap")) setFilterOpen(false);

    var target = e.target.closest("[data-action]");
    if (!target) return;
    var action = target.getAttribute("data-action");

    if (action === "toggle-date") {
      setDatePickerOpen(!state.dateOpen);
    } else if (action === "cal-prev") {
      state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() - 1, 1);
      renderCalendar();
    } else if (action === "cal-next") {
      state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() + 1, 1);
      renderCalendar();
    } else if (action === "pick-day") {
      selectDate(target.getAttribute("data-date"));
    } else if (action === "toggle-filter") {
      setFilterOpen(!state.filterOpen);
    } else if (action === "toggle-report") {
      var item = $("report-" + target.getAttribute("data-index"));
      var open = !item.classList.contains("is-open");
      item.classList.toggle("is-open", open);
      target.setAttribute("aria-expanded", String(open));
    } else if (action === "status-filter") {
      state.stage = target.getAttribute("data-status");
      renderStageFilters();
      refreshGridForStage();
    } else if (action === "view-all-reports" || action === "view-complete") {
      $("card-reports").scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (action === "asset-tab") {
      state.assetTab = Number(target.getAttribute("data-index")) || 0;
      target.parentElement.querySelectorAll(".tab").forEach(function (t) {
        var on = t === target;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
      });
      renderAssets();
      renderComplete();
    }
  }
  // <<< END: function onClick

  // >>> START: function onChange
  function onChange(e) {
    var box = e.target;
    if (box.id === "liveToggle") {
      setLive(box.checked);
      return;
    }
    var action = box.getAttribute("data-action");
    if (action === "filter-all") {
      FILTER_GROUPS.forEach(function (g) {
        g.forEach(function (name) { state.filterChecked[name] = box.checked; });
      });
    } else if (action === "filter-item") {
      state.filterChecked[box.getAttribute("data-name")] = box.checked;
    } else {
      return;
    }
    renderFilter();
  }
  // <<< END: function onChange

  // >>> START: function onMouseOver
  function onMouseOver(e) {
    var bar = e.target.closest("[data-trade]");
    if (!bar) return;
    var i = Number(bar.getAttribute("data-trade"));
    if (i === state.tradeIndex) return;
    state.tradeIndex = i;
    renderTrades();
  }
  // <<< END: function onMouseOver

  // >>> START: function init
  function init() {
    $("dateLabel").textContent = formatDate(state.selectedDate);
    renderFilter();
    renderPerformance();
    renderAssets();
    renderComplete();
    renderTrades();
    observeTrades();
    renderReports();
    renderSummary();
    setLive(state.live);

    document.addEventListener("click", onClick);
    document.addEventListener("change", onChange);
    document.addEventListener("mouseover", onMouseOver);
    window.addEventListener("hashchange", route);
    route();
  }
  // <<< END: function init

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  // <<< END: Routing and events
})();
