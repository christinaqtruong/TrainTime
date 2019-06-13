// # TrainTime

// In this assignment, you'll create a train schedule application that incorporates Firebase to host arrival and departure data. Your app will retrieve and manipulate this information with Moment.js. This website will provide up-to-date information about various trains, namely their arrival times and how many minutes remain until they arrive at their station.

// - - -

// ### Setup

// * We'll leave that up to you -- however you like. Just make sure you're using Firebase to store data, GitHub to backup your project, and GitHub Pages to host your finished site.

// ### Instructions

// * Make sure that your app suits this basic spec:
  
//   * When adding trains, administrators should be able to submit the following:
    
//     * Train Name
    
//     * Destination 
    
//     * First Train Time -- in military time
    
//     * Frequency -- in minutes
  
//   * Code this app to calculate when the next train will arrive; this should be relative to the current time.
  
//   * Users from many different machines must be able to view same train times.



  var firebaseConfig = {
    apiKey: "AIzaSyAZyKAZAnO02W-qxUDh4ir1Gk32_nf4PMA",
    authDomain: "cqmtapi.firebaseapp.com",
    databaseURL: "https://cqmtapi.firebaseio.com",
    projectId: "cqmtapi",
    storageBucket: "cqmtapi.appspot.com",
    messagingSenderId: "284706410523",
    appId: "1:284706410523:web:2e1f040a2af21d4c"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();


  //Button for adding trains
  $('#add-train-btn').on('click', function(event){
      event.preventDefault();

      //grabs user input
      var trainName = $('#train-name-input').val().trim();
      var destination = $('#destination-input').val().trim();
      var firstTrain = $('#first-train-input').val().trim();
      var frequency = $('#frequency-input').val().trim();

      //initial time is pushed back a year to ensure it comes before current time
      var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
      console.log(firstTrainConverted);

      //current time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

      //difference between current time and first time
      var timeDiff = moment().diff(moment(firstTrainConverted), "minutes");
      console.log(timeDiff);

      //time remaining until train arrives based on frequency
      var tRemainder = timeDiff % frequency;
      console.log(tRemainder);

      //minutes left until train arrives
      var tLeft = frequency - tRemainder;
      console.log("Minutes left: " + tLeft);

      //time next train arrives
      var nextTrain = moment().add(tLeft, "minutes").format("MM");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));
    
      //creates local temporary object for the train data
      var newTrain = {
          trainName: trainName,
          destination: destination,
          firstTrain: firstTrain,
          frequency: frequency,
          tLeft: tLeft,
          nextTrain: nextTrain
      };    
      console.log(newTrain);

      //uploads train data to the database
      database.ref().push(newTrain);

      console.log(newTrain.trainName);
      console.log(newTrain.destination);
      console.log(newTrain.firstTrain);
      console.log(newTrain.frequency);
      console.log(newTrain.tLeft);
      console.log(newTrain.nextTrain);

      //clears all input boxes
      $('#train-name-input').val("");
      $('#destination-input').val("");
      $('#first-train-input').val("");
      $('#frequency-input').val("");

  });

  database.ref().on('child_added', function(childSnapshot){
      console.log(childSnapshot.val());

      //store everything in a variable
      var train = childSnapshot.val().trainName;
      var dest = childSnapshot.val().destination;
      var first = childSnapshot.val().firstTrain;
      var freq = childSnapshot.val().frequency;
      var left = childSnapshot.val().tLeft;
      var next = childSnapshot.val().nextTrain;

      console.log(train);
      console.log(dest);
      console.log(first);
      console.log(freq);
      console.log(left);
      console.log(next);

      //create new row for data
      var newRow = $("<tr>").append(
        $("<td>").text(train),
        $("<td>").text(dest),
        $("<td>").text(first),
        $("<td>").text(freq),
        $("<td>").text(left),
        $("<td>").text(next)
      );

      //append new row to table
      $("#train-table").append(newRow);

  });