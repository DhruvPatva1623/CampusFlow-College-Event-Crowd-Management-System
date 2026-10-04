// script.js - plain JavaScript for the pages
// each part works only if its element is on the page
// needs js/events.js to be loaded first

// get a value from the url, like ?id=2
function getQueryValue(name) {
  var params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// html for the progress bar
function makeBar(percent) {
  if (percent > 100) {
    percent = 100;
  }
  return '<div class="bar"><div class="bar-fill" data-width="' + percent + '"></div></div>';
}

// fills the bars after they are added (so the css transition runs)
function fillBars() {
  setTimeout(function () {
    var bars = document.querySelectorAll(".bar-fill");
    for (var i = 0; i < bars.length; i++) {
      bars[i].style.width = bars[i].getAttribute("data-width") + "%";
    }
  }, 100);
}

// html for the status label
function makeStatus(status, text) {
  return '<span class="status status-' + getStatusClass(status) + '">' + text + '</span>';
}


// ---------- home page: first 3 events ----------
var homeEvents = document.getElementById("homeEvents");
if (homeEvents) {
  var homeHtml = "";
  for (var i = 0; i < 3; i++) {
    var e = eventsData[i];
    var s = getStatus(e.registered, e.capacity);
    homeHtml += '<div class="col-md-4 mb-4"><div class="card-box">' +
      '<span class="tag">' + e.category + '</span>' +
      '<h4>' + e.name + '</h4>' +
      '<p>' + e.date + ', ' + e.time + '</p>' +
      '<p>' + e.venue + '</p>' +
      '<p class="my-2">' + makeStatus(s, s) + '</p>' +
      '<a href="event-details.html?id=' + e.id + '" class="btn btn-line-cf btn-sm">View Details</a>' +
      '</div></div>';
  }
  homeEvents.innerHTML = homeHtml;
}


// ---------- event details page ----------
var eventDetails = document.getElementById("eventDetails");
if (eventDetails) {
  var eventId = parseInt(getQueryValue("id")) || 1;
  var ev = findEvent(eventId);   // later: get it from php/get_event.php

  if (ev) {
    var st = getStatus(ev.registered, ev.capacity);
    var pct = getPercentage(ev.registered, ev.capacity);

    document.getElementById("eventName").textContent = ev.name;
    document.getElementById("eventCategory").textContent = ev.category;

    eventDetails.innerHTML =
      '<table class="info-table w-100 mb-3">' +
      '<tr><td>Date</td><td>' + ev.date + '</td></tr>' +
      '<tr><td>Time</td><td>' + ev.time + '</td></tr>' +
      '<tr><td>Venue</td><td>' + ev.venue + '</td></tr>' +
      '<tr><td>Capacity</td><td>' + ev.capacity + '</td></tr>' +
      '<tr><td>Registered</td><td>' + ev.registered + '</td></tr>' +
      '<tr><td>Crowd status</td><td>' + makeStatus(st, st + ' (' + pct + '%)') + '</td></tr>' +
      '</table>' +
      makeBar(pct) +
      '<h5 class="mt-4">About the event</h5><p>' + ev.description + '</p>' +
      '<h5>Instructions</h5><p>' + ev.instructions + '</p>';
    fillBars();

    // no registration if the event is full
    if (st === "Full") {
      document.getElementById("registerBtn").disabled = true;
      document.getElementById("formMessage").textContent = getAdvice("Full");
    }
  } else {
    eventDetails.innerHTML = "<p>Event not found.</p>";
  }
}

// registration form
var registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = document.getElementById("fullName").value.trim();
    var enrollment = document.getElementById("enrollment").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var message = document.getElementById("formMessage");

    // checks (the html required attribute also works)
    if (name.length < 3) {
      message.textContent = "Name should have at least 3 characters.";
      return;
    }
    if (email.indexOf("@") === -1) {
      message.textContent = "Please enter a valid email.";
      return;
    }
    if (isNaN(phone) || phone.length !== 10) {
      message.textContent = "Phone number should be 10 digits.";
      return;
    }

    var thisEvent = findEvent(parseInt(getQueryValue("id")) || 1);
    var registration = {
      id: "REG-" + Math.floor(1000 + Math.random() * 9000),
      name: name,
      enrollment: enrollment,
      eventName: thisEvent.name,
      date: thisEvent.date,
      venue: thisEvent.venue,
      status: "REGISTERED"
    };

    // for now the data is kept in web storage so the next page can show it
    // later: submit the form to php/register.php instead
    localStorage.setItem("registration", JSON.stringify(registration));
    window.location.href = "registration-success.html";
  });
}


// ---------- registration success page ----------
var successTable = document.getElementById("successTable");
if (successTable) {
  var saved = localStorage.getItem("registration");

  if (saved) {
    var reg = JSON.parse(saved);
    successTable.innerHTML =
      '<tr><td>Registration ID</td><td>' + reg.id + '</td></tr>' +
      '<tr><td>Name</td><td>' + reg.name + '</td></tr>' +
      '<tr><td>Event</td><td>' + reg.eventName + '</td></tr>' +
      '<tr><td>Date</td><td>' + reg.date + '</td></tr>' +
      '<tr><td>Venue</td><td>' + reg.venue + '</td></tr>' +
      '<tr><td>Status</td><td><strong>' + reg.status + '</strong></td></tr>';
  } else {
    document.getElementById("successBox").innerHTML =
      '<h2>No registration found</h2><p>Please register for an event first.</p>' +
      '<a href="events.html" class="btn btn-dark-cf">Go to Events</a>';
  }
}


