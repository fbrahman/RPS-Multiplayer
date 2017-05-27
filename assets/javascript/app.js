// firbase configuration
var config = {
    apiKey: "AIzaSyCHnAX4seXIKlOgNKk87sjZsjfTgrFks6E",
    authDomain: "rps-multi-aa34c.firebaseapp.com",
    databaseURL: "https://rps-multi-aa34c.firebaseio.com",
    projectId: "rps-multi-aa34c",
    storageBucket: "rps-multi-aa34c.appspot.com",
    messagingSenderId: "609772832488"
};

// intializing firebase
firebase.initializeApp(config);

let database = firebase.database();
let userRef = database.ref("/users");
let gameRef = database.ref("/game");
let chatRef = database.ref("/chat");

// game script start

let playerName = "";

let userInfo = {
    name: "",
    uKey: "",
    role: "",
    cScore: 0,
    jScore: 0,
    tie: 0
};

let gameInfo = {
    creator: "",
    joiner: "",
    gKey: "",
}

$("#nameModal").modal({
    backdrop: "static",
    keyboard: true
});

$("#submitName").click(function() {
    playerName = $("#nameInput").val().trim();

    let playerInfo = {
        name: playerName,
        key: ""
    };

    let key = userRef.push(playerInfo).key;

    userRef.child(key).update({
        key: key
    });

    userInfo.name = playerName;
    userInfo.uKey = key;

    userRef.child(key).onDisconnect().remove();

    database.ref().on("value", function(snap) {
        if (!snap.child("game").exists()) {
            $("#createGameBtn").removeClass("disabled");
            // console.log("creator doesn't exist");
        } else if (userInfo.role === "") {
            $("#joinGameBtn").removeClass("disabled");
            // console.log("creator does exist");
            // console.log(snap.child("game").val());
            let pullGame = snap.child("game").val();
            let pullGameKeyArr = Object.keys(pullGame);
            let lastIndex = pullGameKeyArr.length - 1;
            let lastKey = pullGameKeyArr[lastIndex];
            let lastObj = pullGame[lastKey];

            // gameInfo.creator = lastObj.creator;
            gameInfo.gKey = lastObj.gKey;

            $("#createGameBtn").addClass("disabled");

            // console.log(gameInfo.creator,gameInfo.gKey);
        }
    })
});

function createGame() {
    $("#createGameBtn").click(function() {
        let game = {
            creator: playerName,
            gKey: "",
            state: 1
        };

        let key = gameRef.push(game).key;
        gameRef.child(key).update({
            gKey: key
        });

        gameInfo.creator = playerName;
        gameInfo.gKey = key;

        userRef.child(userInfo.uKey).update({
            role: "creator"
        })

        userInfo.role = "creator";

        $("#createGameBtn").addClass("disabled");
        $("#joinGameBtn").addClass("disabled");

        createGameBoard();
    });
}

function joinGame() {
    $("#joinGameBtn").click(function() {
        gameRef.child(gameInfo.gKey).update({
            joiner: playerName,
            state: 2
        })

        gameInfo.joiner = playerName;
        userRef.child(userInfo.uKey).update({
            role: "joiner"
        })

        userInfo.role = "joiner";

        $("#joinGameBtn").addClass("disabled");

        createGameBoard();
    });
}

userRef.on("child_removed", function(snap) {
    
	chatRef.remove();

    // chatRef.push().set({
    // 	name: "Alert",
    // 	message: "player disconnected"
    // });

    gameRef.child(gameInfo.gKey).remove();

    $("#leftPlayer").addClass("hidePlayer");
    $("#rightPlayer").addClass("hidePlayer");
    $("#score").addClass("hideScore");

    $("#creatorScoreNum").text(0);
    $("#joinerScoreNum").text(0);
    $("#tieScoreNum").text(0);


    startGame();

});

function startGame() {
    createGame();
    joinGame();

    $("#chatAreaName").empty();
    $("#chatAreaMessage").empty();
}

startGame();

