// ===================================================
//  Blood Connect - Donor & Receiver Dashboard JS
//  (same script.js is used by both pages)
// ===================================================

// Find out which page is open
const profileForm = document.getElementById("profileForm");          // donor page
const availabilityForm = document.getElementById("availabilityForm"); // donor page
const searchForm = document.getElementById("searchBloodForm");        // receiver page
const requestForm = document.getElementById("requestBloodForm");      // receiver page

const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];

// Request counter for Request IDs (REQ-1001, REQ-1002 ...)
let requestNumber = 1000;
let notificationAdded = false;

// Use our own error messages instead of the browser pop-ups
if (profileForm) { profileForm.noValidate = true; }
if (availabilityForm) { availabilityForm.noValidate = true; }
if (searchForm) { searchForm.noValidate = true; }
if (requestForm) { requestForm.noValidate = true; }


// ===================================================
//  DONOR PAGE
// ===================================================

// ---------- Save Profile ----------
if (profileForm) {
  profileForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors(profileForm);
    document.getElementById("profileMessage").innerHTML = "";

    let fullName = document.getElementById("fullName");
    let email = document.getElementById("email");
    let phone = document.getElementById("phone");
    let address = document.getElementById("address");
    let bloodGroup = document.getElementById("donorBloodGroup");

    let valid = true;

    // Full name
    if (fullName.value.trim() === "") {
      showError(fullName, "Full name is required.");
      valid = false;
    } else if (!/^[A-Za-z ]+$/.test(fullName.value.trim())) {
      showError(fullName, "Only letters and spaces are allowed.");
      valid = false;
    } else {
      showSuccess(fullName);
    }

    // Email
    if (email.value.trim() === "") {
      showError(email, "Email is required.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError(email, "Invalid email address.");
      valid = false;
    } else {
      showSuccess(email);
    }

    // Phone
    if (phone.value.trim() === "") {
      showError(phone, "Phone number is required.");
      valid = false;
    } else if (!/^01[0-9]{9}$/.test(phone.value.trim())) {
      showError(phone, "Phone number must start with 01 and contain 11 digits.");
      valid = false;
    } else {
      showSuccess(phone);
    }

    // Address (optional, but if written it must be at least 10 characters)
    if (address.value.trim() !== "" && address.value.trim().length < 10) {
      showError(address, "Address must be at least 10 characters.");
      valid = false;
    } else if (address.value.trim() !== "") {
      showSuccess(address);
    }

    // Success
    if (valid) {
      document.getElementById("donorWelcome").innerHTML =
        "Welcome, " + fullName.value.trim() + "! Thank you for saving lives.";
      document.getElementById("myBloodType").innerHTML = bloodGroup.value;
      showMessage("profileMessage", "Profile saved successfully.", false);
    }
  });
}

// ---------- Update Availability ----------
if (availabilityForm) {
  availabilityForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors(availabilityForm);
    document.getElementById("availabilityMessage").innerHTML = "";

    let preferredDate = document.getElementById("preferredDate");
    let timeSlot = document.getElementById("timeSlot");

    let valid = true;
    let chosenDate = null;

    // Preferred date
    if (preferredDate.value === "") {
      showError(preferredDate, "Please select a preferred date.");
      valid = false;
    } else {
      let parts = preferredDate.value.split("-");
      chosenDate = new Date(parts[0], parts[1] - 1, parts[2]);

      let today = new Date();
      today.setHours(0, 0, 0, 0);

      if (chosenDate < today) {
        showError(preferredDate, "Date cannot be in the past.");
        valid = false;
      } else {
        showSuccess(preferredDate);
      }
    }

    // Time slot (example: 10:00 AM)
    if (timeSlot.value.trim() === "") {
      showError(timeSlot, "Please enter a time slot.");
      valid = false;
    } else if (!/^(0?[1-9]|1[0-2]):[0-5][0-9] ?(AM|PM)$/i.test(timeSlot.value.trim())) {
      showError(timeSlot, "Use this format: 10:00 AM");
      valid = false;
    } else {
      showSuccess(timeSlot);
    }

    // Success
    if (valid) {
      let niceDate = months[chosenDate.getMonth()] + " " +
                     chosenDate.getDate() + ", " + chosenDate.getFullYear();
      let niceTime = timeSlot.value.trim().toUpperCase();

      document.getElementById("nextAppointment").innerHTML = niceDate;
      showMessage("availabilityMessage",
        "Availability updated for " + niceDate + " at " + niceTime + ".", false);

      addNotification("UPDATE",
        "You are available to donate on " + niceDate + " at " + niceTime + ".");
    }
  });
}

// ---------- Add a notification to the list ----------
function addNotification(title, text) {
  let list = document.getElementById("notificationList");

  // Remove the default placeholder message the first time
  if (!notificationAdded) {
    list.innerHTML = "";
    notificationAdded = true;
  }

  let box = document.createElement("div");
  box.className = "notification";
  box.innerHTML = "<strong>" + title + "</strong><p>" + text + "</p>";
  list.insertBefore(box, list.firstChild);   // newest on top
}


