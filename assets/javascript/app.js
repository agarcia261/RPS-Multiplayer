$(document).ready(function() {

    var database = firebase.database();
    var connectionsRef = database.ref("/connections");
    var messagesRef = database.ref("/messages");
    var gameSelection = database.ref("/selections");
    var usersLoggedIn= database.ref("/nofUsers");
    var connectedRef = database.ref(".info/connected");
    var intervalID;
    var userGuesses=[];
    
    
    var user1Wins=0;
    var user2Wins=0;
    var ties=0;
    var con
    var user


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

      //console.log(snap.numChildren())

      // If they are connected..
      if (snap.val()) {



      // Add user to the connections list.
      con = connectionsRef.push(true);
      console.log(con)

      // Remove user from the connection list when they disconnect.
      con.onDisconnect().remove();
      //usersLoggedIn.remove(user);

      // if (result){usersLoggedIn.remove();
      // usersLoggedIn.push({name: sessionStorage.getItem("nickname")});
      // }

  }
});

  connectionsRef.on("value", function(snap) {
    if (snap.numChildren()==2){
        //"We are good to play"
        clearInterval(intervalID);
        $(".waiting-player").fadeOut();
        if(sessionStorage.getItem("nickname")){
          $(".chat").fadeIn();
        //       // $(".gamesession").removeClass("hide")
          $(".gamesession").fadeIn()

        }

        //console.log("testing " +snap.val())


        
       // console.log(snap.val())

        // usersLoggedIn.on("value", function(nUsers){
        //   if (nUsers.numChildren()==2){
        //     $(".chat").fadeIn();
        //       // $(".gamesession").removeClass("hide")
        //     $(".gamesession").fadeIn()
        //   }
        // });
              //  $(".chat").removeClass("hide");

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

      gameSelection.once("value", function(nUsers){
        if (nUsers.numChildren()<2){
          //usersLoggedIn.push({name: sessionStorage.getItem("nickname")});
        }
        else(alert("We have the 2 users already. Please wait until they are done playing"))
      })

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

    //*******/this section is when the user create it's nickname ********
    $(".nick-submit").click(function(event){

      event.preventDefault()
      sessionStorage.setItem("nickname", $("#nick-text").val());
      $(".signin").fadeOut()

      connectionsRef.once("value", function(nUsers){
        if (nUsers.numChildren()==1){
          //user=usersLoggedIn.push({name: sessionStorage.getItem("nickname")});
          con.update({name: sessionStorage.getItem("nickname")})
        }
        else if (nUsers.numChildren()==2){
          //user=usersLoggedIn.push({name: sessionStorage.getItem("nickname")});
          con.update({name: sessionStorage.getItem("nickname")})
            $(".chat").fadeIn();
        //       // $(".gamesession").removeClass("hide")
          $(".gamesession").fadeIn()
        }
        else(alert("We have the 2 users already. Please wait until they are done playing"))
      })
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

      var resultTable= $("<table>")

      var headingPl1=$("<th>")
      headingPl1.text("You have Won")
      $(".results-space").append(headingPl1)

      var dataUser1=$("<td>")
      dataUser1.append(user1Wins)
      $(".results-space").append(dataUser1)

      var headingPl2=$("<th>")
      headingPl2.text("Your Opponent Won")
      $(".results-space").append(headingPl2)

      var dataUser2=$("<td>")
      dataUser2.append(user2Wins)
      $(".results-space").append(dataUser2)

      var headingTie=$("<th>")
      headingTie.text("Ties")
      $(".results-space").append(headingTie)

      var tieData=$("<td>")
      tieData.append(ties)
      $(".results-space").append(tieData)

      
      // $(".results-space").html("<p> User 1: "+user1Wins+ ". User 2 "+ user2Wins+". Ties: "+ties+"</p>");
    }


});