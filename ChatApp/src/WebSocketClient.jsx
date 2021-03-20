import React from 'react';
import DockerNames from 'docker-names';

import Message from './Message';
import { parsePayload } from './payloadParserUtil';

let webSocket;

const MESSAGE_INPUT_ID = 'message-input';
const NAME_INPUT_ID = 'name-input';

class WebSocketClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isConnected: false, messages: [] }

    this.handleSendClick = this.handleSendClick.bind(this);
    this.handConnectClick = this.handConnectClick.bind(this);
  }

  componentDidMount() {
    const messageInput = document.getElementById(MESSAGE_INPUT_ID);
    messageInput.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('send-btn').click();
      }
    });
  }

  handleSendClick() {
    const input = document.getElementById(MESSAGE_INPUT_ID);
    if (input.value.trim().length) {
      webSocket.send(input.value);
    }
  
    input.value = '';
    input.focus();
  }

  handConnectClick() {
    const nameInput = document.getElementById(NAME_INPUT_ID);
    let name = nameInput.value;
    name = name ? name : DockerNames.getRandomName();
    webSocket = new WebSocket(`ws://${window.location.host}/name/${name}`, []);
    nameInput.value = name;

    webSocket.onopen = () => {
      this.setState({ isConnected: true });
      this.props.updateConnectionStatus(true);
      console.log('connection is open');
      const messageInput = document.getElementById(MESSAGE_INPUT_ID);
      messageInput.focus();
      const nameInput = document.getElementById(NAME_INPUT_ID);
      const userName = nameInput.value;
      this.props.updateUserName(userName);
    }

    webSocket.onclose = (event) => {
      this.setState({ isConnected: false });
      console.log('connection is close');
      if (event.code === 1003) {
        alert("Username is taken");
      }
    }

    webSocket.onmessage = (payload) => {
      const { userNameColor, userName, text, date } = parsePayload(payload.data);
      this.setState({
        messages: [...this.state.messages, { userNameColor, userName, text, date }]
      });
    }
  }

  render() {
    return (
      <>
          {
            this.state.messages.map((message, i) => {
              return <Message
                key={i}
                userNameColor={message.userNameColor}
                userName={message.userName}
                text={message.text}
                date={message.date}
              />
            })
        }
        <div className='controls'>
          <input
            id={MESSAGE_INPUT_ID}
            className={MESSAGE_INPUT_ID}
            autoComplete="off"
            disabled={!this.state.isConnected}
            maxLength={90}
          />
          <button
            id='send-btn' onClick={this.handleSendClick} disabled={!this.state.isConnected} >
            Send
          </button>
          <div className={NAME_INPUT_ID}>
            <span>Name: </span>
            <input id={NAME_INPUT_ID} autoComplete="off" disabled={this.state.isConnected} maxLength={30}/>
          </div>
          <button id='connect-btn' onClick={this.handConnectClick} disabled={this.state.isConnected} >
            Connect
          </button>
          {this.state.isConnected && (
            <span id='connected-span'>Connected</span> 
          )}
          {!this.state.isConnected && (
            <span id='disconnected-span'>Not Connected</span> 
          )}
        </div>
      </>
    )
  }
}

export default WebSocketClient;
