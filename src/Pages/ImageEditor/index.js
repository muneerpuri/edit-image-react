import React, { useEffect, useRef } from "react";
import "./editPhoto.css";
import "./component.css";
import { ZoomIn, ZoomOut, RotateRight, RotateLeft } from "@mui/icons-material";
import DoneIcon from "@mui/icons-material/Done";
import CameraAlt from "@mui/icons-material/CameraAltOutlined";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import CircleIcon from "@mui/icons-material/Circle";
import "subjx/dist/style/subjx.css";
const EditPhoto = () => {
  const [imageToBeCropped, setImageToBeCropped] = React.useState("");
  const [angle, setAngle] = React.useState(0);
  const instructions = [
    "Make sure that you face outline is inside the white background",
    "Your eyes are inside the goggles",
    "Your chin is no lower than the blue outline",
  ];
  React.useEffect(() => {
    function handleEvent(message) {
      setImageToBeCropped(message.data);
    }
    document.addEventListener("message", handleEvent);

    return () => document.removeEventListener("message", handleEvent);
  }, []);
  useEffect(() => {
    sendDataToReactNativeApp("start");
  }, []);
  useEffect(() => {
    const allRanges = document.querySelectorAll(".range-wrap");
    allRanges.forEach((wrap) => {
      const range = wrap.querySelector(".range");
      const bubble = wrap.querySelector(".bubble");

      range.addEventListener("input", () => {
        setBubble(range, bubble);
      });
      setBubble(range, bubble);
    });
  }, []);

  const sendDataToReactNativeApp = async (data) => {
    window.ReactNativeWebView.postMessage(data);
  };
  const rotateImg = (a) => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper.rotate(a - angle);

    setAngle(a);
  };

  function draw(sc) {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    cropper.zoom(sc);
  }

  const saveImg = async () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    const img = cropper
      .getCroppedCanvas({
        width: 640,
        height: 646,
      })
      .toDataURL();

    sendDataToReactNativeApp(img);
  };

  const Buttons = [
    {
      text: "Rotate Right",
      icon: RotateRight,
      onClick: () => {
        rotateImg(angle + 1);
        setAngle(angle + 1);
      }, // rotateImg("right"),
    },
    {
      text: "Rotate Left",
      icon: RotateLeft,
      onClick: () => {
        rotateImg(angle - 1);
        setAngle(angle - 1);
      }, // rotateImg("left"),
    },
    {
      text: "Zoom Out",
      icon: ZoomOut,
      onClick: () => {
        draw(-0.005);
      },
    },
    {
      text: "Zoom In",
      icon: ZoomIn,
      onClick: () => {
        draw(0.005);
      },
    },
  ];

  function setBubble(range, bubble) {
    const val = range.value;
    const min = range.min ? range.min : -180;
    const max = range.max ? range.max : 180;
    const newVal = Number(((val - min) * 100) / (max - min));
    bubble.innerHTML = val + " degree";

    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
  }

  const cropperRef = useRef(null);

  return (
    <div className="edit-photo-div container-edit-photo">
      
          <Cropper
            src={imageToBeCropped}
            id="imgEdit"
            style={{ marginTop:"20px" }}
            className="cropper-editor"
            //dragMode="move"
            minContainerWidth={100}
            initialAspectRatio={740 / 746}
            guides={true}
            ref={cropperRef}
            aspectRatio={740 / 746}
            viewMode={0}
            autoCropArea={1}
          />
      <div className="edit-photo-actions">
        <span className="flexButtons">
          {" "}
          {Buttons.map((button) => {
            return (
              <div
                key={button.text}
                onClick={button.onClick}
                className="edit-photo-button"
              >
                <button.icon
                  style={{
                    cursor: "pointer",
                    fontSize: "2.5rem",
                    color: "black",
                  }}
                ></button.icon>
              </div>
            );
          })}
        </span>

        <button
          className="retake-btn"
          onClick={() => sendDataToReactNativeApp("retake")}
          size="large"
        >
          <CameraAlt style={{ margin: "2px" }} />
          Retake
        </button>
      </div>

      <div style={{ marginTop: "10px" }}></div>

      <div className="done-button-div">
        <button className="done-btn" onClick={() => saveImg()} size="large">
          <DoneIcon style={{ color: "white", paddingRight: "5px" }} />
          Save
        </button>
      </div>
      <p className="heading-top">
        Instructions
      </p>
      {/* <p className="heading-top">
        Make any adjestments to fit the blue outlines for the best results.
      </p> */}
      <List>
        {instructions.map((instruction, index) => (
          <div style={{display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
          <CircleIcon style={{ fontSize: "10px"  ,marginRight:"10px"}} />{" "}
          <p className="heading-sub" style={{textAlign:"left"}}>{instruction}</p>
      </div>
        ))}
      </List>
      <p className="heading-sub">
        Note: If your photo doesn't meet the above 3 steps, please retake a
        photo until it does. Failing to do so will result in wrongly sized
        hairstyles covering your forehead or face
      </p>
      <p className="heading-top"  style={{textAlign:"left",marginLeft:"10px"}}>YOUR PHOTO:</p>

      <div style={{display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
            <CircleIcon style={{ fontSize: "10px"  ,marginRight:"10px"}} />{" "}
            <p className="heading-sub" style={{textAlign:"left"}}>{ "You can use two fingers on your photo to make it bigger or smaller"}</p>
        </div>
      <p className="heading-top" style={{textAlign:"left",marginLeft:"10px"}}>BLUE GRID:</p>
      {[
        "You can use one finger to drag the grid up or down",
        "Use the blue square to make the grid smaller or larger",
        "Use one finger to drag the grid around to fit your photo",
      ].map((instruction, index) => (
        <div style={{display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
            <CircleIcon style={{ fontSize: "10px"  ,marginRight:"10px"}} />{" "}
            <p className="heading-sub" style={{textAlign:"left"}}>{instruction}</p>
        </div>
      ))}
    </div>
  );
};
export default EditPhoto;
