import React, {Component} from 'react';
import PropTypes from 'proptypes';
import {api} from '../../consts';

import './index.css';

const inputDescription = "Input URL you wish to add to pocket, or a range of urls with the range denoted by {100-200} for example https://gravitytales.com/Novel/way-of-choices/ztj-chapter-{522-523}";

class Panel extends Component {
  constructor(...args) {
    super(...args);
    this.state = {prediction: "", result: false};
    this.onClick = this.onClick.bind(this);
    this.inputChanged = this.inputChanged.bind(this);
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

  inputChanged() {
    const input = this.textInput.innerText;
    const urls = this.calculateURLs(input);
    if (urls.length > 1) {
      const first = urls[0];
      const last = urls[urls.length - 1];
      this.setState({prediction: `${first} - ${last}`});
    } else {
      this.setState({prediction: urls[0]})
    }
  }

  /**
   * Calculates array of urls from input string
   * @param {string} string
   * @returns {Array.<string>}
   */
  calculateURLs(string) {
    let match = string.match(/{(\d+)-(\d+)}/);
    let urls;
    if (!match) {
      urls = [string]
    } else {
      let smallNum = parseInt(match[1], 10);
      let bigNum = parseInt(match[2], 10);
      urls = [];
      for (let i = smallNum; i <= bigNum; i++) {
        urls.push(string.replace(/{\d+-\d+}/, i))
      }
    }
    return urls;
  }

  onClick() {
    const title = this.titleInput.value;
    const tags = this.tagInput.value;
    const urls = this.textInput.innerText;
    if (urls.length < 1) {
      alert("Not enough input");
      return;
    }
    const data = {urls};
    if (title) {
      data.title = title;
    }
    if (tags) {
      data.tags = tags;
    }
    this.makeRequest('pocket/add', data).then(result => {
      this.setState({result: result["action_results"]})
    })
  }

  render() {
    return <div className="panel-box">
      <div className="panel-box-input">
        title: <input type="text" ref={text => this.titleInput = text}/>
        <br/>
        tags: <input type="text" ref={text => this.tagInput = text}/>
        <br/>
        url:
        <div contentEditable={true} className="panel-input-element panel-url-input" onKeyUp={this.inputChanged}
             ref={text => this.textInput = text}/>
        <br/>
        {inputDescription}
      </div>
      <div className="panel-box-confirm">
        prediction: <span>{this.state.prediction}</span>
        <br/>
        <button onClick={this.onClick}>Submit</button>
      </div>
      <div className="panel-box-result">
        {Array.isArray(this.state.result) ? <div>
          Result:
          <table>
            <thead><tr><th>Title</th><th>Excerpt</th><th>URL</th></tr></thead>
            <tbody>
            {
              this.state.result.map(r => <tr key={r.item_id}>
                <td>{r.title}</td>
                <td>{r.excerpt}</td>
                <td>{r.resolved_url}</td>
              </tr>)
            }
            </tbody>
          </table>
        </div> : this.state.result}
      </div>
    </div>
  }
}

Panel.props = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default Panel;
