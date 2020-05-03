import React from "react";

import { Message } from "semantic-ui-react";

class PageHeader extends React.Component {
  render() {
    return (
      <Message size="tiny">
        <Message.Header>Page Header</Message.Header>
        <p>Hello friends,</p>
        <p>
          As y'all probably know, the COVID19 crisis is hitting everyone hard, especially small businesses. A
          lot of restaurants/food services are switching to takeout/delivery only, or closing. It'd be pretty
          sick if we could support them, so I've started a crowdsourcing spreadsheet for all the Asian
          restaurants/businesses in Edmonton that are open for pickup or takeout 😁 that everyone can use, or
          contribute to. I'd be pretty sad if all my fav places were closed in 2 months, so pls help a girl
          out and try to prevent that from happening.
        </p>
        <p>
          Right now it's only Asian restaurants because they have been the hardest-hit, but I'll expand to
          other restaurants/services if there's enough interest. After this Coronavirus crisis is over, I
          guess this will just become a master list of all the Asian restaurants in Edmonton, which isn't a
          bad thing to have either. I'll be ordering from Blue Quill Chinese Food because when I called to ask
          about their takeout policy, the owner told me a very elaborate story about how her delivery guy was
          drinking and broke his leg. She hired a new delivery guy, but he's apparently very slow, so pickups
          are preferred unless you're ok with waiting. Fortunately, I am, and that kind of humour is right up
          my alley. Anyways, thanks for listening to my TED talk. Share this with friends. Eat some good food.
          I'll keep y'all posted with updates.
        </p>
      </Message>
    );
  }
}

export default PageHeader;
