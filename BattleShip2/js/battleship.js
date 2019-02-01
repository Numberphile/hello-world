var gameView = {
  messageCount: 0,

  // Display messages.
  displayMessage: function(message) {
    this.messageCount +=1;
    var messageArea = document.getElementById("messageArea");
    if (this.messageCount == 1) {
      messageArea.innerHTML = message;
    } else if (this.messageCount < 6) {
      // Add new message to existing list.
      messageArea.innerHTML += "<br>" + message;
    } else {
      // List is too long. Rewrite, omitting oldest entry.
      var messageArray = messageArea.innerHTML.split("<br>");
      messageArea.innerHTML = messageArray[1];
      for (var i = 2; i < messageArray.length; i++) {
        messageArea.innerHTML += "<br>" + messageArray[i];
      }
      messageArea.innerHTML += "<br>" + message;
    }

  },

  // Update "miss" position.
  displayMiss: function(location) {
    // Change the td element's class to "miss"
    var td = document.getElementById(location);
    td.setAttribute("class", "miss");
  },

  // Update "hit" positions.
  displayHit: function(location) {
    // Change the td element's class to "hit"
    var td = document.getElementById(location);
    td.setAttribute("class", "hit");
  },

  // Hide the input.
  hideInput: function() {
    var form = document.getElementById("form");
    form.setAttribute("class", "hidden");
  }

}

var gameModel = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,
  shipNames: ["USS North Carolina", "Bismarck", "HMS Centurion", "USS Colorado",
              "Kirishima", "Haruna", "USS Mississippi", "HMS Paris",
              "HMS Revenge", "Schlesein", "USS Virginia", "Yamato"],

  ships: [],

  fire: function(guess) {
    for (var i=0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if (index >= 0 && !ship.sunk) {
        // We have a hit on this ship.
        // Update hits array.
        ship.hits[index] = "hit";

        // Update the gameView.
        gameView.displayMessage("HIT!");
        gameView.displayHit(guess);

        // Test if the ship is sunk.
        if (this.isSunk(ship)) {
          gameView.displayMessage("You sunk the " + ship.name + "!");
          ship.sunk = true;
          this.shipsSunk++;
        }
        return true;
      } else {
        // We have a miss on this ship. Do nothing.
      }
    }
    // No ships were hit.
    gameView.displayMessage("Miss.");
    gameView.displayMiss(guess);
    return false;
  },

  isSunk: function(ship) {
    for (var i=0; i<this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        // Ship has at least one hit left.
        return false;
      }
    }
    // Ship is sunk!
    return true;
  },

  generateShipLocations: function() {
    var testShip;
    for (var i = 0; i < this.numShips; i++) {
      // Generate a random ship until there are no collisions.
      do {
        testShip = this.generateShip();
      } while (this.collision(testShip));
      this.ships[i] = testShip;
      gameView.displayMessage("Enemy ship detected: " + this.ships[i].name);
    }
  },

  generateShip: function() {
    var direction = Math.floor(Math.random() * 2); // 0 or 1.
    var row;
    var col;
    var newShip;
    var alpha = "ABCDEFG";
    if (direction === 1) {
      // Create horizontal ship locations.
      var rowStart= Math.floor(Math.random() * 7); // 0-6
      var colStart = Math.floor(Math.random() * 5); // 0-4
      row = [rowStart, rowStart, rowStart];
      col = [colStart, colStart + 1, colStart + 2];
    } else {
      // Create vertical ship locations.
      var colStart = Math.floor(Math.random() * 7); // 0-6
      var rowStart = Math.floor(Math.random() * 5);
      col = [colStart, colStart, colStart];
      row = [rowStart, rowStart + 1, rowStart + 2];
    }
    // Initialize newShip.
    newShip = {sunk: false, name: "", locations: ["", "", ""], hits: ["", "", ""]};
    // Create name.
    newShip.name = this.shipNames[Math.floor(Math.random() * this.shipNames.length)];
    // Populate locations.
    for (var i = 0; i < newShip.locations.length; i++) {
      newShip.locations[i] = alpha.charAt(col[i]) + row[i];
    }

    return newShip
  },

  collision: function(newShip) {
    var newLocations = newShip.locations;
    var oldLocations = [];
    var name = newShip.name;
    var oldNames = [];

    // Collect existing locations & names.
    for (var i=0; i < this.ships.length; i++) {
      oldLocations = oldLocations.concat(this.ships[i].locations);
      oldNames.push(this.ships[i].name);
    }
    console.log(oldLocations);

    // Check for location collision.
    for (var i=0; i<newLocations.length; i++) {
      var index = oldLocations.indexOf(newLocations[i]);
      if (index >= 0) {
        // Collision detected.
        return true;
      }
    }

    // Check for name collision.
    var index = oldNames.indexOf(name);
    if (index >= 0) {
      return true;
    }

    // No collision detected.
    return false;
  }
};

var gameController = {
  guesses: 0,
  gameRunning: true,

  processGuess: function(guess) {
    var location = this.parseGuess(guess);
    if (location && this.gameRunning) {
      // Parsed location was valid, game is still running.
      // Increment guesses & fire on location.
      this.guesses++;
      gameModel.fire(location);

      // Test for gameOver.
      if (gameModel.shipsSunk >= gameModel.numShips) {
        this.endGame();
      }
    }
  },

  parseGuess: function(input) {
    var letters = "ABCDEFGabcdefg";
    var nums = "0123456";
    var errMsg = "Input must be a letter and number in the form 'A2'";
    if (input == null || input.length !== 2) {
      gameView.displayMessage(errMsg);
      return null;
    }
    var letter = input.charAt(0);
    var num = input.charAt(1);

    if (letters.indexOf(letter) < 0 || nums.indexOf(num) < 0) {
      // Input is malformed.
      gameView.displayMessage(errMsg);
      return null;
    } else {
      // Input is properly formed. Create and return capitalized string.
      input = letter.toUpperCase() + num;
      return input;
    }
  },

  endGame: function() {
    var hits = gameModel.numShips * gameModel.shipLength;
    var accuracy = parseInt(hits * 100 / this.guesses);

    // Set gameRunning to false.
    this.gameRunning = false;

    // Hide input.
    gameView.hideInput();

    // Display endgame Messages.
    gameView.displayMessage("Game over! Press F5 for new game.");
    gameView.displayMessage("Shots: " + this.guesses);
    gameView.displayMessage("Hits: " + hits);
    gameView.displayMessage("Accuracy: " + accuracy + "%");
  }
};

function init() {
  // Generate ships.
  gameModel.generateShipLocations();

  // Assign reticle listeners.
  var tds = document.getElementsByTagName('td');
  for (var i=0; i < tds.length; i++) {
    tds[i].onmouseover = handleMouseIn;
    tds[i].onmouseout = handleMouseOut;
    tds[i].onclick = handleClick;
  }
  console.log("you have" + tds.length + " tds.");

  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
}

function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  gameController.processGuess(guess);

  // Reset form.
  guessInput.value = "";
}

function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

function handleMouseIn(eventObj) {
  var td = eventObj.target;
  if ((td.getAttribute('class') !== "miss") && (td.getAttribute('class') !== "hit")) {
    td.setAttribute("class", "target");
  }
}

function handleMouseOut(eventObj) {
  var td = eventObj.target;
  if (td.getAttribute('class') === "target") {
    td.removeAttribute("class");
  }
}

function handleClick(eventObj) {
  var td = eventObj.target;
  var id = td.id;
  td.removeAttribute("class");
  gameController.processGuess(id);
}

window.onload = init;
