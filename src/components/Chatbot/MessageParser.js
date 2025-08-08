class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    let actionHandled = false;
    console.log("Parsing message:", message);
    const flightTracker = ["track","flight","status","information","departure time","arrival time", 
      "aircraft type", "plane type", "aircraft model", "plane model","departure terminal","departure gate","gate","arrival terminal", "destination terminal",
      "baggage claim", "luggage claim", "baggage area", "luggage area"]
    const prediction = ["prediction","predicted","forecast","future","estimated","estimate","price", "delay"]
    const ticketSearch = ["how much", "ticket","ticket price","economy","premium economy","business","first class","search flights","search tickets", "price", "round trip", "buy", ]
    const weatherForecast = ["weather", "forecast", "temperature", "humidity", "rain", "rainy","raining","wind","windy","hot","cold","cooling","snowing","snow","warm","typhoon","season"]
    const membership = ["member","membership", "sign up", "register", "join", "premium", "upgrade account", "signup", "how to join", "how to sign up"];
    const about = ["what is predict2fly","what is Predict2fly","does predict2fly","does Predict2fly","can predict2fly","can Predict2fly","about us", "about predict2fly","about Predict2fly", "company information", "our story", "who we are", "our mission", "what we do", "company overview","about the company", "company details", "information about us", "company history", "our vision", "our team", "company background"];

    if (flightTracker.some(flightTrackerWord=> message.toLowerCase().includes(flightTrackerWord))){
      this.actionProvider.handleFlightTracker();
      actionHandled = true;
    }
    if (weatherForecast.some(weatherForecastWord=> message.toLowerCase().includes(weatherForecastWord))){
      this.actionProvider.handleWeatherForecast();
      actionHandled = true;
    }
    if (prediction.some(predictionWord=> message.toLowerCase().includes(predictionWord))){
      this.actionProvider.handlePrediction();
      actionHandled = true;
    }
    if (ticketSearch.some(ticketSearchWord=> message.toLowerCase().includes(ticketSearchWord))){
      this.actionProvider.handleTicketSearch();
      actionHandled = true;
    }
    if (membership.some(membershipWord=> message.toLowerCase().includes(membershipWord))){
      this.actionProvider.handleMembership();
      actionHandled = true;
    }
    if (about.some(aboutWord=> message.toLowerCase().includes(aboutWord))){
      this.actionProvider.handleAbout();
      actionHandled = true;
    }
    if (!actionHandled){
      this.actionProvider.handleElse();
    }
  }
}

export default MessageParser;
