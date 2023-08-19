import { useState, useRef, useEffect } from "react";
import "./App.css";

function IndexLabel(props) {
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
  let textRef = useRef(null);
  const [scaleX, setScaleX] = useState(1);

  const getFontFamily = (font) => {
    return font.split(":wght@")[0];
  };
  const getFontWeight = (font) => {
    const fontInfo = font.split(":wght@");
    return fontInfo.length > 1 ? fontInfo[1] : "";
  };

  useEffect(() => {
    if (rectRef.current) {
      const rectW = rectRef.current.getBoundingClientRect()["width"];
      const textW = textRef.current.getBoundingClientRect()["width"];
      setScaleX(
        (rectW - padding * 0.13) / textW > 1
          ? 1
          : (rectW - padding * 0.13) / textW
      );
    }
  }, [props.text, props.mini, props.open]);

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
        y={props.y + padding + props.height * 0.78}
        fill={props.color}
        fontSize={props.height * 0.7}
        className="fixed-width"
        fontFamily={getFontFamily(props.font)}
        fontWeight={getFontWeight(props.font)}
        ref={textRef}
        visibility="hidden"
      >
        {props.text}
      </text>
      <text
        y={props.y + padding + props.height * 0.78}
        fill={bgcolor}
        fontSize={props.height * 0.7}
        className="fixed-width"
        fontFamily={getFontFamily(props.font)}
        fontWeight={getFontWeight(props.font)}
        transform={`translate(${props.x + padding * 1.25}) scale(${scaleX},1)`}
      >
        {props.text}
      </text>
    </>
  );
}

export default IndexLabel;
