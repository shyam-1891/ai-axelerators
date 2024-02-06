"use client";
import React, { useState } from "react";
import axios from "axios";

function Homepage() {
  const [uploadedImage, setUploadedImage] = useState();
  
  async function submitForm(e) {
    e.preventDefault();

    const dataUrl = uploadedImage;

    const uploadApi = `https://api.cloudinary.com/v1_1/dph7iakpy/image/upload`;

    const formData = new FormData();
    formData.append("file", dataUrl);
    formData.append("upload_preset", "testpreset");

    await fetch(uploadApi, {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        const values = await res.json();
  
        const data = {
          name: values.original_filename,
          url: values.url,
          custumcaption: 'Ai generate caption'
        };

        // console.log(data);

        const finalData = {
            text: `Custom text: ${data.custumcaption} Image Name: ${data.name} Image URL: ${data.url}`,
        };

        const webhookUrl =
      "https://hooks.slack.com/services/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";

        let resss = await axios.post(webhookUrl, JSON.stringify(finalData), {
            withCredentials: false,
            transformRequest: [
              (finalData, headers) => {
                // delete headers.post["Content-Type"]
                return finalData;
              },
            ],
          });
      
          if (resss.status === 200) {
            alert("Message Sent!");
      
            //clear state so text boxes clear
            setUploadedImage("");
          } else {
            alert("There was an error.  Please try again later.");
          }
    });

  }
  return (
    <>
      <div className="main_wrapper">
        <h1>Upload your image to geberate Ai based caption...</h1>
        <form onSubmit={submitForm}>
          <input
            type="file"
            onChange={(e) => setUploadedImage(e.target.files[0])}
          />
          <p>Click in this area.</p>

          
          <button type="submit">Upload picture</button>
        </form>
      </div>
    </>
  );
}
export default Homepage;
