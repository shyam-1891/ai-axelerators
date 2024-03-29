"use client";
import React, { useState, useId, useEffect } from "react";
import axios from "axios";
// import { WebClient, LogLevel } from "@slack/web-api";
import ollama from "ollama";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import logo from '../app/logo.png';
import darklogo from "../public/darklogo.png";

function Homepage() {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState("");
  const [aiCaptionText, setAiCaptionText] = useState("");
  const [channels, setChannels] = useState([]);

  const [file, setFile] = useState();
  const [loader, setLoader] = useState(false);
  const [base64String, setBase64String] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [prompt, setPrompt] = useState("a");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSelectpromptChange = (event) => {
    setPrompt(event.target.value);
  };

  useEffect(() => {
    // console.log(process.env.NEXT_PUBLIC_Slack_Token);
    const fetchChannels = async () => {
      try {
        setLoader(true);
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "http://localhost:3000/api/api/conversations.list",
          headers: {
            "Access-Control-Allow-Headers": "*",
            "Content-type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_Slack_Token}`,
          },
        };

        axios
          .request(config)
          .then((response) => {
            // console.log(JSON.stringify(response.data));
            if (response.data.ok) {
              setChannels(response.data.channels);
              setLoader(false);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        setLoader(false);
      } finally {
        setLoader(false);
      }
    };

    fetchChannels();
  }, []);

  async function submitForm(e) {
    e.preventDefault();

    // console.log(base64String);
    if (uploadedImage && base64String && prompt) {
      // Set loader true
      setLoader(true);

      const test = base64String.split("base64,");

      // const promptVal = prompt;
      let promptVal =
        "Generate a good creative instagram caption for this image in brief use emojis or hastags if needed.";
      if (prompt == "a") {
        promptVal =
          "Generate a good creative caption for this image in brief use emojis or hastags if needed.";
      } else if (prompt == "b") {
        promptVal = "describe this image in brief.";
      } else if (prompt == "c") {
        promptVal =
          "Generate a good funny emojis for this image in brief use emojis if needed.";
      } else {
        promptVal =
          "Generate a good creative hastags caption for this image in brief.";
      }

      const response = await ollama.generate({
        model: "llava",
        prompt: promptVal,
        images: [test[1]],
        stream: false,
      });

      if (response.done) {
        setLoader(false);
        setAiCaptionText(response.response);
      } else {
        setLoader(false);
        alert("There was an error.  Please try again later.");
      }
    } else {
      alert("Please Upload An Image.");
    }
  }

  const submitToslack = async () => {
    if (uploadedImage && aiCaptionText && selectedOption != "") {
      // console.log(uploadedImage);
      // console.log(selectedOption);

      setLoader(true);
      const form = new FormData();
      form.append("token", process.env.NEXT_PUBLIC_Slack_Token);
      form.append("channels", selectedOption);
      form.append("file", uploadedImage);
      form.append("filetype", "auto");
      form.append("initial_comment", aiCaptionText);
      try {
        const res = await axios.post(
          "https://slack.com/api/files.upload",
          form
        );

        // console.log(res);

        if (res.data.ok) {
          setLoader(false);
          alert("Your message is posted successfully..");
        } else {
          setLoader(false);
          alert("Something went wrong...");
        }
      } catch (err) {
        throw new Error(err);
      }
    } else {
      setLoader(false);
      alert("Select Any Slack Channel To Share.");
    }
  };

  const postTextAreaId = useId();

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
      setFile(URL.createObjectURL(e.target.files[0]));
      setAiCaptionText("");
      const filedfd = e.target.files[0];

      const reader = new FileReader();

      reader.onloadend = () => {
        // Convert image to Base64 string
        const base64 = reader.result;
        setBase64String(base64);
      };

      if (filedfd) {
        reader.readAsDataURL(filedfd);
      }
    }
  };

  const reset = () => {
    setAiCaptionText("");
    setBase64String("");
    setFile("");
    setUploadedImage("");
    setLoader(false);
    setSelectedOption("");
    setPrompt("a");
    document.getElementById("formFileLg").value = "";
    router.refresh();
  };

  return (
    <>
      <div className="main_wrapper font-mono capitalize">
        <div className="logo_wrapper">
          {/* <img src="https://www.axelerant.com/hubfs/raw_assets/public/Axelerant_theme_2022/images/Axelerant-Logo-color.svg" /> */}
          <Image
            src={darklogo}
            alt="Picture of the author"
            width={200}
            height={500}
          />
        </div>
        <h1 className="mb-4 font-mono text-4xl font-extrabold leading-none tracking-tight  md:text-4xl lg:text-4xl text-white text-center mx-auto mt-1 uppercase">
          Generate Ai based captions
        </h1>
        <div className="content__Wrapper">
          <div className="left_wrapper border-gray-300 border-dashed rounded-lg relative">
            <form
              onSubmit={submitForm}
              className=" absolute top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 w-4/5"
            >
              <div className="imageFieldwrapper text-left">
                <label
                  htmlFor="formFileLg"
                  className="mb-2 inline-block text-neutral-200"
                >
                  File upload
                </label>
                <input
                  className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                  id="formFileLg"
                  type="file"
                  // onChange={(e) => setUploadedImage(e.target.files[0])}
                  onChange={handleChange}
                />

                <br></br>
                <label
                  htmlFor="formFileLg"
                  className="mb-2 inline-block text-neutral-200"
                >
                  Select prompt
                </label>
                <select
                  className=" border   text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={prompt}
                  onChange={handleSelectpromptChange}
                >
                  {/* Default option */}
                  <option value="a">Generate Creative Caption</option>
                  <option value="c">Generate Funny Caption</option>
                  <option value="b">Describe This Image</option>
                  {/* <option value="d">Generate hastags Caption</option> */}
                </select>
                <br />
                <button
                  type="submit"
                  className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 capitalize"
                >
                  Generate image caption
                </button>
                <br />
                <br />
                <button
                  type="button"
                  className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 capitalize"
                  onClick={reset}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
          <div className="right_wrapper">
            <div className="rounded-lg shadow bg-gray-800 border-gray-700 w-full min-h-[580px] p-8">
              <span className="relative flex justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

                <span className="relative text-white bg-gray-800 px-6">
                  Preview Section
                </span>
              </span>
              <br />

              {file && <img className="previewimg" src={file} />}
              <br />
              {aiCaptionText && (
                <textarea
                  className="mt-2 w-full rounded-lg align-top shadow-sm sm:text-sm border-gray-700 bg-gray-800 text-white p-2 border divide-solid"
                  rows="5"
                  id={postTextAreaId}
                  cols={40}
                  placeholder="Enter any additional order notes..."
                  value={aiCaptionText}
                  onChange={(e) => setAiCaptionText(e.target.value)}
                >
                  {aiCaptionText}
                </textarea>
              )}
            </div>
          </div>
        </div>

        {channels.length > 0 && (
          <select
            className=" border   text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-w-fit my-5 mx-auto"
            value={selectedOption}
            onChange={handleSelectChange}
            disabled={aiCaptionText ? "" : "disabled"}
          >
            {/* Default option */}
            <option value="">-- Select Slack Channel --</option>
            {channels.map((channel) => (
              <option value={channel.id} key={channel.id}>
                {channel.name}
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 capitalize"
          onClick={submitToslack}
          disabled={aiCaptionText ? "" : "disabled"}
        >
          Let's Share It to a Slack channel
        </button>

        {/* Loader.... */}
        {loader && (
          <>
            <div
              role="status"
              className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 z-10"
            >
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            <div className="overlay"></div>
          </>
        )}
      </div>
    </>
  );
}

// https://hooks.slack.com/services/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

export default Homepage;
