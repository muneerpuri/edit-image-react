import React, { useEffect, useRef } from "react";
import "./editPhoto.css";
import "./component.css";
import { ZoomIn, ZoomOut, RotateRight, RotateLeft } from "@mui/icons-material";
import DoneIcon from "@mui/icons-material/Done";
import CameraAlt from "@mui/icons-material/CameraAltOutlined";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import "subjx/dist/style/subjx.css";
const EditPhoto = () => {
  const [imageToBeCropped, setImageToBeCropped] = React.useState("");
  const [angle, setAngle] = React.useState(0);

  React.useEffect(() => {
    function handleEvent(message) {
      setImageToBeCropped(message.data);
    }
    document.addEventListener("message", handleEvent);

    return () => document.removeEventListener("message", handleEvent);
  }, []);
  useEffect(()=>{
    sendDataToReactNativeApp("start")

  },[])
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
      <p className="heading-top">
        Make any adjestments to fit the blue outlines for the best results.
      </p>
      <p className="heading-sub">
        Note: You can reposition the image by dragging the edges or corners of
        the crop rectangle, or move the picture.
      </p>
      <div style={{padding:'24px',display:'flex',justifyContent:'center',alignItems:'center',margin:'auto'}}>
      <div className="edit-photo-instructions col-sm-12">
        <Cropper
          src={imageToBeCropped}
          id="imgEdit"
          style={{ height: "646px", width: "640px",  }}
          className="cropper-editor"
          //dragMode="move"
          minContainerWidth={100}
          initialAspectRatio={640 / 646}
          guides={true}
          ref={cropperRef}
          aspectRatio={640 / 646}
          viewMode={0}
          autoCropArea={1}
        />
      </div>
      </div>
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
          Done
        </button>
      </div>
    </div>
  );
};
export default EditPhoto;
