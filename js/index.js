let sessionLength = 25;
let breakLength = 5;
let currentMinute = "25";
let currentSecond = "00";
let isSession = true;
let isRunning = false;
let intervalId = 0;

// Handle the countdown of the session/break clock
const handleTimer = () => {
  let newIntervalId = setInterval(() => {
    // Reduce the second by 1
    currentSecond -= 1;
    // If the current second reaches below 0
    if (currentSecond < 0) {
      // Set the seconds to 59
      currentSecond = 59;
      // A minute has passed so reduce the minute by 1
      currentMinute -= 1;
      // However, if the minutes is below 0 (meaning that the timer has finished)
      if (currentMinute < 0) {
        // Play the beeping sound
        document.getElementById("beep").play();
        // Switch from Session to Break or vice versa
        isSession = !isSession;
        // The current second will not be 59 but instead be 0 since it is starting
        // from the beginning
        currentSecond = 0;
        // Set the current minute to the length of the Session or Break, depending on
        // what it is currently on now.
        currentMinute = isSession ? sessionLength : breakLength;
        changeStatus();
      }
    }
    // Display these updated values on the screen (update the clock)
    $("#time-left").text(
      `${currentMinute < 10 ? "0" : ""}${currentMinute}:${
        currentSecond < 10 ? "0" : ""
      }${currentSecond}`
    );
  }, 1000);
  intervalId = newIntervalId;
};

// Handle the changing of the session/break lengths when the user
// increments/decrements them.
const changeLength = (session, increment) => {
  /*
    PARAMETERS:
    - session (boolean): true if incrementing/decrementing the Session length, false if for
    the Break length

    = increment (boolean): true if incrementing (for either Session or Break length), false
    if decrementing
    */

  // If the Session length was changed
  if (session) {
    // If incremented
    if (increment) {
      if (sessionLength < 60) {
        // Increase the Session length by 1 minute, provided it does not exceed 60 minutes.
        sessionLength += 1;
      }
      // If decremented
    } else {
      if (sessionLength > 1) {
        // Decrease the Session length by 1 minute, provided it does not go below 1 minute.
        sessionLength -= 1;
      }
    }
    // Update the value on the screen to show the new Session length
    $("#session-length").text(sessionLength);
    // If the clock is showing the Session time
    if (isSession) {
      // Update the clock to the new value of the Session length
      currentMinute = `${sessionLength < 10 ? "0" : ""}${sessionLength}`;
      currentSecond = "00";
      $("#time-left").text(`${currentMinute}:${currentSecond}`);
    }
    // If the Break length was changed
  } else {
    // If incremented
    if (increment) {
      if (breakLength < 60) {
        // Increase the Break length by 1 minute, provided it does not exceed 60 minutes.
        breakLength += 1;
      }
      // If decremented
    } else {
      if (breakLength > 1) {
        // Decrease the Break length by 1 minute, provided it does not go below 1 minute.
        breakLength -= 1;
      }
    }
    // Update the value on the screen to show the new Break length
    $("#break-length").text(breakLength);
    // If the clock is showing the Break time
    if (!isSession) {
      // Update the clock to the new value of the Break length
      currentMinute = `${breakLength < 10 ? "0" : ""}${breakLength}`;
      currentSecond = "00";
      $("#time-left").text(`${currentMinute}:${currentSecond}`);
    }
  }
};

// A function that changes the properties of HTML elements based
// on what is happening.
const changeStatus = () => {
  // If the timer is running
  if (isRunning) {
    // Hide the panel containing the Session/Break lengths and
    // the buttons to increment/decrement them.
    $("#lengths-container").hide();
    // Enlarge the timer size
    $("#time-left").css("font-size", "4.5rem");
    $("#start_stop").text("STOP");
    // If the timer is not running
  } else {
    // Hide the panel containing the Session/Break lengths and
    // the buttons to increment/decrement them.
    $("#lengths-container").show();
    // Reset the timer size to its original size
    $("#time-left").css("font-size", "2.5rem");
    $("#start_stop").text("START");
  }
  // If the timer shown is the Session timer
  if (isSession) {
    $("#timer-label").text("SESSION");
    // If the timer shown is the Break timer
  } else {
    $("#timer-label").text("BREAK");
  }
};

// When the page first loads
$(document).ready(function () {
  // Show the Session and Break lengths on the screen
  $("#session-length").text(sessionLength);
  $("#break-length").text(breakLength);
  // Show the timer (which will be the Session length)
  $("#time-left").text(`${currentMinute}:${currentSecond}`);
  // When the button to start/stop the timer is pressed
  $("#start_stop").click(function () {
    isRunning = !isRunning;
    changeStatus();
    isRunning ? handleTimer() : clearInterval(intervalId);
  });
  // When the reset button is pressed
  $("#reset").click(function () {
    // Stop the alarm sound (if playing) and reset the sound
    let sound = document.getElementById("beep");
    sound.pause();
    sound.currentTime = 0;

    isRunning = false;
    changeStatus();
    clearInterval(intervalId);
    isSession = true;
    changeStatus();
    // Reset the Session and Break lengths to the default values, and have
    // this displayed on the screen.
    sessionLength = 25;
    $("#session-length").text(sessionLength);
    breakLength = 5;
    $("#break-length").text(breakLength);
    currentMinute = "25";
    currentSecond = "00";
    $("#time-left").text(`${currentMinute}:${currentSecond}`);
  });

  // Handle increments/decrements for the Session/Break lengths
  // based on their respective buttons.
  $("#session-increment").click(function () {
    if (!isRunning) {
      changeLength(true, true);
    }
  });
  $("#session-decrement").click(function () {
    if (!isRunning) {
      changeLength(true, false);
    }
  });
  $("#break-increment").click(function () {
    if (!isRunning) {
      changeLength(false, true);
    }
  });
  $("#break-decrement").click(function () {
    if (!isRunning) {
      changeLength(false, false);
    }
  });
});
