const Card = require('./Card');
const React = require('react');

const BOARD_SIZE = 25;
export class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderBoard() {
    const words = this.props.board;
    let rowSize = Math.sqrt(BOARD_SIZE);
    let wordElements = [];

    let rowIndex = 0;
    let row = [];
    let board = [];

    words.forEach((word, index) => {
      const wordElement = (
        <Card
          key={'word-item-' + index}
          word={word}
          cardType={this.props.boardState[index].cardType}
          isRevealed={this.props.boardState[index].isRevealed}
          revealCard={this._revealCard.bind(this, index)}/>
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

  _revealCard(index) {
    if (this.props.isSpymaster) {
      return;
    }
    let boardState = this.props.boardState;
    boardState[index].isRevealed = true;
    this.props.updateBoardState(boardState);
  }

  render() {
    return (
      <div className='game-board unselectable'>
        {this._renderBoard()}
      </div>
    );
  }
}

module.exports = Board;
