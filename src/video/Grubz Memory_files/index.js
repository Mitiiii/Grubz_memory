// GLOBAL VARIABLES
let clickable = true; // permet d'éviter plus tard le click sur une carte qui est en cours de retournement
//
let currentPairs = 0; // nombres de paires trouvées pour le moment
const maxPairs = 5; // nombres de paires dans le jeu à trouver
//
// gestion des choix de deux cartes
let cardSelected = 0; // nombre de carte sélectionnées (0, 1 ou 2 en l'occurence)
let $firstCard; // première carte
let firstCardVal; // nom de la première carte
let $secondCard; // deuxième carte
let secondCardVal; // nom de la seconde carte
//
// gestion du nombre de coup
let wincount = 0;

// FUNCTIONS
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

function checkResult($cardLeft, $cardRight, $winPopUp, $badPopUp, $winCounter, $audioWin, $audioLoose) {
	// fonction pour voir si les deux cartes sélectionnées sont les même
	console.log("checking results");
	//
	wincount++; // on incrémente le nombre de coup
	$winCounter.textContent = wincount;
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
			if (currentPairs == maxPairs) {
				// si on a trouvé toutes les paires
				// toutes les cartes ont été trouvées
				console.log("big winner !");
				// on affiche le pop up
				$winPopUp.classList.remove("hidden");
			}
		} else {
			// erreur
			console.log("fail");
			//
			$audioLoose.currentTime = 0;
			$audioLoose.play(); // on joue le son
			
			//

			//m
			$badPopUp.querySelector('video').currentTime = 0;
			$badPopUp.classList.remove("hidden");
			setTimeout(() => {
				$badPopUp.classList.add("hidden"); //changer le popup ou enlever tout court pceque chiant si ça apparaît à chaque mauvaise paire
			}, 800);
			//m

			$firstCard.classList.remove("returned"); // enlever une class à l'élément
			$secondCard.classList.remove("returned");
		}
		// revenir au début pour le choix suivant
		$cardLeft.textContent = "–";
		$cardRight.textContent = "–";
		cardSelected = 0;
		$firstCard = "";
		firstCardVal = "";
		$secondCard = "";
		secondCardVal = "";
		//
		clickable = true;
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
	const $audioWin = document.getElementById("son-gagner");
	const $audioLoose = document.getElementById("son-perdu");
	const $audioReload = document.getElementById("son-rejouer");

	//m
	const $audioBGM = document.getElementById("BGM");
	const $badPopUp = document.getElementById("bad");

	
	//m

	//
	// mélange des cartes au début de partie
	cardShuffle($cardsWrapper, $cards, $audioReload);
	//
	$cards.forEach(function ($card) {
		// pour toutes les cartes
		$card.addEventListener("click", function () {
			// à chaque carte, on détecte un clic
			// au click sur une carte
			console.log("click card");
			//
			$audioCard.currentTime = 0;
			$audioCard.play(); // on joue le son
			//
			if (cardSelected == 0) {
				// si c'est la première carte cliquée
				$card.classList.add("returned"); // on retourne la carte
				//
				cardSelected = 1;
				$firstCard = $card;
				firstCardVal = $card.dataset.name;
				//
				$cardLeft.textContent = firstCardVal;
			} else if (cardSelected == 1 && clickable == true) {
				// on clique sur la seconde carte
				$card.classList.add("returned"); // on retourne la carte
				//
				clickable = false;
				//
				cardSelected = 2;
				$secondCard = $card;
				secondCardVal = $card.dataset.name;
				//
				$cardRight.textContent = secondCardVal;

				// une fois les deux cartes choisies, on vérifie le résultat
				checkResult($cardLeft, $cardRight, $winPopUp, $badPopUp, $winCounter, $audioWin, $audioLoose);
			} else {
				console.log("nope");
			}
		});
	});

	// redémarrer le jeu
	const $reset = document.getElementById("reload");
	$reset.addEventListener("click", function () {
		// click sur le bouton de redémarrage
		console.log("click reload");
		//
		clickable = false;
		// reset des cartes
		$cards.forEach(function ($card) {
			$card.classList.remove("returned");
		});
		// remettre tout à zero
		currentPairs = 0;
		cardSelected = 0;
		$firstCard = "";
		firstCardVal = "";
		$secondCard = "";
		secondCardVal = "";
		wincount = 0;
		$winPopUp.classList.add("hidden");
		// mélange des cartes
		setTimeout(() => {
			cardShuffle($cardsWrapper, $cards, $audioReload);
			clickable = true;
		}, 800);
	});
});