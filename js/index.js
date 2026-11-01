// GLOBAL VARIABLES
let clickable = true; // permet d'éviter plus tard le click sur une carte qui est en cours de retournement
//
let currentPairs = 0; // nombres de paires trouvées pour le moment
const maxPairs = 8; // nombres de paires dans le jeu à trouver
//
// gestion des choix de deux cartes
let cardSelected = 0; // nombre de carte sélectionnées (0, 1 ou 2 en l'occurence)
let $firstCard; // première carte
let firstCardVal; // nom de la première carte
let $secondCard; // deuxième carte
let secondCardVal; // nom de la seconde carte
//
// gestion du nombre de coup
let wincount = 7;
let lives = 8;

let music = false;
let gamePaused = false;
let gameEnded = false;

let timer
let isRunning = false;
let seconds = 0;

// FUNCTIONS
//fonctions du timer
//code de la vidéo youtube suivante: https://www.youtube.com/watch?v=MqQzulOxbSE
const $montre = document.getElementById("montre");
function updateMontre(){
	hrs = String(Math.floor(seconds/3600)).padStart(2, "0");
	mins = String(Math.floor((seconds%3600)/60)).padStart(2, "0");
	secs = String(seconds%60).padStart(2, "0");
	$montre.textContent = `${mins}:${secs}`;
}
function startTimer(){
	if (!isRunning){
		timer = setInterval(() => {
			seconds++;
			updateMontre();
		}, 1000);
	}
	isRunning = true;
}
function pauseTimer() {
	clearInterval(timer);
	isRunning = false;	
}
function resetTimer() {
	clearInterval(timer);
	isRunning = false;
	seconds = 0;
	updateMontre();
}

function cardShuffle($cardsWrapper, $cards, $audioReload) {
	console.log("shuffling cards");
	//
	// mélanger $cards
	const $cardsArr = Array.from($cards);
	for (let i = $cardsArr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[$cardsArr[i], $cardsArr[j]] = [$cardsArr[j], $cardsArr[i]];
	}
	// après, remettre tout dans $cardWrapper
	$cardsArr.forEach(($card) => {
		$cardsWrapper.appendChild($card);
	});
	$audioReload.currentTime = 0;
	$audioReload.play();
}

function checkResult($cardLeft, $cardRight, $winPopUp, $loosePopUp, $winCounter, $pairs, $winMinutes, $winSecondes, $looseMinutes, $looseSecondes, $audioWin, $audioLoose, $audioVictory, $audioDefeat, $audioWinPop) {
	// fonction pour voir si les deux cartes sélectionnées sont les même
	console.log("checking results");
	//	
	setTimeout(() => {
		// set timeout : ne se lance qu'au bout d'un temps que l'on définit (700ms ici)
		if (firstCardVal == secondCardVal) {
			// si le nom de la première et de la deuxième carte sont les même
			// les deux cartes sont les même
			console.log("win");

			$audioWin.currentTime = 0;
			$audioWin.play(); // on joue le son
			//
			currentPairs++;

			const firstCard = $firstCard;
			const secondCard = $secondCard;
			firstCard.classList.add("pair");
			secondCard.classList.add("pair");
			setTimeout(() => {
				firstCard.classList.remove("pair");
				secondCard.classList.remove("pair");
			}, 150);
			
			if (currentPairs == maxPairs) {
				// si on a trouvé toutes les paires
				// toutes les cartes ont été trouvées
				pauseTimer();
				setTimeout(() => {
					$audioVictory.volume = 0.4;
					$audioVictory.currentTime = 0;
					$audioVictory.play();
				}, 200);
				setTimeout(() => {
					console.log("big winner !");
					// on affiche le pop up
					if (mins!="00") {
						$winMinutes.textContent = `${mins} min `;	
					}
					$winSecondes.textContent = `${secs} s `;
					$audioWinPop.volume = 0.3;
					$audioWinPop.currentTime = 0;
					$audioWinPop.play();
					$winPopUp.classList.remove("hidden");
				}, 1800);
				gameEnded = true;
			}

		} else {
			// erreur
			console.log("fail");
			//
			$audioLoose.currentTime = 0;
			$audioLoose.play(); // on joue le son
			//
			wincount--;
			$winCounter.textContent = `${wincount} croissant(s)`;

			lives--;
			const pv = document.getElementById("pv" + lives)
			pv.classList.add("hidden");
			for (let i = 0; i < 3; i++) {
				setTimeout(() => {
					pv.classList.remove("hidden");

					setTimeout(() => {
						pv.classList.add("hidden");
					}, 200);

				}, i * 400);
			}

			if (lives == 1) {
				pauseTimer();
				setTimeout(() => {
					$audioDefeat.currentTime = 0;
					$audioDefeat.play();
				}, 700);
				setTimeout(() => {
					console.log("big looser !");
					$pairs.textContent = `${currentPairs} pair(s) `;
					if (mins!="00") {
						$looseMinutes.textContent = `${mins} min `;	
					}
					$looseSecondes.textContent = `${secs} s`;
					$loosePopUp.classList.remove("hidden");
				}, 1500);
				gameEnded = true;
			}

			$firstCard.classList.remove("returned"); // enlever une class à l'élément
			$secondCard.classList.remove("returned");
		}
		// revenir au début pour le choix suivant
		$cardLeft.textContent = ". . . . . . . .";
		$cardRight.textContent = ". . . . . . . .";
		cardSelected = 0;
		$firstCard = "";
		firstCardVal = "";
		$secondCard = "";
		secondCardVal = "";
		//
		if (lives > 1) {
			clickable = true;
		}
	}, 700);
}

