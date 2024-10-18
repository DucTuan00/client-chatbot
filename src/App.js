import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'jquery/dist/jquery.min.js';
import $ from 'jquery';

class Home extends React.Component {
  componentDidMount() {
    $('#action_menu_btn').click(function () {
      $('.action_menu').toggle();
    });
  }

  render() {
    // Mock data for contacts
    const contacts = [
      { name: "Alice", lastMessage: "Let's meet tomorrow.", date: "Oct 16, 2024" },
      { name: "Bob", lastMessage: "Can you send me the report?", date: "Oct 15, 2024" },
      { name: "Charlie", lastMessage: "Lunch at 1 PM?", date: "Oct 14, 2024" },
    ];

    // Mock data for chat messages
    const messages = [
      {
        sender: "Alice",
        message: "Hi, how are you doing?",
        time: "8:40 AM",
        senderImg: "https://png.pngtree.com/png-clipart/20210311/original/pngtree-number-36-golden-font-png-image_5985724.jpg"
      },
      {
        sender: "You",
        message: "I'm doing great, thanks for asking!",
        time: "8:45 AM",
        senderImg: "https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
      },
      {
        sender: "Alice",
        message: "Are you free this weekend?",
        time: "8:50 AM",
        senderImg: "https://png.pngtree.com/png-clipart/20210311/original/pngtree-number-36-golden-font-png-image_5985724.jpg"
      },
      {
        sender: "You",
        message: "Yes, I am! Let's catch up.",
        time: "8:55 AM",
        senderImg: "https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
      }
    ];

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
                      <li key={index} className={index === 0 ? "active" : ""}>
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
                      <img src="https://png.pngtree.com/png-clipart/20210311/original/pngtree-number-36-golden-font-png-image_5985724.jpg" className="rounded-circle user_img" alt="User" />
                      <span className="online_icon"></span>
                    </div>
                    <div className="user_info">
                      <span>Chat with Alice</span>
                    </div>
                  </div>
                </div>
                <div className="card-body msg_card_body">
                  {messages.map((msg, index) => (
                    <div key={index} className={`d-flex justify-content-${msg.sender === "You" ? "end" : "start"} mb-4`}>
                      <div className="img_cont_msg">
                        <img src={msg.senderImg} className="rounded-circle user_img_msg" alt={msg.sender} />
                      </div>
                      <div className={`msg_cotainer${msg.sender === "You" ? "_send" : ""}`}>
                        {msg.message}
                        <span className={`msg_time${msg.sender === "You" ? "_send" : ""}`}>{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-footer">
                  <div className="input-group">
                    <div className="input-group-append">
                      <span className="input-group-text attach_btn"><i className="fas fa-paperclip"></i></span>
                    </div>
                    <textarea className="form-control type_msg" placeholder="Type your message..."></textarea>
                    <div className="input-group-append">
                      <span className="input-group-text send_btn"><i className="fas fa-location-arrow"></i></span>
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