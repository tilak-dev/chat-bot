"use client";

import axios from "axios";
import { useState } from "react";
interface Message {
  user?: string;
  gemini?: string;
}
export default function Home() {
  const [input, setInput] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    try {
      if (!input) {
        console.log("Please enter a valid input");
        return;
      }
      setMessages((prevMessages) => [...prevMessages, { user: input }]);
      setInput("");
      setLoading(true);
      const response = await axios.post("/api/gemini", {
        prompt: input,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { gemini: response.data.response },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { gemini: "Error occurred, please try again later." },
      ]);
      return;
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex md:py-16 py-10 px-8 justify-center font-[family-name:var(--font-geist-sans)] min-h-screen overflow-hidden">
      <div className="text-black w-full md:w-1/2">
        {/* chat design */}
        <div className="md:h-16 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-tl-3xl rounded-tr-3xl flex items-center">
          <div className="">
            <span className="md:text-2xl font-bold text-white">
              Welcome to ChatBot
            </span>
          </div>
        </div>
        <hr />
        <div className="md:h-[320px] h-[250px] px-4 py-3 bg-blue-300 overflow-x-hidden overflow-y-auto text-pretty text-sm md:text-[14px] flex flex-col">
          {/* chat greeting message */}
          <div className=" space-y-1">
            <p className=" bg-teal-500 text-white max-w-max py-0.5 rounded-xl px-3 ">
              Hello, I'm anshu a ChatBot.
            </p>

            {messages &&
              messages.map((message, index) =>
                message.gemini ? (
                  <p
                    key={index}
                    className="w-7/12 bg-teal-500 text-white max-w-max py-0.5 rounded-xl px-3"
                  >
                    {message.gemini}
                  </p>
                ) : (
                  <div className="flex  justify-end">
                     <p
                    key={index}
                    className="w-7/12 md:text-lg bg-blue-500 text-white max-w-max py-0.5 rounded-xl px-3 md:rounded-xl"
                  >
                    {message.user}
                  </p>
                  </div>
                 
                )
              )}
              <p> {loading && "writing.."}</p>
          </div>
        </div>
        <hr />
        <div className="md:h-16 w-full px-4 py-3 rounded-bl-3xl rounded-br-3xl flex items-center justify-between flex-row bg-gradient-to-r from-teal-600 to-green-600">
          {/* chat input */}
          <div className="w-9/12">
            <input
              value={input || ""}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-4 py-2 rounded-xl focus:outline-none"
              type="text"
              placeholder="Ask me anything..."
            />
          </div>
          <div className="w-2/12">
            <button
              disabled={loading}
              onClick={sendMessage}
              className="w-full px-4 py-2 rounded-xl text-white bg-green-600 hover:bg-teal-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
