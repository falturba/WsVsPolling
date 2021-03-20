import React from 'react';

class Message extends React.Component {
  render() {
    return (
      <div className="message">
        <span style={{color: this.props.userNameColor}}>
            {this.props.userName + ':'}
        </span>
        <span>
            {this.props.text}
        </span>
        <span className="message-time">
          {
            ' ('
            + this.props.date.getHours()
            + ':'
            + this.props.date.getMinutes()
            + ':'
            + this.props.date.getSeconds()
            + ':'
            + this.props.date.getMilliseconds()
            + ')'
          }
        </span>
      </div>
    )
  }
}

export default Message;