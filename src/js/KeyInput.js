const React = require('react');

export class KeyInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seedInput: this.props.initialValue,
    }
  }

  _updateSeedInput() {
    const input = document.getElementById('key-input');
    this.setState({
      seedInput: input.value,
    });
  }
  render() {
    return (
      <input
        id='key-input'
        autoComplete="off"
        value={this.state.seedInput}
        onChange={this._updateSeedInput.bind(this)}/>
    );
  }
}

module.exports = KeyInput;
