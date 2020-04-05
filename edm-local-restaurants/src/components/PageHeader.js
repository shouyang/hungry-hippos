import React from 'react';

import { Message } from 'semantic-ui-react'

class PageHeader extends React.Component {
    render() {
      return (
        <Message>
          <Message.Header>Page Header</Message.Header>
          <p>
            Big Intro
          </p>
      </Message>
      )
    }
  }
  


export default PageHeader;