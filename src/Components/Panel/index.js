import React, {Component} from 'react';
import PropTypes from 'proptypes';
import {api} from '../../consts';

class Panel extends Component {
  constructor(...args) {
    super(...args);
    this.onClick = this.onClick.bind(this);
  }

  makeRequest(endpoint, data) {
    return fetch(`${api}/${endpoint}`, {
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
  }

  onClick() {
    let input = this.textInput.value;
    if (input.length < 1) {
      alert("Not enough input");
      return;
    }
    let match = input.match(/{(\d+)-(\d+)}/);
    let urls;
    if (!match) {
      urls = [input]
    } else {
      let smallNum = parseInt(match[1], 10);
      let bigNum = parseInt(match[2], 10);
      urls = [];
      for (let i = smallNum; i <= bigNum; i++) {
        urls.push(input.replace(/{\d+-\d+}/, i))
      }
      // urls = ['http://shiroyukitranslations.com/ztj-chapter-130/', 'http://shiroyukitranslations.com/ztj-chapter-131/']
    }
    console.log(urls);
    this.makeRequest('pocket/add', {urls})
  }

  render() {
    return <div><input type="text" style={{maxWidth: "90%", maxHeight: "100%"}} ref={text => this.textInput = text}/>
      <button onClick={this.onClick}>Submit</button>
    </div>
  }
}

Panel.props = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default Panel;
