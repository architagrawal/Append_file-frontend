import React, { useState, ChangeEvent } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Button } from "flowbite-react";

const FileInputComponent: React.FC = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [uploadMessage, setUploadMessage] = useState<string>("");

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async () => {
    // Handle text and file submission here
    console.log("Text:", text);
    console.log("File Name:", fileName);
    console.log("File Content:", file);
    if (file) {
      const client = new S3Client({
        region: "us-east-1",
        credentials: {
          accessKeyId: "AKIA47CR2H7SRPE3KONT",
          secretAccessKey: "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",
        },
      });

      const command = new PutObjectCommand({
        Bucket: "archit-fovus",
        Key: fileName,
        Body: file,
      });

      //   const formData = new FormData();
      //   formData.append("input_text", text);
      //   formData.append("input_file_path", `archit-fovus/${fileName}`);

      try {
        const responseFroms3 = await client.send(command);
        console.log("File uploaded successfully to s3", responseFroms3);
        // console.log(formData);
        const bodyData = {
          input_text: text,
          input_file_path: `archit-fovus/${fileName}`,
        };
        const response = await fetch(
          "https://3gr9oc4ifl.execute-api.us-east-1.amazonaws.com/dev/archit-fovus-endpoint",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
          }
        );

        if (response.ok) {
          console.log("Data saved successfully");
          // Handle success
        } else {
          console.error("Failed to save data:", response.statusText);
          // Handle error
        }
        setUploadMessage("Uploaded successfully");
        setText(""); // Clear text input
        setFile(null); // Clear file input
        setFileName(""); // Clear file name
        // Hide success message after 3 seconds
        setTimeout(() => {
          setUploadMessage("");
        }, 1000);
        // Handle success
      } catch (error) {
        console.error("Error uploading file", error);
        setUploadMessage("Upload failed. Please try again.");
        // Handle error
      }
    } else {
      console.warn("No file selected");
      // Handle no file selected
    }
  };

  return (
    <div
      style={{ display: "inline-flex", flexDirection: "column", gap: "16px" }}
    >
      <div>
        <label style={{ margin: "10px" }}>Input text: </label>
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text"
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label style={{ margin: "10px" }}>File input:</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        onClick={handleSubmit}
        style={{ margin: "10px", width: "fit-content" }}
      >
        Submit
      </button>
      {uploadMessage && <p className="mt-2">{uploadMessage}</p>}
    </div>
  );
};

export default FileInputComponent;
