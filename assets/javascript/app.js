

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

  setTimeout(function(){
    rewrite();
    var intervalID = setInterval(function(){
        rewrite();
    }, 60 * 1000);
}, moment().set({"second":0}).add(1,'minute').diff(moment(),"second",true) * 1000);

function rewrite(){
    $("tbody").empty();
    database.once("value", function(snapshot) {            
        for (var child in snapshot.val()) {
            writeTable(snapshot.val()[child]);
        }
        // writeTable(snapshot);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

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

    var todayStart = moment().set({'hour': first.substr(0, first.indexOf(':')), 
                                    'minute': first.substr(first.indexOf(':') + 1), 
                                    second: 0});
  
      database.push().set(
        new Train(name, dest, todayStart.format(), freq)
      );
    
  });

database.on("child_added", function(snapshot) {
    writeTable(snapshot.val());
});

function writeTable(val){
    var freq = parseInt(val.freq);
    var first = val.first;
    var todayStart = moment(val.first);
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

    var tr = $("<tr>").append($("<td>").text(val.name))
                        .append($("<td>").text(val.dest))
                        .append($("<td>").text(val.freq))
                        .append($("<td>").text(next.format("LT")))
                        .append($("<td>").text(timeUntilNext))

    $("tbody").append(tr);
}