const React = require('react');

export class KeyInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seedInput: this.props.seed,
    }
  }

  _updateSeedInput() {
    const input = document.getElementById(this.props.id);
    this.setState({
      seedInput: input.value,
    });

  }
  render() {
    return (
      <input
        id={this.props.id}
        autoComplete="off"
        value={this.state.seedInput}
        onChange={this._updateSeedInput.bind(this)}/>
    );
  }
}

module.exports = KeyInput;
