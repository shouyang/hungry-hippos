import React from "react";

import { Accordion, Icon, Label } from "semantic-ui-react";

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
            As you may know, the COVID19 crsis is hitting everyone hard, especially small businesses. We've
            put together a website listing many Asian restaurants in the Edmonton Area that still do delivery
            or pickups, because they have been hit particularly hard. This is not a comprehensive list of all
            Asian restarunts in Edmonton, we've been tracking via Google Sheets. Please feel free to submit
            more below. As the Alberta economy reopens in the coming months and after the COVID19 pandemic
            subsides, we hope this website will be a contineous way to share, support, and order from
            delicious Asian restaurants across Alberta.
          </p>
          <p>Click on the pins or on a row in the table to get started!</p>

          <Label
            as="a"
            href="https://docs.google.com/spreadsheets/d/1YvbMUEEGha3hEQ6CDd0K1C4WVkAMmszbBRuRQ-ndxKU/edit?fbclid=IwAR0-PcTBQiVML5SDvJGDhYxiY3ya_gQOv8hQOKg4sX94gZpwvJW6hEnuLPE#gid=0"
          >
            Google Sheets
          </Label>
          <Label as="a" href="https://github.com/shouyang/hungry-hippos">
            Github
          </Label>
        </Accordion.Content>
      </Accordion>
    );
  }
}

export default PageHeader;
