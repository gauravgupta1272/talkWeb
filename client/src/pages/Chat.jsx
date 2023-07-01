import { useContext, useEffect, useRef, useState } from "react";
import Avatar from "../components/Avatar";
import Logo from "../components/Logo";
import { UserContext } from "../UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import Contact from "../components/Contact";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { username, id, setId, setUsername } = useContext(UserContext);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  
  const divUnderMessages = useRef();

   // initiate web socket connection at start
  useEffect(() => {
    connectToWebSocket();
  }, [selectedUserId]);

  function connectToWebSocket() {
    const ws = new WebSocket("ws://localhost:4040");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected. Trying to Reconnect");
        connectToWebSocket();
      }, 1000);
    });
  }

  //showing whose online with a green mark
  function showOnlinePeople(peopleArray) {
    // console.log(people);
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    // console.log(people);
    setOnlinePeople(people);
  }

  //when a msg is submitted
  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    // console.log({ ev, messageData });
    // console.log(messageData);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      if (messageData.sender === selectedUserId) {
        setMessages((prev) => [...prev, { ...messageData }]);
      }
    }
  }

  //logout function
  function logout() {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  }

  //sending msg through socket
  function sendMessage(ev, file = null) {
    if (ev) ev.preventDefault();
    // console.log("sending");
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
        file,
      })
    );

    if (file) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    } else {
      setNewMessageText("");
      setMessages((prev) => [
        ...prev,
        {
          text: newMessageText,
          sender: id,
          recipient: selectedUserId,
          _id: Date.now(),
        },
      ]);
    }
  }

  //if file selected then sending as a file after converting
  function sendFile(ev) {
    //convert the base 64 to binary
    // console.log(ev.target.files);
    // const file = ev.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: ev.target.files[0].name,
        data: reader.result,
      });
    };
  }

  //when new msg comes automatically scroll down
  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  //automatically show how is online
  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      // console.log(offlinePeople);
      const offlinePeopleObj = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeopleObj[p._id] = p;
      });
      // console.log({offlinePeopleObj, offlinePeopleArr});
      // setOfflinePeople(offlinePeopleArr);
      setOfflinePeople(offlinePeopleObj);
    });
  }, [onlinePeople, ]);

  //when contact selected then show msgs 
  useEffect(() => {
    if (selectedUserId) {
      // console.log('/messages/'+selectedUserId);
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  const onlinePeopleNotUs = { ...onlinePeople };
  delete onlinePeopleNotUs[id];

  const messageWithoutDupes = uniqBy(messages, "_id");

  return (
    <div className="flex h-screen w-screen">
      <div className=" w-1/3 flex flex-col">
        <div className="flex-grow w-full">
          <Logo />
          {/* Display all the contacts */}
          {Object.keys(onlinePeopleNotUs).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={true}
              username={onlinePeopleNotUs[userId]}
              onClick={() => {
                setSelectedUserId(userId);
              }}
              selected={userId === selectedUserId}
            />
          ))}

          {Object.keys(offlinePeople).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={false}
              username={offlinePeople[userId].username}
              onClick={() => {
                setSelectedUserId(userId);
              }}
              selected={userId === selectedUserId}
            />
          ))}
        </div>
              {/* Display the user logged in and an option to logout */}
        <div className="p-2 text-center flex items-center justify-center">
          <span className="mr-2 text-xl text-gray-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
            {username}
          </span>
          <button
            onClick={logout}
            className="text-l bg-blue-100 py-1 px-2 text-gray-500 border rounded-sm blue_gradient"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Chat Section */}
      <div className="bg-blue-50 flex flex-col w-2/3 p-2">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full items-center justify-center ">
              <div className="text-gray-300">
                {" "}
                &larr; Choose a person to Start chatting
              </div>
            </div>
          )}

          {/* Render all Message between user and selected user */}
          {!!selectedUserId && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 bottom-2 left-0 right-0">
                {messageWithoutDupes.map((message) => (
                  <div
                    key={message._id}
                    className={
                      message.sender === id ? "text-right" : "text-left"
                    }
                  >
                    <div
                      className={
                        "text-left inline-block p-2 my-2 rounded-md text-2xl " +
                        (message.sender === id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-500")
                      }
                    >
                      {/* sender: {message.sender} <br/>
                            my id: {id} <br/> */}
                      {message.text}
                      {message.file && (
                        <div className="">
                          <a
                            target="_blank"
                            className="flex items-center gap-1 border-b "
                            href={
                              axios.defaults.baseURL + "uploads/" + message.file
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-5 h-5"
                            >
                              <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                              <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
                            </svg>

                            {message.file}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
        </div>

        {/* Text bar */}
        {!!selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
          
            <input
              value={newMessageText}
              onChange={(ev) => setNewMessageText(ev.target.value)}
              type="text"
              placeholder="Type your message here"
              className="bg-white border rounded-xl p-2 flex-grow "
            />
            <label className="border bg-gray-100 cursor-pointer rounded-xl p-2">
              <input type="file" className="hidden" onChange={sendFile} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
