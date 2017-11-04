const Board = require('./Board');
const React = require('react');
const Scoreboard = require('./Scoreboard');
const seedrandom = require('seedrandom');
const KeyInput = require('./KeyInput');
const WordSet = require('../data/wordset.json');
const firebase = require("firebase/app");
require('firebase/database')

const BOARD_SIZE = 25;
export class App extends React.Component {
  constructor(props) {
    super(props);

		// Initialize Firebase
		const config = {
			apiKey: "AIzaSyCQeMqbuxgauuHcM0o3tzoCZoW0kTR5KFU",
			authDomain: "codenames-b8t.firebaseapp.com",
			databaseURL: "https://codenames-b8t.firebaseio.com",
			projectId: "codenames-b8t",
			storageBucket: "codenames-b8t.appspot.com", messagingSenderId: "836284086712"
		};
    firebase.initializeApp(config);
    
    this.state = {
      seed: '',
      sessionKey: this._generateRandomSessionKey(),
      isSpymaster: false,
      board: [],
      boardState: [],
    }
    this._enterOrCreateSession(this.state.sessionKey);
  }

  componentDidMount() {
    this._fetchBoard(this.state.seed);
  }

  _enterOrCreateSession(sessionKey) {
    console.log('Attempting to create session with: ' + sessionKey);
    // Get session data or start a new session if necessary
    firebase.database().ref('sessions/' + sessionKey).once('value').then((snapshot) => {
      console.log('Returning from call');
      if (snapshot.val() == null) {
        console.log('Session doesnt exist');
        // Session does not exist
        const randomNum = Math.random();
        const randomWord = WordSet.default_set[
          Math.floor(randomNum * WordSet.default_set.length)
        ];
        this.setState({
          seed: randomWord,
          sessionKey: sessionKey,
        });
        this._fetchBoard(this.state.seed);
        firebase.database().ref('sessions/' + sessionKey).set({
          seed: this.state.seed,
          boardState: this.state.boardState,
        });
      } else {
        // Session exists
        console.log('Session exists');
        this.setState({
          seed: snapshot.val().seed,
          sessionKey: sessionKey,
        });
        this._fetchBoard(this.state.seed);
        this._updateBoardState(snapshot.val().boardState);
      }
      // Attaching a listener for the board state
      console.log('Attaching listener to: ' + this.state.boardState);
      this._getCurrentSessionRef('').on('value', (snapshot) => {
        if (snapshot.val() !== null) {
          if (snapshot.val().seed != this.state.seed) {
            console.log('Updating seed')
            console.log(snapshot.val().seed);
            console.log(this.state.seed);
            this._fetchBoard(snapshot.val().seed);
          }
          if (snapshot.val() != this.state.boardState) {
            console.log('Updating boardState')
            console.log(snapshot.val().boardState);
            console.log(this.state.boardState);
            this._updateBoardState(snapshot.val().boardState);
          }
        } else {
          console.log('Session does not exist yet, cannot listen to it:');
          console.log('Session ID: ' + sessionKey);
        }
      });
    });
  }

  _generateRandomSessionKey() {
    return Math.floor(Math.random() * 10000000);
  }

  _fetchBoard(seed) {
    console.log('Creating board with seed: ' + seed);
    Math.seedrandom(seed);
    const corpusSize = WordSet.default_set.length;
    let indices = [];
    for(let i = 0; i < corpusSize; i++) {
      indices.push(i);
    }
    let boardIndices = [];
    for(let i = 0; i < BOARD_SIZE; i++) {
      const randomNum = Math.random();
      const index = Math.floor(randomNum * indices.length);
      boardIndices.push(indices[index]);
      indices.splice(indices.indexOf(index), 1);
    }
    let board = [];
    boardIndices.forEach((index) => {
      board.push(WordSet.default_set[index]);
    });

    let boardState = [];
    const cardTypes = {
      'neutral': 7,
      'team1': 9,
      'team2': 8,
      'assassin': 1,
    }
    let availableSlots = [];
    for(let i = 0; i < board.length; i++) {
      const availableSlots = Object.keys(cardTypes).filter((card) => { return cardTypes[card] > 0;
      });
      const card = availableSlots[Math.floor(Math.random() * availableSlots.length)];
      cardTypes[card] = cardTypes[card] - 1;
      boardState[i] = {
        isRevealed: false,
        isChecked: false,
        cardType: card,
      }
    }
    this.setState({
      seed: seed,
      board: board,
      boardState: boardState,
    });
  }

  _regenerateKey(event) {
    console.log('button pressed');
    event.preventDefault();
    const input = document.getElementById('key-input');
    const newSeed = input.value;
    if (newSeed.length == 0 || newSeed === this.state.seed) {
      console.log('Using the same seed or an empty string!');
      return;
    }
    this._fetchBoard(newSeed);
    this._getCurrentSessionRef('seed').set(newSeed);
    this._resetCards();
  }

  _toggleSpymasterMode() {
    this.setState({
      isSpymaster: !this.state.isSpymaster,
    });
  }

  _updateBoardState(boardState) {
    this.setState({
      boardState: boardState,
    });
    this._getCurrentSessionRef('boardState').set(this.state.boardState);
  }

  _resetCards() {
    let boardState = this.state.boardState;
    for(let i = 0; i < boardState.length; i++) {
      boardState[i].isRevealed = false;
      boardState[i].isChecked = false;
    }
    console.log('emptied boardstate');
    this._updateBoardState(boardState);
  }

  _changeSessions(event) {
    event.preventDefault();
    const input = document.getElementById('session-input');
    const newKey = input.value;
    if (newKey.length == 0 || newKey == this.state.sessionKey) {
      console.log('Using the same session key or an empty string!');
      return;
    }
    this._enterOrCreateSession(input.value);
  }

  _getCurrentSessionRef(child) {
    return firebase.database().ref('sessions/' + this.state.sessionKey + '/' + child);
  }

  render() {
    return (
      <div className={
        this.state.isSpymaster
        ? 'content-container spymaster'
        : 'content-container'
      }>
        <Scoreboard boardState={this.state.boardState}/>
        <Board
          board={this.state.board}
          boardState={this.state.boardState}
          isSpymaster={this.state.isSpymaster}
          updateBoardState={this._updateBoardState.bind(this)}/>
        <div className='key-input-container'>
          <div className='key-input-label'>Board Key:</div>
          <form onSubmit={this._regenerateKey.bind(this)}>
            <KeyInput id={'key-input'} seed={this.state.seed} />
          </form>
          <div className='key-input-label'>Session Id:</div>
          <form>
            <KeyInput id={'session-input'} sessionKey={this.state.sessionKey} />
          </form>
          <div
            className='key-submit button'
            onClick={this._changeSessions.bind(this)}>
            Change Session
          </div>
          <div
            className='key-submit button'
            onClick={this._regenerateKey.bind(this)}>
            Submit
          </div>
          <div
            className='reset-button button'
            onClick={this._resetCards.bind(this)}>
            Reset
          </div>
        </div>
        <div className='buttons-container unselectable'>
          <div
            className='spymaster-toggle button'
            onClick={this._toggleSpymasterMode.bind(this)}>
            <i className={
              this.state.isSpymaster
              ? "fa fa-eye-slash"
              : "fa fa-eye"
            } aria-hidden="true"/>
            <div>
              {
                this.state.isSpymaster
                ? 'Viewer Mode'
                : 'Spymaster Mode'
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = App;
