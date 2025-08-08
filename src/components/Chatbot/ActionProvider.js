class ActionProvider {
  constructor(
    createChatBotMessage,
    setStateFunc,
    createClientMessage,
    stateRef,
    createCustomMessageContent
  ) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef;
    this.createCustomMessageContent = createCustomMessageContent;
  }

  handleFlightTracker = () => {
    const message = this.createChatBotMessage('Please visit our FLIGHT TRACKER page to access real-time flight information such as Flight Status, Departure/Arrival Time and Airport Terminal/Gate.');
    this.setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
  handlePrediction = () => {
    const message = this.createChatBotMessage('Please visit our PREDICTION page to access flight prediction information such as ticket price prediction and delay risk.');
    this.setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
  handleTicketSearch = () => {
    const message = this.createChatBotMessage('Please visit our TICKET SEARCH page to search for flight tickets sourced from various flight booking companies.');
    this.setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
  handleWeatherForecast = () => {
    const message = this.createChatBotMessage('Please visit our WEATHER FORECAST page to check weather conditions of your travel destination.');
    this.setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
  handleMembership = () => {
    const message = this.createChatBotMessage('Please visit our MEMBERSHIP page to learn more about our membership options and benefits.');
    this.setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
  handleAbout = () => {
    const message = this.createChatBotMessage('Please visit our ABOUT page to learn more about Predict2fly and what we do.');
    this.setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };
  handleElse = () => {
    const message = this.createChatBotMessage("Sorry, I’m not able to process that request right now. Try providing more details or ask something different?");
    this.setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  };

  // more methods here
}

export default ActionProvider;
