const React = require('react');

export class Scoreboard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const team1Points = this.props.boardState.filter((item) => {
      return item.isRevealed === false && item.cardType === 'team1';
    }).length;
    const team2Points = this.props.boardState.filter((item) => {
      return item.isRevealed === false && item.cardType === 'team2';
    }).length;
    return (
      <div className='scoreboard-container'>
        <div className='team1 score'>
          <div className='score-label'>TEAM 1</div>
          {team1Points == 0 ? 'Winner!' : team1Points}
        </div>
        <div className='team2 score'>
          <div className='score-label'>TEAM 2</div>
          {team2Points == 0 ? 'Winner!' : team2Points}
        </div>
      </div>
    );
  }
}

module.exports = Scoreboard;
