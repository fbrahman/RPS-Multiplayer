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

// game script start

let playerName = "";

let userInfo  = {
	name:"",
	uKey:"",
	role:""
};

let gameInfo ={
	creator:"",
	joiner:"",
	gKey : "",
}

$("#nameModal").modal({
	backdrop:"static", 
	keyboard: true
});

$("#submitName").click(function(
	){
	playerName = $("#nameInput").val().trim();

	let playerInfo = {
		name:playerName,
		key:""
	};

	let key = userRef.push(playerInfo).key;

	userRef.child(key).update({
		key:key
	});

	userInfo.name = playerName;
	userInfo.uKey = key;

	userRef.child(key).onDisconnect().remove();

	database.ref().once("value", function(snap){
		if(!snap.child("game").exists()){
			$("#createGameBtn").removeClass("disabled");
			console.log("creator doesn't exist");
		}else{
			$("#joinGameBtn").removeClass("disabled");
			console.log("creator does exist");
			console.log(snap.child("game").val());
			let pullGame = snap.child("game").val();
			let pullGameKeyArr = Object.keys(pullGame);
			let lastIndex = pullGameKeyArr.length - 1;
			let lastKey = pullGameKeyArr[lastIndex];
			let lastObj = pullGame[lastKey];

			// gameInfo.creator = lastObj.creator;
			gameInfo.gKey = lastObj.gKey;

			console.log(gameInfo.creator,gameInfo.gKey);
		}
	})
});

$("#createGameBtn").click(function(){
	let game = {
		creator:playerName,
		gKey:"",
		state:1
	};

	let key = gameRef.push(game).key;
	gameRef.child(key).update({
		gKey:key
	});

	gameInfo.creator = playerName;
	gameInfo.gKey = key;

	userRef.child(userInfo.uKey).update({
		role:"creator"
	})

	userInfo.role = "creator";

	$("#createGameBtn").addClass("disabled");

	createGameBoard();
});

$("#joinGameBtn").click(function(){
	gameRef.child(gameInfo.gKey).update({
		joiner:playerName,
		state: 2
	})

	gameInfo.joiner = playerName;
	userRef.child(userInfo.uKey).update({
		role:"joiner"
	})

	userInfo.role = "joiner";

	$("#joinGameBtn").addClass("disabled");

	createGameBoard();
});

function createGameBoard(){
	
	gameRef.child(gameInfo.gKey).on("value",function(snap){
		let state = snap.val().state;
		let p1 = snap.val().creator;
		let p2 = snap.val().joiner||"waiting for player";
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

				playerChoice();
				break;
		}

	});

	// if (caller === "creator"){
	// 	console.log("creator called me - watiing for player");

	// } else if( caller = "joiner"){

	// gameRef.child(gameInfo.gKey).on("value",function(snap){ 
	// 	let p1 = snap.val().creator;
	// 	let p2 = snap.val().joiner;

	// 	$("#rightPlayer").removeClass("hidePlayer");
	// 	$("#jName").text(p2);

	// 	$("#leftPlayer").removeClass("hidePlayer");
	// 	$("#cName").text(p1);
	// })
	
	//}
}

function playerChoice(){

	if (userInfo.role === "creator"){
		$(".lGameOption").click(function(){
			let pChoice = ($(this).attr("value"));
			gameRef.child(gameInfo.gKey).update({
				creatorChoice:pChoice
			})
		})
	} else if (userInfo.role === "joiner") {
		$(".rGameOption").click(function(){
			let jChoice = ($(this).attr("value"));
			gameRef.child(gameInfo.gKey).update({
				joinerChoice:jChoice
			})
		})	
	}
}








// var databaseFB = {
// 	database: firebase.database(),

// 	connections: function (){
		
// 		let connectionsRef = databaseFB.database.ref("/connections");
// 		let connectedRef = databaseFB.database.ref(".info/connected");
		
// 		connectedRef.on("value", function(snap){
// 			if(snap.val()){
// 				let con = connectionsRef.push(true);
// 				con.onDisconnect().remove();
// 			}
// 		});
// 	},

// 	createGame: function(player1){

// 		let gameRef = databaseFB.database.ref("/games");

// 		gamePlayer.player1.name = player1;
// 		gamePlayer.state = 1;
// 		gamePlayer.currGameKey = gameRef.push(gamePlayer).key;

// 		console.log(gamePlayer.currGameKey);
// 	}, 

// 	joinGame: function(player2){

// 		let gameRef = databaseFB.database.ref("/games");
// 		let gameRefUpdate = gameRef.child(gamePlayer.currGameKey);

// 		gameRefUpdate.update(gamePlayer);
// 		gameRefUpdate.transaction(function(test){

// 			if(test.state === 1){

// 				gamePlayer.state = 2;
// 				test.state = gamePlayer.state;
// 				gamePlayer.player2.name = player2;
// 				test.player2.name = gamePlayer.player2.name;
// 			}
// 			return test;

// 		})
// 	}
// };

// var gamePlayer = {
// 	currGameKey: "",
// 	state: 0,
// 	player1: {
// 		name:"",
// 		choice:"",
// 		player1key:"",
// 		win: 0, 
// 		lose: 0,
// 		tie: 0,
// 	},
// 	player2: {
// 		name:"",
// 		choice:"",
// 		player2key:"",
// 		win: 0, 
// 		lose: 0,
// 		tie: 0,
// 	},
// };

// databaseFB.connections();

// $("#createGame").click(function(){
	
// 	let playerName = $("#playerName").val();

// 	if (gamePlayer.state === 0){
// 		databaseFB.createGame(playerName);
// 	} else if (gamePlayer.state === 1){
// 		databaseFB.joinGame(playerName);
// 	}

// });

// var test = "";

// databaseFB.database.ref().on("value", function(snapshot) {

// 	if (snapshot.child("games").exists()){
// 		let game = snapshot.val().games;
// 		test = game;

// 		console.log("inside the loop - games exists")

// 		// gamePlayer.currGameKey = game.currGameKey;
// 		// gamePlayer.state = game.state;
// 		// game.player1.name = game.player1.name;
// 	}
// });






// var rps = {
//     player1: {
//         name: "",
//         choice: "",
//         win: 0,
//         lose: 0
//     },
//     player2: {
//         name: "",
//         choice: "",
//         win: 0,
//         lose: 0
//     },
//     tie: 0,

//     winLose: function(choice1, choice2) {
//         if (choice1 === choice2) {
//             tie++;
//         } else if (choice1 === "p") {
//             if (choice2 === "r") {
//                 this.player1.win++;
//                 this.player2.lose++;
//             } else {
//                 this.player2.win++;
//                 this.player1.lose++;
//             }
//         } else if (choice1 === "r") {
//             if (choice2 === "s") {
//                 this.player1.win++;
//                 this.player2.lose++;
//             } else {
//                 this.player2.win++;
//                 this.player1.lose++;
//             }
//         } else if (choice1 === "s") {
//             if (choice2 === "p") {
//                 this.player1.win++;
//                 this.player2.lose++;
//             } else {
//                 this.player2.win++;
//                 this.player1.lose++;
//             }
//         }
//     },

//     player: function(name, choice, win, lose) {
//         this.name = name;
//         this.choice = choice;
//         this.win = win;
//         this.lose = lose;
//     }
// }
