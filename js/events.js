// events.js - event data and the crowd functions
// This array is used by every page for now.
// Later it can be replaced with data from php/get_events.php
// (field names match the events table; registered = number of registrations)

var eventsData = [
  {
    id: 1,
    name: "TechFest 2026",
    category: "Technical",
    date: "2026-11-15",
    time: "10:00 AM",
    venue: "Main Auditorium",
    capacity: 300,
    registered: 247,
    description: "Yearly technical fest with coding contests, project exhibition and talks by guest speakers.",
    instructions: "Carry your college ID card. Laptops are allowed only in the coding contest hall."
  },
  {
    id: 2,
    name: "Cultural Night 2026",
    category: "Cultural",
    date: "2026-12-05",
    time: "06:00 PM",
    venue: "Open Air Theatre",
    capacity: 500,
    registered: 470,
    description: "An evening of music, dance and drama performances by students of all departments.",
    instructions: "Enter only through the assigned gates and keep the aisles clear."
  },
  {
    id: 3,
    name: "Sports Meet 2026",
    category: "Sports",
    date: "2026-11-28",
    time: "08:00 AM",
    venue: "College Ground",
    capacity: 200,
    registered: 200,
    description: "Inter-department sports meet with cricket, football, kabaddi and athletics.",
    instructions: "Wear sports shoes, carry a water bottle and report to your department captain."
  },
  {
    id: 4,
    name: "Web Development Workshop",
    category: "Workshop",
    date: "2026-10-25",
    time: "02:00 PM",
    venue: "Computer Lab 3",
    capacity: 60,
    registered: 25,
    description: "Hands-on workshop on HTML, CSS, JavaScript and PHP for beginners.",
    instructions: "Bring your own laptop if you can. Basic computer knowledge is enough."
  }
];

// percentage = registered / capacity * 100
function getPercentage(registered, capacity) {
  if (capacity <= 0) {
    return 0;
  }
  return Math.floor(registered / capacity * 100);
}

// 0-70 Normal, 71-90 Moderate, 91-99 High, 100 Full
function getStatus(registered, capacity) {
  var percent = getPercentage(registered, capacity);
  if (percent >= 100) {
    return "Full";
  } else if (percent >= 91) {
    return "High";
  } else if (percent >= 71) {
    return "Moderate";
  }
  return "Normal";
}

// "Moderate" -> "moderate" (used for css class names)
function getStatusClass(status) {
  return status.toLowerCase();
}

// message shown for each crowd level
function getAdvice(status) {
  if (status === "Normal") {
    return "Entry is running normally.";
  } else if (status === "Moderate") {
    return "Please follow the assigned entry route.";
  } else if (status === "High") {
    return "Please follow volunteer instructions and avoid unnecessary crowding.";
  }
  return "Registration is closed because the event has reached capacity.";
}

// find an event using its id
function findEvent(id) {
  for (var i = 0; i < eventsData.length; i++) {
    if (eventsData[i].id === id) {
      return eventsData[i];
    }
  }
  return null;
}
