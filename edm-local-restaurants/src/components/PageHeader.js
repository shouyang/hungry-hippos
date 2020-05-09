import React from "react";

import { Accordion, Icon } from "semantic-ui-react";

class PageHeader extends React.Component {
  state = { activeIndex: 0 };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;

    return (
      <Accordion styled fluid>
        <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
          Welcome
          <Icon name="dropdown" />
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <p>Hello friends,</p>
          <p>
            Hello everyone! As you may know, the COVID19 crsis is hitting everyone hard, especially small businesses. A friend and I have put together a website listing many Asian restaurants in the Edmonton Area that still do delivery or pickups, because they have been hit particularly hard. This is not a comprehensive list of all Asian restarunts in Edmonton, so please feel free to use the Google sheet to submit more. 

            As the Alberta economy reopens in the coming months and after the COVID19 pandemic subsides, we hope this website will be a contineous way to share, support, and order from delicious Asian restaurants across Alberta.
          </p>
          <p>Click on the pins or on a row in the table to get started!</p>
        </Accordion.Content>
        <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
          About
          <Icon name="dropdown" />
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <p>
            You can drag the blue marker below to find nearby restaurants. You can also use the "My Location
            button" on compatible devices to go to your current location too!
          </p>
        </Accordion.Content>
      </Accordion>
    );
  }
}

export default PageHeader;