function createGameBoard() {

    $("#createGameBtn").off("click");
    $("#joinGameBtn").off("click");

    gameRef.child(gameInfo.gKey).on("value", function(snap) {
        let state = snap.val().state;
        let p1 = snap.val().creator;
        let p2 = snap.val().joiner || "waiting for player";
        console.log(state);

        switch (state) {
            case 1:
                $("#leftPlayer").removeClass("hidePlayer");
                $("#cName").text(p1);
                break;
            case 2:
                $("#rightPlayer").removeClass("hidePlayer");
                $("#jName").text(p2);

                $("#leftPlayer").removeClass("hidePlayer");
                $("#cName").text(p1);

                $("#score").removeClass("hideScore");
                $("#cNameS").text(p1);
                $("#jNameS").text(p2);

                playerChoice();
            case 3:
                gameRef.child(gameInfo.gKey).off("value");
                break;
        }

    });
}

function playerChoice() {

    switch (userInfo.role) {
        case "creator":
            $(".lGameOption").off().click(function() {
                let pChoice = ($(this).attr("value"));
                gameRef.child(gameInfo.gKey).update({
                    creatorChoice: pChoice
                })
                winLose();
            });
        case "joiner":
            $(".rGameOption").off().click(function() {
                let jChoice = ($(this).attr("value"));
                gameRef.child(gameInfo.gKey).update({
                    joinerChoice: jChoice
                })
                winLose();
            });
    }
}

function scoreUpdate() {
    gameRef.child(gameInfo.gKey).on("value", function(snap) {
        let tScore = snap.val().tScore||0;
        let cScore = snap.val().cScore||0;
        let jScore = snap.val().jScore||0;

        console.log("scores function",tScore,cScore,jScore)

        $("#tieScoreNum").text(tScore);
        $("#creatorScoreNum").text(cScore);
        $("#joinerScoreNum").text(jScore);
    })
}

function winLose() {
    console.log("I'm in the winLose function!");
    gameRef.child(gameInfo.gKey).once("value", function(snap) {
        if (snap.child("creatorChoice").exists() && snap.child("joinerChoice").exists()) {
            let cChoice = snap.val().creatorChoice;
            let jChoice = snap.val().joinerChoice;
            let winState = (3 + cChoice - jChoice) % 3;
            let cScore = snap.val().cScore || 0;
            let jScore = snap.val().jScore || 0;
            let tScore = snap.val().tScore || 0;

            console.log("scores", cScore, jScore, tScore);

            console.log("inside if statement for winLose");

            scoreUpdate();

            switch (winState) {
                case 0:
                    console.log("it's a tie!");
                    tScore++;
                    gameRef.child(gameInfo.gKey).update({
                            tScore: tScore,
                            creatorChoice:null,
                            joinerChoice:null
                        })
                    break;
                case 1:
                    console.log("Creator win's");
                    cScore++;
                    gameRef.child(gameInfo.gKey).update({
                            cScore: cScore,
                            creatorChoice:null,
                            joinerChoice:null
                        })
                    break;
                case 2:
                    console.log("Joiner win's");
                    jScore++;
                    gameRef.child(gameInfo.gKey).update({
                            jScore: jScore,
                            creatorChoice:null,
                            joinerChoice:null
                        })
                    break;
            }
            // $(".lGameOption").off("click");
            // $(".rGameOption").off("click");
            gameRef.child(gameInfo.gKey).update({ state: 3 })
            console.log("I'm after the switch statment!")
        }
    })
}

function sendChat() {
    messageField = $("#chatMsg").val();

    chatRef.push().set({
        name: userInfo.name,
        message: messageField
    });

    $("#chatMsg").val("");
}

function addChatMessage(name, message) {
    $("#chatAreaName").append("<br>" + "<strong>" + name + ":</strong> ");
    $("#chatAreaMessage").append("<br>" + message);
}

chatRef.on("child_added", function(snap) {
    let message = snap.val();
    addChatMessage(message.name, message.message);
})

$("#chatBtn").click(sendChat);
