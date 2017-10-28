const React = require('react');
const seedrandom = require('seedrandom');
const WordSet = require('../data/wordset.json');

const BOARD_SIZE = 25;

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seed: 'alan wu',
    }
  }

  _fetchBoard() {
    Math.seedrandom(this.state.seed);
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
    return board;
  }

  _renderBoard() {
    const words = this._fetchBoard();
    let rowSize = Math.sqrt(BOARD_SIZE);
    let wordElements = [];

    let rowIndex = 0;
    let row = [];
    let board = [];

    words.forEach((word, index) => {
      const wordElement = (
        <div
          className='word-item'
          key={'word-item-' + index}>
          {word}
        </div>
      );
      row.push(wordElement);
      if (rowIndex < rowSize - 1) {
        rowIndex++;
      } else {
        rowIndex = 0;
        const rowElement = (
          <div
            className='row-item'
            key={'row-item-'+index}>
            {row}
          </div>
        )
        board.push(rowElement);
        row = [];
      }
    });
    return board;
  }

  _regenerateKey(event) {
    event.preventDefault();
    const input = document.getElementById('key-input');
    this.setState({
      seed: input.value,
    });
  }

  render() {
    return (
      <div className='content-container'>
        <div className='key-input-container'>
          <div className='key-input-label'>Key:</div>
          <form>
            <input id='key-input' onSubmit={this._regenerateKey.bind(this, event)}/>
          </form>
          <div
            className='key-submit'
            onClick={this._regenerateKey.bind(this)}>
            Submit
          </div>
        </div>
        <div className='game-board'>
          {this._renderBoard()}
        </div>
      </div>
    );
  }
}

module.exports = App;