// DOM READY
document.addEventListener("DOMContentLoaded", function () {
	// la page HTML est entièrement chargée
	console.log("ready");
	//
	const $cardsWrapper = document.querySelector("main"); // l'élément qui contient les cartes
	const $cards = document.querySelectorAll(".card"); // les cartes
	const $cardLeft = document.getElementById("card-left"); // le texte de gauche
	const $cardRight = document.getElementById("card-right"); // le texte de droite
	const $winPopUp = document.getElementById("winpopup"); // la fenêtre quand on gagne
	const $winCounter = document.getElementById("wincounter"); // le compteur de coup
	//const $audioCard = document.querySelector("audio"); // l'élément audio
	const $audioCard = document.getElementById("son-retourner");
	const $audioFart = document.getElementById("son-pet");
	const $audioWin = document.getElementById("son-gagner");
	const $audioLoose = document.getElementById("son-perdu");
	const $audioReload = document.getElementById("son-rejouer");
	const $audioBtn = document.getElementById("son-boutons")
	const $audioVictory = document.getElementById("son-victoire");
	const $audioWinPop = document.getElementById("winpop");
	const $audioDefeat = document.getElementById("son-defaite");
	const $audioBGM = document.getElementById("BGM");
	//
	const $loosePopUp = document.getElementById("loosepopup");
	const $croissants = document.querySelectorAll(".croissant");
	const $pairs = document.getElementById("pairs");
	const mins = "";
	const secs = "";
	const $winMinutes = document.getElementById("winMins");
	const $winSecondes = document.getElementById("winSecs");
	const $looseMinutes = document.getElementById("looseMins");
	const $looseSecondes = document.getElementById("looseSecs");
	//
	const $startPopUp = document.getElementById("startpopup");
	const $playButton = document.getElementById("playButton");

	//
	const estTactile = window.matchMedia("(pointer: coarse)").matches;
	//


	$audioBGM.volume = 0.8;
	$playButton.addEventListener("click", async () => {
		if (estTactile && !document.fullscreenElement) {
        try {
            await document.documentElement.requestFullscreen();
        } catch (error) {
            console.log("Plein écran indisponible", error);
        }
    }
		$audioBtn.currentTime = 0;
		$audioBtn.play();
		$startPopUp.classList.add("hidden");
		if (!music) {
			$audioBGM.currentTime = 0;
			$audioBGM.play();
			music = true;
		}
		startTimer();
	});

	const $pausePopUp = document.getElementById("pausepopup");
	const $pauseButton = document.getElementById("pauseButton");
	$pauseButton.addEventListener("click", function () {
		$audioBtn.currentTime = 0;
		$audioBtn.play();
		if (!gamePaused && !gameEnded) {
			$pausePopUp.classList.remove("hidden");
			gamePaused = true;
			$pauseButton.src = "src/img/playBtn.png"
			pauseTimer();
		}
		else if(gameEnded){
			console.log("game ended");
		}
		else {
			$pausePopUp.classList.add("hidden");
			gamePaused = false;
			$pauseButton.src = "src/img/pauseBtn.png"
			startTimer();
		}
	});

	const $unpauseButton = document.getElementById("unpauseButton");
	$unpauseButton.addEventListener("click", function () {
			$audioBtn.currentTime = 0;
			$audioBtn.play();
			$pausePopUp.classList.add("hidden");
			gamePaused = false;
			$pauseButton.src = "src/img/pauseBtn.png"
			startTimer();
	});

	const $BGMbutton = document.getElementById("BGMbutton");
	$BGMbutton.addEventListener("click", function () {
		$audioBtn.currentTime = 0;
		$audioBtn.play();
		if (!music) {
			$audioBGM.currentTime = 0;
			$audioBGM.play();
			$BGMbutton.src = "src/img/musicBtn.png"
			music = true;
		}
		else {
			$audioBGM.pause();
			$BGMbutton.src = "src/img/musicOffBtn.png"
			music = false;
		}
	});

	// mélange des cartes au début de partie
	cardShuffle($cardsWrapper, $cards, $audioReload);
	//playBGM($audioLoose);
	//
	$cards.forEach(function ($card) {
		// pour toutes les cartes
		$card.addEventListener("click", function () {
			// à chaque carte, on détecte un clic
			// au click sur une carte
			console.log("click card");
			//
			//
			if (cardSelected == 0 && clickable == true) {
				// si c'est la première carte cliquée
				$card.classList.add("returned"); // on retourne la carte
				if ($card.dataset.name == "Farting Grubz" ) {
					$audioFart.currentTime = 0;
					$audioFart.play();
				} else {
					$audioCard.currentTime = 0;
					$audioCard.volume = 0.4;
					$audioCard.play();	
				}
				
				//
				cardSelected = 1;
				$firstCard = $card;
				firstCardVal = $card.dataset.name;
				//
				$cardLeft.textContent = firstCardVal;
			} else if (cardSelected == 1 && clickable == true) {
				// on clique sur la seconde carte
				$card.classList.add("returned"); // on retourne la carte
				if ($card.dataset.name == "Farting Grubz" ) {
					$audioFart.currentTime = 0;
					$audioFart.play();
				} else {
					$audioCard.currentTime = 0;
					$audioCard.play();	
				}
				//
				clickable = false;
				//
				cardSelected = 2;
				$secondCard = $card;
				secondCardVal = $card.dataset.name;
				//
				$cardRight.textContent = secondCardVal;

				// une fois les deux cartes choisies, on vérifie le résultat
				checkResult($cardLeft, $cardRight, $winPopUp, $loosePopUp, $winCounter, $pairs, $winMinutes, $winSecondes, $looseMinutes, $looseSecondes, $audioWin, $audioLoose, $audioVictory, $audioDefeat, $audioWinPop);
			} else {
				console.log("nope");
			}
		});
	});

	// redémarrer le jeu
	const $reset = document.getElementById("reload");
	$reset.addEventListener("click", function () {
		// click sur le bouton de redémarrage
		$audioBtn.currentTime = 0;
		$audioBtn.play();
		console.log("click reload");
		//
		clickable = false;
		// reset des cartes
		$cards.forEach(function ($card) {
			$card.classList.remove("returned");
			$card.classList.remove("hidden");
		});

		$croissants.forEach(function ($croissant) {
			$croissant.classList.remove("hidden");
		});

		// remettre tout à zero
		currentPairs = 0;
		cardSelected = 0;
		$firstCard = "";
		firstCardVal = "";
		$secondCard = "";
		secondCardVal = "";
		wincount = 7;
		lives = 8;
		$looseMinutes.textContent = "";
		$winMinutes.textContent = "";
		$winPopUp.classList.add("hidden");
		$loosePopUp.classList.add("hidden");
		$pausePopUp.classList.add("hidden");
		gamePaused = false;
		gameEnded = false;
		// mélange des cartes
		setTimeout(() => {
			cardShuffle($cardsWrapper, $cards, $audioReload);
			clickable = true;
			resetTimer();
			startTimer();
		}, 50);
	});
});