import { useState, useRef, useEffect } from "react";
import "./App.css";

function IndexSubject(props) {
  // 128dot = 10.8mm
  const padding = props.padding;
  const band = props.band;

  const bgcolor = "#fcfcfc";

  const dragonfly = (x, y, width, height) => {
    const tl = Math.ceil(padding * 0.6);
    const tm = Math.ceil(padding * 0.1);

    return (
      <>
        <rect
          x={x + padding - band}
          y={y + tm}
          width={band}
          height={tl}
          fill={bgcolor}
        />
        <rect
          x={x + padding - tl}
          y={y + tm + tl - band}
          width={tl}
          height={band}
          fill={bgcolor}
        />
        <rect
          x={x + tm + tl - band}
          y={y + padding - tl}
          width={band}
          height={tl}
          fill={bgcolor}
        />
        <rect
          x={x + tm}
          y={y + padding - band}
          width={tl}
          height={band}
          fill={bgcolor}
        />
        <rect
          x={x + padding - band}
          y={y + padding + height + padding - tm - tl}
          width={band}
          height={tl}
          fill={bgcolor}
        />
        <rect
          x={x + padding - tl}
          y={y + padding + height + padding - tm - tl}
          width={tl}
          height={band}
          fill={bgcolor}
        />
        <rect
          x={x + tm + tl - band}
          y={y + padding + height}
          width={band}
          height={tl}
          fill={bgcolor}
        />
        <rect
          x={x + tm}
          y={y + padding + height}
          width={tl}
          height={band}
          fill={bgcolor}
        />
        <rect
          x={x + padding + width}
          y={y + tm}
          width={band}
          height={tl}
          fill={bgcolor}
        />
        <rect
          x={x + padding + width}
          y={y + tm + tl - band}
          width={tl}
          height={band}
          fill={bgcolor}
        />
        <rect
          x={x + padding + width + padding - tm - tl}
          y={y + padding - tl}
          width={band}
          height={tl}
          fill={bgcolor}
        />
        <rect
          x={x + padding + width + padding - tm - tl}
          y={y + padding - band}
          width={tl}
          height={band}
          fill={bgcolor}
        />
        <rect
          x={x + padding + width}
          y={y + padding + height + padding - tm - tl}
          width={band}
          height={tl}
          fill={bgcolor}
        />
        <rect
          x={x + padding + width}
          y={y + padding + height + padding - tm - tl}
          width={tl}
          height={band}
          fill={bgcolor}
        />
        <rect
          x={x + padding + width + padding - tm - tl}
          y={y + padding + height}
          width={band}
          height={tl}
          fill={bgcolor}
        />
        <rect
          x={x + padding + width + padding - tm - tl}
          y={y + padding + height}
          width={tl}
          height={band}
          fill={bgcolor}
        />
      </>
    );
  };

  let rectRef = useRef(null);
  let textTitleRef = useRef(null);
  let textDescRef = useRef(null);
  const [scaleTitleX, setscaleTitleX] = useState(1);
  const [scaleDescX, setScaleDescX] = useState(1);

  const getFontFamily = (font) => {
    return font.split(":wght@")[0];
  };
  const getFontWeight = (font) => {
    const fontInfo = font.split(":wght@");
    return fontInfo.length > 1 ? fontInfo[1] : "";
  };

  const descText = (desc, idx) => {
    return (
      <text
        x={(props.x + padding * 1.5) / scaleDescX}
        y={
          props.y +
          padding +
          props.height *
            (props.textDesc.length < 3
              ? 0.73 + 0.22 * idx
              : 0.4 + (0.54 * (idx + 1)) / props.textDesc.length)
        }
        fill={bgcolor}
        fontSize={
          props.height *
          (props.textDesc.length < 3 ? 0.21 : 0.54 / props.textDesc.length)
        }
        className="fixed-width"
        fontFamily={getFontFamily(props.font)}
        fontWeight={getFontWeight(props.font)}
      >
        {desc}
      </text>
    );
  };

  useEffect(() => {
    if (rectRef.current) {
      const rectW = rectRef.current.getBoundingClientRect()["height"];
      const textTitleW = textTitleRef.current.getBoundingClientRect()["height"];
      const textDescW = textDescRef.current.getBoundingClientRect()["height"];
      setscaleTitleX(
        (rectW - padding * 0.18) / textTitleW > 1
          ? 1
          : (rectW - padding * 0.18) / textTitleW
      );
      setScaleDescX(
        (rectW - padding * 0.18) / textDescW > 1
          ? 1
          : (rectW - padding * 0.18) / textDescW
      );
    }
  }, [props.textTitle, props.textDesc, props.mini, props.open]);

  return (
    <>
      {dragonfly(props.x, props.y, props.width, props.height)}
      <rect
        x={props.x + padding}
        y={props.y + padding}
        width={props.width}
        height={props.height}
        fill={props.color}
        ref={rectRef}
      />
      <text
        y={
          props.y +
          padding +
          props.height * (props.textDesc.length < 3 ? 0.47 : 0.37)
        }
        fill={props.color}
        fontSize={props.height * (props.textDesc.length < 3 ? 0.5 : 0.4)}
        className="fixed-width"
        fontFamily={getFontFamily(props.font)}
        fontWeight={getFontWeight(props.font)}
        ref={textTitleRef}
        visibility="hidden"
      >
        {props.textTitle}
      </text>
      <text
        y={
          props.y +
          padding +
          props.height * (props.textDesc.length < 3 ? 0.47 : 0.37)
        }
        fill={bgcolor}
        fontSize={props.height * (props.textDesc.length < 3 ? 0.5 : 0.4)}
        className="fixed-width"
        fontFamily={getFontFamily(props.font)}
        fontWeight={getFontWeight(props.font)}
        transform={`translate(${
          props.x + padding * 1.5
        }) scale(${scaleTitleX},1)`}
      >
        {props.textTitle}
      </text>
      <g visibility="hidden" ref={textDescRef}>
        {props.textDesc.map((desc, idx) => {
          return descText(desc, idx);
        })}
      </g>
      <g transform={`scale(${scaleDescX},1)`}>
        {props.textDesc.map((desc, idx) => {
          return descText(desc, idx);
        })}
      </g>
    </>
  );
}

export default IndexSubject;
