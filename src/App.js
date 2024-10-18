import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'jquery/dist/jquery.min.js';
import $ from 'jquery';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Mock data for contacts
      contacts: [
        { name: "Alice", lastMessage: "Let's meet tomorrow.", date: "Oct 16, 2024" },
        { name: "Bob", lastMessage: "See you soon!", date: "Oct 17, 2024" },
        { name: "Charlie", lastMessage: "Got the updates.", date: "Oct 15, 2024" }
      ],
      // Chat messages per contact
      chats: {
        Alice: [
          { sender: "Alice", message: "Hi, how are you doing?", time: "8:40 AM", senderImg: "https://png.pngtree.com/png-clipart/20210311/original/pngtree-number-36-golden-font-png-image_5985724.jpg" },
          { sender: "You", message: "I'm doing great, thanks for asking!", time: "8:45 AM", senderImg: "https://therichpost.com/wp-content/uploads/2020/06/avatar2.png" }
        ],
        Bob: [
          { sender: "Bob", message: "Hey! What's up?", time: "9:00 AM", senderImg: "https://example.com/bob_img.png" },
          { sender: "You", message: "Not much, just working on a project.", time: "9:05 AM", senderImg: "https://therichpost.com/wp-content/uploads/2020/06/avatar2.png" }
        ],
        Charlie: [
          { sender: "Charlie", message: "Did you finish the task?", time: "10:00 AM", senderImg: "https://example.com/charlie_img.png" },
          { sender: "You", message: "Yes, just sent it over.", time: "10:05 AM", senderImg: "https://therichpost.com/wp-content/uploads/2020/06/avatar2.png" }
        ]
      },
      // Track selected contact
      selectedContact: "Alice",
      // Input for new message
      newMessage: ""
    };
  }

  componentDidMount() {
    $('#action_menu_btn').click(function () {
      $('.action_menu').toggle();
    });
  }

  handleContactClick(contactName) {
    this.setState({ selectedContact: contactName });
  }

  handleInputChange = (e) => {
    this.setState({ newMessage: e.target.value });
  };

  handleSendMessage = () => {
    const { selectedContact, newMessage, chats } = this.state;

    if (newMessage.trim() === "") return; // Don't send empty messages

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add the new message to the chat of the selected contact
    const updatedChats = {
      ...chats,
      [selectedContact]: [
        ...chats[selectedContact],
        { sender: "You", message: newMessage, time: currentTime, senderImg: "https://therichpost.com/wp-content/uploads/2020/06/avatar2.png" }
      ]
    };

    // Update the chats and clear the input field
    this.setState({
      chats: updatedChats,
      newMessage: ""
    });
  };

  render() {
    const { contacts, chats, selectedContact, newMessage } = this.state;
    const selectedMessages = chats[selectedContact] || [];

    return (
      <div className="maincontainer">
        <div className="container-fluid h-50">
          <div className="row justify-content-center h-100">
            <div className="col-md-4 col-xl-3 chat">
              <div className="card mb-sm-3 mb-md-0 contacts_card">
                <div className="card-header">
                  <div className="input-group">
                    <input type="text" placeholder="Search..." className="form-control search" />
                    <div className="input-group-prepend">
                      <span className="input-group-text search_btn"><i className="fas fa-search"></i></span>
                    </div>
                  </div>
                </div>
                <div className="card-body contacts_body">
                  <ul className="contacts">
                    {contacts.map((contact, index) => (
                      <li
                        key={index}
                        className={contact.name === selectedContact ? "active" : ""}
                        onClick={() => this.handleContactClick(contact.name)}
                      >
                        <div className="d-flex bd-highlight">
                          <div className="user_info">
                            <span>{contact.name}</span>
                            <p>{contact.lastMessage}</p>
                            <small>{contact.date}</small>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-footer"></div>
              </div>
            </div>
            <div className="col-md-8 col-xl-6 chat">
              <div className="card">
                <div className="card-header msg_head">
                  <div className="d-flex bd-highlight">
                    <div className="img_cont">
                      <img
                        src="https://png.pngtree.com/png-clipart/20210311/original/pngtree-number-36-golden-font-png-image_5985724.jpg"
                        className="rounded-circle user_img"
                        alt="User"
                      />
                      <span className="online_icon"></span>
                    </div>
                    <div className="user_info">
                      <span>Chat with {selectedContact}</span>
                    </div>
                  </div>
                </div>
                <div className="card-body msg_card_body">
                  {selectedMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`d-flex justify-content-${msg.sender === "You" ? "end" : "start"} mb-4`}
                    >
                      <div className="img_cont_msg">
                        <img
                          src={msg.senderImg}
                          className="rounded-circle user_img_msg"
                          alt={msg.sender}
                        />
                      </div>
                      <div className={`msg_cotainer${msg.sender === "You" ? "_send" : ""}`}>
                        {msg.message}
                        <span className={`msg_time${msg.sender === "You" ? "_send" : ""}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-footer">
                  <div className="input-group">
                    <div className="input-group-append">
                      <span className="input-group-text attach_btn">
                        <i className="fas fa-paperclip"></i>
                      </span>
                    </div>
                    <textarea
                      className="form-control type_msg"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={this.handleInputChange}
                    ></textarea>
                    <div className="input-group-append">
                      <span className="input-group-text send_btn" onClick={this.handleSendMessage}>
                        <i className="fas fa-location-arrow"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
