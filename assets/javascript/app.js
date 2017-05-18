var config = {
  apiKey: "AIzaSyCHnAX4seXIKlOgNKk87sjZsjfTgrFks6E",
  authDomain: "rps-multi-aa34c.firebaseapp.com",
  databaseURL: "https://rps-multi-aa34c.firebaseio.com",
  projectId: "rps-multi-aa34c",
  storageBucket: "rps-multi-aa34c.appspot.com",
  messagingSenderId: "609772832488"
};

firebase.initializeApp(config);

var database = firebase.database();

// var ref = database.ref("game/game1");

// var data = {
// 	name:"Fahad",
// 	Display: "test1"
// };

// ref.push(data);

var game = {
	instance: 0,
	gameName:"",
	player1: {
		name:"",
		choice:"",
		win: 0, 
		lose: 0,
		tie: 0,
	},
	player2: {
		name:"",
		choice:"",
		win: 0, 
		lose: 0,
		tie: 0,
	},

	creategame:function(){
		let gameNum = game.instance++;
		let newGame = Object.create(game);
		newGame.gameName = ("game"+ gameNum);

		let ref = database.ref("game/game"+gameNum);

		ref.push(newGame);
		this.getGameData();
	},

	getGameData: function(){
		let ref = database.ref("game");
		ref.on("value",this.outputData, this.errorData);
	},

	outputData: function(data){
		console.log(data.val());
	},

	error:function(error){
		console.log("error");
	}

}

game.creategame();

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
