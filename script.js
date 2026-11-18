(function () {
  "use strict";
  var KEY = "skillswap-v2";
  var defaults = {
    credits: 3,
    teach: [
      { n: "HTML & CSS basics", lv: "Advanced", av: "Weekday evenings", cat: "Tech" },
      { n: "Conversational Filipino", lv: "Fluent", av: "Weekends", cat: "Language" },
      { n: "Vegetable gardening", lv: "Beginner", av: "Flexible", cat: "Home & garden" }
    ],
    learn: ["Guitar", "Basic bike repair"],
    matches: [
      { who: "Ana Reyes", teaches: "Guitar", wants: "Web help", note: "Perfect two-way match", c: "" },
      { who: "Mark Dizon", teaches: "Bike repair", wants: "Gardening", note: "Perfect two-way match", c: "a2" },
      { who: "Liza Santos", teaches: "", wants: "Filipino lessons", note: "Pay with credits", c: "a3" }
    ],
    sessions: [
      { who: "Ana Reyes", skill: "Guitar", when: "Sat, 3:00 PM", st: "Confirmed" },
      { who: "Mark Dizon", skill: "Bike repair", when: "To be set", st: "Waiting" }
    ],
    works: [
      { t: "Portfolio website", by: "Ana Reyes", sk: "HTML & CSS basics", c: 5, g: "g0" },
      { t: "Raised garden bed", by: "Mark Dizon", sk: "Vegetable gardening", c: 3, g: "g1" },
      { t: "Guitar cover recording", by: "Liza Santos", sk: "Guitar", c: 8, g: "g2" }
    ]
  };
  var cats = [
    ["Tech", "Coding & web help", 12], ["Home", "Gardening & repairs", 9],
    ["Language", "Language lessons", 15], ["Creative", "Music, art & crafts", 7]
  ];
  var S;
  try { S = JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { S = null; }
  if (!S) S = JSON.parse(JSON.stringify(defaults));
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function initials(n) { return n.split(" ").map(function (p) { return p[0]; }).join("").slice(0, 2).toUpperCase(); }

  function render() {
    $("cats").innerHTML = cats.map(function (c, i) {
      return '<li class="card cat c' + (i + 1) + '"><span class="tag">' + c[0] + "</span><h3>" + c[1] + "</h3><p>" + c[2] + " members</p></li>";
    }).join("");

    $("teach").innerHTML = S.teach.map(function (s, i) {
      return '<li class="card"><div class="row"><h3>' + esc(s.n) + '</h3><span class="tag">' + esc(s.lv) + "</span></div><p>" +
        esc(s.cat) + " · " + esc(s.av) + '</p><div class="btns"><button class="btn alt sm" data-edit="' + i + '">Edit</button><button class="btn alt sm" data-del-teach="' + i + '">Remove</button></div></li>';
    }).join("") || '<li class="hint">Nothing here yet. Add a skill you can teach.</li>';

    $("learn").innerHTML = S.learn.map(function (s, i) {
      return '<li class="card"><div class="row"><h3>' + esc(s) + '</h3><span class="btns"><a class="btn alt sm" href="#swap">Find a teacher</a><button class="btn alt sm" data-del-learn="' + i + '">Remove</button></span></div></li>';
    }).join("") || '<li class="hint">Nothing here yet. Add a skill you want to learn.</li>';

    $("matches").innerHTML = S.matches.map(function (m, i) {
      return '<li class="card"><span class="avatar ' + m.c + '" aria-hidden="true">' + initials(m.who) + "</span><h3>" + esc(m.who) + "</h3><p>" +
        (m.teaches ? '<span class="tag">Teaches</span> ' + esc(m.teaches) + "<br>" : "") +
        '<span class="tag">Wants</span> ' + esc(m.wants) + '</p><p class="hint">' + esc(m.note) + '</p><button class="btn' + (m.teaches ? "" : " alt") + '" data-match="' + i + '">' + (m.teaches ? "Request swap" : "Offer to teach") + "</button></li>";
    }).join("");

    $("sessions").innerHTML = S.sessions.map(function (s) {
      return "<tr><td>" + esc(s.who) + "</td><td>" + esc(s.skill) + "</td><td>" + esc(s.when) + "</td><td><strong>" + esc(s.st) + "</strong></td></tr>";
    }).join("");

    $("gallery").innerHTML = S.works.map(function (w) {
      var img = w.img ? '<img class="thumb" src="' + w.img + '" alt="' + esc(w.alt || w.t) + '">' : '<div class="thumb ' + w.g + '" role="img" aria-label="Project cover for ' + esc(w.t) + '"></div>';
      return '<li class="card">' + img + "<h3>" + esc(w.t) + "</h3><p>By " + esc(w.by) + " · Skill: " + esc(w.sk) + '</p><p class="hint">' + w.c + ' comments</p><button class="btn alt sm" data-comment>View &amp; comment</button></li>';
    }).join("");

    $("ws").innerHTML = S.teach.map(function (s) { return "<option>" + esc(s.n) + "</option>"; }).join("") || "<option>General</option>";
    document.querySelectorAll(".cr").forEach(function (e) { e.textContent = S.credits; });
    $("meter").style.width = Math.min(100, S.credits * 13.3) + "%";
  }

  /* Routing */
  var ids = ["share", "skills", "swap", "works"];
  function show() {
    var h = (location.hash || "#share").slice(1);
    if (ids.indexOf(h) < 0) { if (h === "upload") h = "works"; else return; }
    ids.forEach(function (i) { $(i).hidden = i !== h; });
    document.querySelectorAll("nav a").forEach(function (a) {
      a.getAttribute("href") === "#" + h ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
    });
    document.title = document.querySelector("#" + h + " h1").textContent + " – SkillSwap";
    window.scrollTo(0, 0);
    $("nav").classList.remove("open"); menu.setAttribute("aria-expanded", "false");
  }
  var menu = document.querySelector(".menu-btn");
  menu.addEventListener("click", function () { var o = $("nav").classList.toggle("open"); menu.setAttribute("aria-expanded", o); });
  window.addEventListener("hashchange", show);

  /* Add skill */
  $("addform").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("sn").value.trim(); if (!name) return;
    if (document.querySelector('input[name=k]:checked').value === "teach") {
      S.teach.push({ n: name, lv: $("lv").value, av: $("av").value, cat: "Community" });
    } else { S.learn.push(name); }
    save(); render(); e.target.reset(); $("m1").textContent = "Added “" + name + "” to your list.";
  });
  document.addEventListener("click", function (e) {
    var t = e.target, d;
    if ((d = t.getAttribute("data-del-teach")) !== null && d !== undefined) { S.teach.splice(+d, 1); save(); render(); }
    else if ((d = t.getAttribute("data-del-learn")) !== null) { S.learn.splice(+d, 1); save(); render(); }
    else if ((d = t.getAttribute("data-edit")) !== null) {
      var s = S.teach[+d]; S.teach.splice(+d, 1); save(); render();
      document.querySelector('input[name=k][value=teach]').checked = true;
      $("sn").value = s.n; $("lv").value = s.lv; $("av").value = s.av; $("sn").focus();
      $("m1").textContent = "Update the details, then choose Add to my list.";
    } else if ((d = t.getAttribute("data-match")) !== null) {
      $("wh").value = S.matches[+d].who; $("wh").setAttribute("data-skill", S.matches[+d].teaches || S.matches[+d].wants);
      $("swapform").scrollIntoView({ behavior: "smooth" }); $("dt").focus();
    } else if (t.hasAttribute("data-comment")) { t.textContent = "Comments open soon"; t.disabled = true; }
  });

  /* Swap request */
  $("swapform").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!$("wh").value) { $("m2").textContent = "Choose a match above first."; return; }
    var dt = new Date($("dt").value);
    S.sessions.unshift({ who: $("wh").value, skill: $("wh").getAttribute("data-skill") || "Swap", when: dt.toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit", month: "short", day: "numeric" }), st: "Waiting" });
    save(); render(); $("m2").textContent = "Request sent to " + $("wh").value + ". Status: Waiting.";
    e.target.reset(); $("wh").removeAttribute("data-skill");
  });

  /* Share a work */
  $("workform").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = $("wf").files[0], w = { t: $("wt").value.trim(), by: "You", sk: $("ws").value, c: 0, g: "g0", alt: $("wa").value };
    function done() { S.works.unshift(w); save(); render(); $("m3").textContent = "Shared “" + w.t + "” with the community."; e.target.reset(); }
    if (f && f.size < 800000) { var r = new FileReader(); r.onload = function () { w.img = r.result; done(); }; r.readAsDataURL(f); }
    else { if (f) $("m3").textContent = "Image is over 800 KB, so a cover color is used instead. "; done(); }
  });
  $("newwork").addEventListener("click", function (e) { e.preventDefault(); $("upload").scrollIntoView({ behavior: "smooth" }); $("wt").focus(); });

  render(); show();
})();
