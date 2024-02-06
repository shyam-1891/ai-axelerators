"use client";
import React, { useState } from "react";
import axios from "axios";

function Homepage() {
  const [name, setName] = useState("");
  // const [email, setEmail] = useState('');
  // const [message, setMessage] = useState('');
  async function submitForm(e) {
    e.preventDefault();

    const webhookUrl =
      "https://hooks.slack.com/services/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";

    const data = {
      text: `Name: ${name}`,
    };

    let res = await axios.post(webhookUrl, JSON.stringify(data), {
      withCredentials: false,
      transformRequest: [
        (data, headers) => {
          // delete headers.post["Content-Type"]
          return data;
        },
      ],
    });

    if (res.status === 200) {
      alert("Message Sent!");

      //clear state so text boxes clear
      setName("");
    } else {
      alert("There was an error.  Please try again later.");
    }
  }
  return (
    <>
      <div className="main_wrapper">
        <h1>Upload your image to geberate Ai based caption...</h1>
        <form onSubmit={submitForm}>
          <input
            type="file"
            // onChange={(e) => setUploadedImage(e.currentTarget.value)}
          />
          <p>Click in this area.</p>

          {/* <input
            className=""
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          /> */}
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}

// https://hooks.slack.com/services/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

export default Homepage;
