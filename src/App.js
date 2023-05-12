import React, { Component } from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";

function randomName() {
  const adjectives = [
    "amused", "angry", "bitter", "misty", "silent", "empty", "dry", "dark",
    "happy", "icy", "delicate", "quiet", "tired", "cool", "sleepy", "better",
    "patient", "curious", "dull", "fierce", "wispy", "frantic", "grumpy",
    "graceful", "broken", "cold", "damp", "funny", "frosty", "fancy", "tall",
    "hungry", "lingering", "bold", "little", "glamorous", "muddy", "old", "jittery",
    "rough", "kind", "small", "sparkling", "lazy", "shy", "wandering",
    "withered", "wild", "odd", "young", "holy", "nutty", "obedient",
    "aged", "snowy", "proud", "floral", "restless", "divine", "polished",
    "ancient", "poor", "rich", "scary"
  ];
  const nouns = [
    "firefighter", "teacher", "doctor", "chef", "student", "nurse", "pilot", "lawyer",
    "mechanic", "engineer", "farmer", "baker", "butcher", "actor", "actress", "architect",
    "designer", "cleaner", "dentist", "electrician", "carpenter", "lecturer", "judge", "lifeguard",
    "hairdresser", "model", "politican", "scientist", "painter", "secretary", "photographer", "tailor",
    "vet", "waiter", "waitress", "driver", "soldier", "assistant", "translator",
    "journalist", "fisherman", "florist", "librarian", "gardener", "plumber", "agent",
    "postman", "policewoman", "optician", "pharmacist", "receptionist", "builder", "cashier",
    "developer", "economist", "coach", "singer", "professor", "salesperson", "musician", "nutritionist", "surgeon",
    "smoke", "star"
  ];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return adjective + noun;
}

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
      color: randomColor(),
    }
  }

  constructor() {
    super();
    this.drone = new window.Scaledrone("YFuX9TIDhc336ShQ", {
      data: this.state.member
    });
    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Welcome to chat</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input
          onSendMessage={this.onSendMessage}
        />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  }

}

export default App;