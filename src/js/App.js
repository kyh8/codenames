const Board = require('./Board');
const React = require('react');
const Scoreboard = require('./Scoreboard');
const seedrandom = require('seedrandom');
const KeyInput = require('./KeyInput');
const WordSet = require('../data/wordset.json');

const BOARD_SIZE = 25;
export class App extends React.Component {
  constructor(props) {
    super(props);
    const randomWord = WordSet.default_set[
      Math.floor(Math.random() * WordSet.default_set.length)
    ];
    this.state = {
      seed: randomWord,
      isSpymaster: false,
      board: [],
      boardState: [],
    }
  }

  componentDidMount() {
    this._fetchBoard(this.state.seed);
  }

  _fetchBoard(seed) {
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
      const availableSlots = Object.keys(cardTypes).filter((card) => {
        return cardTypes[card] > 0;
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
      board: board,
      boardState: boardState,
    });
  }

  _regenerateKey(event) {
    event.preventDefault();
    const input = document.getElementById('key-input');
    const newSeed = input.value;
    if (newSeed.length == 0 || newSeed === this.state.seed) {
      return;
    }
    this._fetchBoard(newSeed);
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
  }

  _resetCards() {
    let boardState = this.state.boardState;
    for(let i = 0; i < boardState.length; i++) {
      boardState[i].isRevealed = false;
      boardState[i].isChecked = false;
    }
    this._updateBoardState(boardState);
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
            <KeyInput initialValue={this.state.seed} />
          </form>
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
