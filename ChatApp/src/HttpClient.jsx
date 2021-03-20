import React from 'react';

import Message from './Message';
import { parsePayload } from './payloadParserUtil';

class HttpClient extends React.Component {

  constructor(props) {
    super(props);
    this.state = { messages: [] }
  }

  componentDidMount() {
    this.poll();
  }

  poll = async () => {
    let response = await fetch(`/messages/${this.props.userName}`);

    if (response.status !== 200) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.poll();
    } else {
      let payloads = await response.json();
      if (payloads.length > 0) {
        this.setState({ messages: this.state.messages.concat(payloads.map(payload => parsePayload(payload))) });
      }

      await this.poll();
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
      </>
    )
  }
}

export default HttpClient;