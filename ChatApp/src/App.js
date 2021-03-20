import React from 'react';

import WebSocketClient from './WebSocketClient'
import HttpClient from './HttpClient';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isConnected: false, userName: ''}

    this.updateConnectionStatus = this.updateConnectionStatus.bind(this);
    this.updateUserName = this.updateUserName.bind(this);
  }

  componentDidMount() {
    var chatWindows = document.getElementsByClassName('chat-box');
    Array.prototype.forEach.call(chatWindows, function(chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    });
  }

  updateConnectionStatus(status) {
    this.setState({...this.state, isConnected: status});
  }

  updateUserName(userName) {
    this.setState({...this.state, userName })
  }

  render() {
    return (
      <>
        <div className='chat-box-container' >
          <div className='chat-box'>
            <p>WebSocket</p>
            <WebSocketClient
              updateConnectionStatus={this.updateConnectionStatus}
              updateUserName={this.updateUserName}
            />
          </div>
          <div className='chat-box'>
            <p>HTTP Polling</p>
            {this.state.isConnected && this.state.userName && (
              <HttpClient
                isConnected={this.state.isConnected}
                userName={this.state.userName}
              />
            )}
          </div>
        </div> 
      </>
    )
  }
}

export default App;