// ===================================================
//  RECEIVER PAGE
// ===================================================

// ---------- Search Blood Stock ----------
if (searchForm) {
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors(searchForm);

    let bloodGroup = document.getElementById("bloodGroup");
    let unitsNeeded = document.getElementById("unitsNeeded");
    let urgency = document.getElementById("urgencyLevel");

    let valid = true;

    // Units
    if (unitsNeeded.value === "") {
      showError(unitsNeeded, "Enter units needed.");
      valid = false;
    } else if (Number(unitsNeeded.value) < 1 || !Number.isInteger(Number(unitsNeeded.value))) {
      showError(unitsNeeded, "Minimum 1 unit.");
      valid = false;
    } else {
      showSuccess(unitsNeeded);
    }

    // Success - stock data will come from the database later
    if (valid) {
      document.getElementById("searchResultsTable").innerHTML =
        "<tr><td>" + bloodGroup.value + "</td>" +
        "<td>" + unitsNeeded.value + " unit(s) requested</td>" +
        "<td>Stock data will appear here once the database is connected (" +
        urgency.value + ")</td></tr>";
    }
  });
}

// ---------- Submit New Blood Request ----------
if (requestForm) {
  requestForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors(requestForm);
    document.getElementById("requestMessage").innerHTML = "";

    let bloodType = document.getElementById("requiredBloodType");
    let units = document.getElementById("requiredUnits");
    let hospital = document.getElementById("hospitalName");
    let reason = document.getElementById("reason");

    let valid = true;

    // Units
    if (units.value === "") {
      showError(units, "Please enter units required.");
      valid = false;
    } else if (Number(units.value) < 1 || !Number.isInteger(Number(units.value))) {
      showError(units, "Enter a valid quantity (minimum 1).");
      valid = false;
    } else {
      showSuccess(units);
    }

    // Hospital (optional, but if written it must be at least 3 characters)
    if (hospital.value.trim() !== "" && hospital.value.trim().length < 3) {
      showError(hospital, "Hospital name must be at least 3 characters.");
      valid = false;
    } else if (hospital.value.trim() !== "") {
      showSuccess(hospital);
    }

    // Reason (optional, maximum 200 characters)
    if (reason.value.trim().length > 200) {
      showError(reason, "Notes cannot be more than 200 characters.");
      valid = false;
    }

    // Success
    if (valid) {
      requestNumber++;
      let requestId = "REQ-" + requestNumber;

      let today = new Date();
      let niceDate = months[today.getMonth()].substring(0, 3) + " " +
                     today.getDate() + ", " + today.getFullYear();

      let table = document.getElementById("requestTable");

      // Remove the "No requests submitted yet." row the first time
      if (requestNumber === 1001) {
        table.innerHTML = "";
      }

      let row = document.createElement("tr");
      row.innerHTML =
        "<td>" + requestId + "</td>" +
        "<td>" + bloodType.value + "</td>" +
        "<td>" + units.value + "</td>" +
        "<td>" + niceDate + "</td>" +
        "<td>Pending Approval</td>";
      table.insertBefore(row, table.firstChild);   // newest on top

      // Update the counters (new request = active + pending)
      increaseCount("activeRequestsCount");
      increaseCount("pendingRequestsCount");

      showMessage("requestMessage",
        "Request " + requestId + " submitted successfully.", false);

      requestForm.reset();
      clearErrors(requestForm);
    }
  });
}

// ---------- Add 1 to a counter ----------
function increaseCount(id) {
  let box = document.getElementById(id);
  box.innerHTML = Number(box.innerHTML) + 1;
}


// ===================================================
//  LOGOUT (both pages)
// ===================================================
let donorLogout = document.getElementById("donorLogout");
let receiverLogout = document.getElementById("receiverLogout");

if (donorLogout) {
  donorLogout.addEventListener("click", logout);
}
if (receiverLogout) {
  receiverLogout.addEventListener("click", logout);
}

function logout(event) {
  event.preventDefault();
  if (confirm("Are you sure you want to logout?")) {
    window.location.href = "login.html";   // change to your group's login page name
  }
}


// ===================================================
//  Functions (same idea as the sample script)
// ===================================================

// Show error under an input
function showError(input, message) {
  input.classList.add("errorBorder");
  input.classList.remove("successBorder");

  let errorBox = document.getElementById(input.id + "Error");

  // The HTML has no error spaces, so create one the first time
  if (errorBox === null) {
    errorBox = document.createElement("small");
    errorBox.id = input.id + "Error";
    errorBox.className = "error";
    input.parentNode.appendChild(errorBox);
  }
  errorBox.innerHTML = message;
}

// Show success border
function showSuccess(input) {
  input.classList.remove("errorBorder");
  input.classList.add("successBorder");
}

// Clear all errors inside one form
function clearErrors(form) {
  let errors = form.querySelectorAll(".error");
  errors.forEach(function (item) {
    item.innerHTML = "";
  });

  let fields = form.querySelectorAll("input, select, textarea");
  fields.forEach(function (field) {
    field.classList.remove("errorBorder");
    field.classList.remove("successBorder");
  });
}
