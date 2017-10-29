const React = require('react');

export class Card extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let className = 'word-item ' + this.props.cardType;
    if (this.props.isRevealed) {
      className += ' revealed';
    }
    if (this.props.isChecked) {
      className += ' checked';
    }
    return (
      <div
        className={className}
        onClick={this.props.revealCard}>
        {this.props.word}
      </div>
    );
  }
}

module.exports = Card;
