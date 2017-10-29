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
        <div className={
          this.props.isChecked
          ? 'word-item-checkbox checked'
          : 'word-item-checkbox'
        }>
          <div className={'word-item-checkbox-check'}></div>
        </div>
      </div>
    );
  }
}

module.exports = Card;
