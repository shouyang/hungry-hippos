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
            As y'all probably know, the COVID19 crisis is hitting everyone hard, especially small businesses.
            A lot of restaurants/food services are switching to takeout/delivery only, or closing. It'd be
            pretty sick if we could support them, so I've started a crowdsourcing spreadsheet for all the
            Asian restaurants/businesses in Edmonton that are open for pickup or takeout 😁 that everyone can
            use, or contribute to. I'd be pretty sad if all my fav places were closed in 2 months, so pls help
            a girl out and try to prevent that from happening.
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
