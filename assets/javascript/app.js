// var interval = setInterval

var config = {
    apiKey: "AIzaSyA39uKn8TY27zR762CFtjsKJ06iWF_6lus",
    authDomain: "test-6235c.firebaseapp.com",
    databaseURL: "https://test-6235c.firebaseio.com",
    projectId: "test-6235c",
    storageBucket: "test-6235c.appspot.com",
    messagingSenderId: "82161583929"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database().ref('/trains');
  
  class Train {
    constructor(name, dest, first, freq){
      this.name = name;
      this.dest = dest;
      this.first = first;
      this.freq = freq;
    }
  }
  
  $("#submit-bid").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();
  
    var name = $("#name").val();
    var dest = $("#dest").val();
    var first = $("#first").val();
    var freq = $("#freq").val();
  
    // Log the Bidder and Price (Even if not the highest)
    
  
      // Alert
      //alert("You are now the highest bidder.");
  
      // Save the new price in Firebase
      database.push().set(
        new Train(name, dest, first, freq)
      );
    
  });

database.on("child_added", function(snapshot) {

    var freq = parseInt(snapshot.val().freq);
    var first = snapshot.val().first;
    var todayStart = moment().set({'hour': first.substr(0, first.indexOf(':')), 
                                    'minute': first.substr(first.indexOf(':') + 1), 
                                    second: 0});
    var current = moment();
    var difference = Math.round(current.diff(todayStart,'minute', true));
    
    var minFromFirst;
    var next;

    if(difference < 0 ){
        next = todayStart;
    }
    else{
        minFromFirst = freq*((Math.floor(difference/freq))+1);
        next = todayStart.add(minFromFirst,'minute');
    }

    var timeUntilNext = Math.round(next.diff(moment(),'minute',true));

    var tr = $("<tr>").append($("<td>").text(snapshot.val().name))
                        .append($("<td>").text(snapshot.val().dest))
                        .append($("<td>").text(snapshot.val().freq))
                        .append($("<td>").text(next.format("LT")))
                        .append($("<td>").text(timeUntilNext))

    $("tbody").append(tr);
});

// function writeTable(snapshot){
//     var freq = parseInt(snapshot.val().freq);
//     var first = snapshot.val().first;
//     var todayStart = moment().set({'hour': first.substr(0, first.indexOf(':')), 
//                                     'minute': first.substr(first.indexOf(':') + 1), 
//                                     second: 0});
//     var current = moment();
//     var difference = Math.round(current.diff(todayStart,'minute', true));
    
//     var minFromFirst;
//     var next;

//     if(difference < 0 ){
//         next = todayStart;
//     }
//     else{
//         minFromFirst = freq*((Math.floor(difference/freq))+1);
//         next = todayStart.add(minFromFirst,'minute');
//     }

//     var timeUntilNext = Math.round(next.diff(moment(),'minute',true));

//     var tr = $("<tr>").append($("<td>").text(snapshot.val().name))
//                         .append($("<td>").text(snapshot.val().dest))
//                         .append($("<td>").text(snapshot.val().freq))
//                         .append($("<td>").text(next.format("LT")))
//                         .append($("<td>").text(timeUntilNext))

//     $("tbody").append(tr);
// }