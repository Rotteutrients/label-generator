import { useState, useEffect } from "react";

const gFontUrl = "https://fonts.googleapis.com/css2";
const reUrl = /^\s*src:\s+url\((?<resouce>.+)\)\s+format\('(?<format>.*)'\)/im;

function FontStyleEmbed(props) {
  const [fontUrl, setFontUrl] = useState("");
  const [fontFormat, setFontFormat] = useState("");

  const getFontFamily = (font) => {
    return font.split(":wght@")[0];
  };
  const getFontWeight = (font) => {
    const fontInfo = font.split(":wght@");
    return fontInfo.length > 1 ? `font-weight: ${fontInfo[1]};` : "";
  };

  useEffect(() => {
    fetch(
      props.url ??
        gFontUrl +
          "?" +
          new URLSearchParams({
            family: props.fontFamily,
            text: props.string !== "" ? props.string : " ",
          }).toString()
    )
      .then((response) => {
        return response.text();
      })
      .then((style) => {
        const matches = style.match(reUrl);
        setFontFormat(`format("${matches[2]}")`);
        return fetch(matches[1]);
      })
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result.split(",")[1];
          setFontUrl(
            `url("data:application/font-woff; charset=utf-8; base64,${base64Data}")`
          );
        };
        reader.readAsDataURL(blob);
      });
  }, [props.string, props.fontFamily]);

  return (
    <style>
      {`@font-face {
      font-family:'${getFontFamily(props.fontFamily)}';
      ${getFontWeight(props.fontFamily)}
      src: ${fontUrl} ${fontFormat};
  }`}
    </style>
  );
}

export default FontStyleEmbed;
