const React = require('react');

export class Card extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        className={
          this.props.isRevealed
          ? 'word-item ' + this.props.cardType + ' revealed'
          : 'word-item ' + this.props.cardType
        }
        onClick={this.props.revealCard}>
        {this.props.word}
      </div>
    );
  }
}

module.exports = Card;