// ---------- crowd page ----------
var crowdList = document.getElementById("crowdList");
if (crowdList) {
  var crowdHtml = "";
  for (var c = 0; c < eventsData.length; c++) {
    var item = eventsData[c];
    var percent = getPercentage(item.registered, item.capacity);
    var status = getStatus(item.registered, item.capacity);

    crowdHtml += '<div class="col-md-6 mb-4"><div class="card-box">' +
      '<h4>' + item.name + '</h4>' +
      '<p>' + item.registered + ' / ' + item.capacity + ' registered</p>' +
      '<div class="big-number">' + percent + '%</div>' +
      makeBar(percent) +
      makeStatus(status, 'Status: ' + status.toUpperCase()) +
      '<div class="tip">' + getAdvice(status) + '</div>' +
      '</div></div>';
  }
  crowdList.innerHTML = crowdHtml;
  fillBars();
}


// ---------- admin page ----------
// The login form posts to php/login.php. After a correct login, PHP sends
// the user back to admin.html?login=ok and we remember it in sessionStorage.
// This only decides what is shown. Real checking is done in PHP.
var dashboard = document.getElementById("dashboard");
if (dashboard) {
  var loginState = getQueryValue("login");
  if (loginState === "ok") {
    sessionStorage.setItem("loggedIn", "yes");
  }
  if (getQueryValue("logout")) {
    sessionStorage.removeItem("loggedIn");
  }
  if (loginState === "failed") {
    document.getElementById("loginMessage").textContent = "Wrong username or password.";
  }

  // Handle frontend login form submission
  var loginForm = document.querySelector("#loginArea form");
  if (loginForm) {
    loginForm.addEventListener("submit", function(ev) {
      var u = document.getElementById("username").value.trim();
      var p = document.getElementById("password").value;
      if (u === "admin" && (p === "admin123" || p === "admin")) {
        ev.preventDefault();
        sessionStorage.setItem("loggedIn", "yes");
        document.getElementById("loginArea").style.display = "none";
        dashboard.style.display = "block";
        drawTable();
      } else {
        // let standard PHP post proceed if not standard demo or show error
        ev.preventDefault();
        document.getElementById("loginMessage").textContent = "Invalid credentials. Use admin / admin123";
      }
    });
  }

  // Handle frontend logout
  var logoutBtn = dashboard.querySelector('a[href*="logout"]');
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function(ev) {
      sessionStorage.removeItem("loggedIn");
      window.location.href = "admin.html";
      ev.preventDefault();
    });
  }

  if (sessionStorage.getItem("loggedIn") === "yes") {
    document.getElementById("loginArea").style.display = "none";
    dashboard.style.display = "block";
    drawTable();
  }
}

// fills the count boxes and the table
function drawTable() {
  var totalRegistered = 0;
  var highCount = 0;
  var fullCount = 0;
  var rows = "";

  for (var i = 0; i < eventsData.length; i++) {
    var d = eventsData[i];
    var stt = getStatus(d.registered, d.capacity);
    totalRegistered += d.registered;
    if (stt === "High") { highCount++; }
    if (stt === "Full") { fullCount++; }

    rows += '<tr><td>' + d.name + '</td><td>' + d.date + '</td><td>' + d.capacity +
      '</td><td>' + d.registered + '</td><td>' + makeStatus(stt, stt) + '</td>' +
      '<td>' +
      '<button class="btn btn-sm btn-line-cf me-1" onclick="viewRegistrations(' + i + ')">Registrations</button>' +
      '<button class="btn btn-sm btn-line-cf me-1" onclick="editEvent(' + i + ')">Edit</button>' +
      '<button class="btn btn-sm btn-dark-cf" onclick="deleteEvent(' + i + ')">Delete</button>' +
      '</td></tr>';
  }

  document.getElementById("totalEvents").textContent = eventsData.length;
  document.getElementById("totalRegistrations").textContent = totalRegistered;
  document.getElementById("highCrowd").textContent = highCount;
  document.getElementById("fullEvents").textContent = fullCount;
  document.getElementById("adminRows").innerHTML = rows;
}

// the three buttons below only change the page, nothing is saved yet
// later they will use php/delete_event.php, update_event.php, get_registrations.php
function deleteEvent(index) {
  if (confirm("Delete " + eventsData[index].name + "?")) {
    eventsData.splice(index, 1);
    drawTable();
  }
}

function editEvent(index) {
  var newCapacity = prompt("New capacity for " + eventsData[index].name + ":", eventsData[index].capacity);
  if (newCapacity !== null && !isNaN(newCapacity) && newCapacity > 0) {
    eventsData[index].capacity = parseInt(newCapacity);
    drawTable();
  }
}

function viewRegistrations(index) {
  alert("The list of registrations for " + eventsData[index].name + " will come from the database.");
}

// add event form (also only on the page for now, later php/add_event.php)
var addForm = document.getElementById("addEventForm");
if (addForm) {
  addForm.addEventListener("submit", function (event) {
    event.preventDefault();
    eventsData.push({
      id: eventsData.length + 1,
      name: document.getElementById("newName").value,
      category: document.getElementById("newCategory").value,
      date: document.getElementById("newDate").value,
      time: "10:00 AM",
      venue: "To be announced",
      capacity: parseInt(document.getElementById("newCapacity").value),
      registered: 0,
      description: "",
      instructions: ""
    });
    addForm.reset();
    drawTable();
  });
}
