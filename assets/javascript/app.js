$(document).ready(function() {

    var database = firebase.database();
    var connectionsRef = database.ref("/connections");
    var messagesRef = database.ref("/messages");
    var gameSelection = database.ref("/selections");
    var connectedRef = database.ref(".info/connected");
    var intervalID;
    var userGuesses=[];
    
    
    var user1Wins=0;
    var user2Wins=0;
    var ties=0;


    if (sessionStorage.getItem("nickname")){
      $(".signin").addClass("hide")
    }

    function setIntervaltoRun(){
      intervalID= setInterval(function(){ 
      $(".waiting-player").fadeOut()
      $(".waiting-player").fadeIn()

    }, 1500);
  }

    // When the client's connection state changes...
    connectedRef.on("value", function(snap) {

      // If they are connected..
      if (snap.val()) {

      // Add user to the connections list.
      var con = connectionsRef.push(true);

      // Remove user from the connection list when they disconnect.
      con.onDisconnect().remove();
  }
});

  connectionsRef.on("value", function(snap) {
    if (snap.numChildren()==2){
        //"We are good to play"
        clearInterval(intervalID);
        $(".waiting-player").fadeOut();
      //  $(".chat").removeClass("hide");
        $(".chat").fadeIn();
       // $(".gamesession").removeClass("hide")
        $(".gamesession").fadeIn()
    }
    else if (snap.numChildren()<=1){
      //"Messages to be deleted and Warning that one more user is needed is displayed
      setIntervaltoRun();
      messagesRef.remove()   
      $(".chat").fadeOut();
      $(".gamesession").fadeOut()
    }

  });

    $(".images-div").click(imgSeclection)

    function imgSeclection(event){
        gameSelection.push({
            name: sessionStorage.getItem("nickname"),
            selection: event.target.id,
        });

    }

    gameSelection.on("value", function(selections) {
      if (selections.numChildren()==2){
        console.log("It has two selections")
        gameSelection.on("child_added", function(gamepicks) {
          userGuesses.push(gamepicks.val().selection)
          checks()
        });

      }
      else if (selections.numChildren()==1){

        if (sessionStorage.getItem("nickname")==selections.node_.children_.root_.value.children_.root_.left.value.value_){
          //this is my selection!
          $(".myOwnSpace").removeClass("hide")
        }
        else{
          //This is the other person's selection 
          $(".otherPersonSpace").removeClass("hide")


        }
      
        console.log("there is only one connection")
      }
  
    });


   // console.log(window.visualViewport.height)


    $(".button-chat").click(function(event){
      event.preventDefault()

      messagesRef.push({
        name: sessionStorage.getItem("nickname"),
        msg: $("#chat-text").val(),
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    })

    messagesRef.on("child_added", function(msg) {
      //console.log(msg)
      var nick=$("<h4>")
      nick.text(msg.val().name+" says:")
      $(".chat-display").append(nick)

      var p= $("<p>")
     // p.append($("#chat-text").val())
      p.append(msg.val().msg)
      $(".chat-display").append(p)
    });

    $(".nick-submit").click(function(event){
      event.preventDefault()
      sessionStorage.setItem("nickname", $("#nick-text").val());
      $(".signin").fadeOut()
    })

function checks(){
    if ((userGuesses[0] === "rock") && (userGuesses[1] === "scissors")) {
        user1Wins++;
      } else if ((userGuesses[0] === "rock") && (userGuesses[1] === "paper")) {
        user2Wins++;
      } else if ((userGuesses[0] === "scissors") && (userGuesses[1] === "rock")) {
        user2Wins++;
      } else if ((userGuesses[0] === "scissors") && (userGuesses[1] === "paper")) {
        user1Wins++;
      } else if ((userGuesses[0] === "paper") && (userGuesses[1] === "rock")) {
        user1Wins++;
      } else if ((userGuesses[0] === "paper") && (userGuesses[1] === "scissors")) {
        user2Wins++;
      } else if (userGuesses[0] === userGuesses[1]) {
        ties++;
      }
      
      $(".results-space").html("<p> User 1: "+user1Wins+ ". User 2 "+ user2Wins+". Ties: "+ties+"</p>");
    }


});