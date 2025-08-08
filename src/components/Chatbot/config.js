import { createChatBotMessage } from 'react-chatbot-kit';
import OptionsWidget from './OptionsWidget';

const config = {
  botName: "FlyBot",
  initialMessages: [
    createChatBotMessage("Hello! I am FlyBot, your virtual assistant from Predict2fly.  How may I assist you today?", {
      widget: "options",
    }),
  ],
  widgets: [
    {
      widgetName: "options",
      widgetFunc: (props) => <OptionsWidget {...props} />,
      mapStateToProps: ["messages"],
    },
  ],
  customComponents: {
    // add any custom chat components
  },
  customStyles: {
    // add any custom chat styles
  },
};

export default config;