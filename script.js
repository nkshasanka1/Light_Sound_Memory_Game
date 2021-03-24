/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */
/*
   For the audio of the game, it will be in the js file
   Using the built-in JavaScript library called AudioContext
*/

// Global Variables

const clueHoldTime = 100; //how long to hold each clue's light/sound
const cluePauseTime = 200; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

var trackNumMis;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


var pattern = [getRandomInt(5),getRandomInt(5),getRandomInt(5),getRandomInt(5),getRandomInt(5),getRandomInt(5),getRandomInt(5),getRandomInt(5)] // array 
var progress = 0; // integer
var gamePlaying = false; //boolean
// var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var tonePlaying = false;

var guessCounter = 0; // keeping track of guesses


// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 600
}
// Functin to play the Tone by taking a button number and the length of time with the tone
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}




// Function to start the Tone
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}

// Function to Stop the Tone
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}
//Page Initialization
// Init Sound Synthesizer

var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0,context.currentTime);
o.connect(g);
o.start(0);

// Functions to lighting up button when the computer is playing back a clue

function lightButton(btn){
  document.getElementById("button" + btn).classList.add("lit");
}

function clearButton(btn){
   document.getElementById("button" + btn).classList.remove("lit");
}

// Function to Play a single clue
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}
// Function to Play Clue Sequence

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; // set delay to initial wait-time
  for(let i= 0; i <= progress; i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + " ms ");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

// Function to show welcome to the player from the Press this Button 

function goodMorning(){
  alert("Hello player. Welcome to the game !!");
  
}
// Function for the Start of the game

function startGame(){
  //initialize game variables
  trackNumMis = 3;
  progress = 0;
  gamePlaying = true;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden")
  playClueSequence();
}
// Function to Stop the Game

function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}
function guess(btn){
  console.log("user guessed: " + btn);

  if(!gamePlaying){
    return;
  }

  if(pattern[guessCounter] == btn){
    //Guess was correct!
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        //GAME OVER: WIN!
        winGame();
      }else{
        //Pattern correct. Add next segment
        progress++;
        playClueSequence();
      }
    }else{
      //so far so good... check the next guess
      guessCounter++;
    }
  }else{
    //Guess was incorrect
    //GAME OVER: LOSE!
    loseGame();
    
  }
}   

// Actions after the game

function winGame(){
  stopGame();
  alert("Game Over. You Won !!");
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

