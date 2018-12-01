$(document).ready(function() {

    var database = firebase.database();
    var connectionsRef = database.ref("/connections");
    var messagesRef = database.ref("/messages");
    var gameSelection = database.ref("/selections");
    var usersLoggedIn= database.ref("/nofUsers");
    var connectedRef = database.ref(".info/connected");
    var intervalID;
    var userGuesses=[];
    
    
    var wins=0;
    var loss=0;
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
    //  console.log(con)

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
      console.log(intervalID)
        //"We are good to play"
       clearInterval(intervalID);
        $(".waiting-player").fadeOut();
        if(sessionStorage.getItem("nickname")){
          $(".chat").fadeIn();
        //       // $(".gamesession").removeClass("hide")
          $(".gamesession").fadeIn()
          $(".container-table").fadeIn();


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
      $(".container-table").fadeOut();

    }

  });

    $(".images-div").click(imgSeclection)

    function imgSeclection(event){

      gameSelection.once("value", function(nUsers){
      //   if (nUsers.numChildren()<2){
      //     //usersLoggedIn.push({name: sessionStorage.getItem("nickname")});
      //   }
      //   else(alert("We have the 2 users already. Please wait until they are done playing"))
       })

        database.ref("/selections/"+sessionStorage.getItem("nickname")).set({
            name: sessionStorage.getItem("nickname"),
            selection: event.target.id,
        });

    }

    gameSelection.on("value", function(selections) {
      if (selections.numChildren()==2){
      //  console.log("It has two selections")
        gameSelection.on("child_added", function(gamepicks) {
          userGuesses.push(gamepicks.val().selection)
          //checks()
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
      
      //  console.log("there is only one connection")
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
          con.set(sessionStorage.getItem("nickname"))
        }
        else if (nUsers.numChildren()==2){
          //user=usersLoggedIn.push({name: sessionStorage.getItem("nickname")});
          con.set(sessionStorage.getItem("nickname"))
          $(".waiting-player").fadeOut();
            $(".chat").fadeIn();
        //       // $(".gamesession").removeClass("hide")
          $(".gamesession").fadeIn()
          $(".container-table").fadeIn();

        }
        else(alert("We have the 2 users already. Please wait until they are done playing"))
      })
    })

    gameSelection.on("child_added", function (data){
      data.forEach(test)
      function test(data){console.log(data.val())}
    if ((userGuesses[0] === "rock") && (userGuesses[1] === "scissors")) {
        wins++;
        console.log(wins + " on Line 200")
      } else if ((userGuesses[0] === "rock") && (userGuesses[1] === "paper")) {
        loss++;
        console.log(loss + " on Line 203")

      } else if ((userGuesses[0] === "scissors") && (userGuesses[1] === "rock")) {
        loss++;
        console.log(loss + " on Line 207")

      } else if ((userGuesses[0] === "scissors") && (userGuesses[1] === "paper")) {
        wins++;
        console.log(wins + " on Line 211")

      } else if ((userGuesses[0] === "paper") && (userGuesses[1] === "rock")) {
        wins++;
        console.log(wins + " on Line 215")

      } else if ((userGuesses[0] === "paper") && (userGuesses[1] === "scissors")) {
        loss++;
        console.log(loss + " on Line 219")

      } else if (userGuesses[0] === userGuesses[1]) {
        ties++;
    //    console.log(wins + " on Line 223")

      }

      var resultTable= $("<table>")

      // var headingPl1=$("<th>")
      // headingPl1.text("You have Won")
      // $(".results-space").append(headingPl1)


      
      // $(".results-space").html("<p> User 1: "+user1Wins+ ". User 2 "+ user2Wins+". Ties: "+ties+"</p>");
    });
      var userRow=$("<tr>")
      
      var userName=$("<td>")
      userName.append(sessionStorage.getItem("nickname"))
      userRow.append(userName)

      var userWins=$("<td>")
      userWins.append(wins)
      userRow.append(userWins)


      var userLoss=$("<td>")
      userLoss.append(loss)
      userRow.append(userLoss)


      var userTies=$("<td>")
      userTies.append(ties)
      userRow.append(userTies)

      $("#tbody").append(userRow)

});