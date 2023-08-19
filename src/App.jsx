import { useState, useId, useRef } from "react";
import "./App.css";
import FontStyleEmbed from "./FontStyleEmbed";
import IndexLabel from "./IndexLabel";
import IndexSubject from "./IndexSubject";
import EditIcon from "@mui/icons-material/Edit";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import SettingsIcon from "@mui/icons-material/Settings";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";

import {
  Grid,
  Button,
  Checkbox,
  IconButton,
  Box,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Modal,
  FormControl,
  FormControlLabel,
  InputLabel,
  Input,
  Stack,
  Container,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { MuiColorInput } from "mui-color-input";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const styleFill = {
  width: `100%`,
  height: `100%`,
};

const styleWidth = {
  minWidth: "300px",
};

const styleRight = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const fontAllowed = [
  {
    label: "M PLUS Rounded 1c",
    weight: [100, 300, 400, 500, 700, 800, 900],
  },
  {
    label: "M PLUS 1p",
    weight: [100, 300, 400, 500, 700, 800, 900],
  },
  {
    label: "Murecho",
    weight: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  },
  {
    label: "Kosugi",
    weight: [400],
  },
  {
    label: "Kosugi Maru",
    weight: [400],
  },
  {
    label: "RocknRoll One",
    weight: [400],
  },
  {
    label: "Shippori Mincho",
    weight: [400, 500, 600, 700, 800],
  },
];

const fontWeightJoinToken = ":wght@";

function convertSvgToPng(id) {
  const fileName = "bookcase_label.svg";
  const svgNode = document.getElementById(id);
  const svgElement = svgNode.cloneNode(true);

  if (svgElement) {
    svgElement.removeAttribute("style");
    svgElement.removeAttribute("viewBox");
    const svgText = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgText);
    img.onload = () => {
      // Canvasを作成して描画
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext("2d");

      context.drawImage(img, 0, 0);

      // CanvasをPNG画像に変換してダウンロード
      const pngData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngData;
      link.download = "converted_image.png";
      link.click();
    };
  }
}
function convertSvg(id) {
  const fileName = "bookcase_label.svg";
  const svgNode = document.getElementById(id);
  const svgElement = svgNode.cloneNode(true);

  if (svgElement) {
    svgElement.removeAttribute("style");
    svgElement.removeAttribute("viewBox");
    const svgText = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const a = document.createElement("a");
    a.href = svgUrl;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(svgUrl);
  }
}

function exportSettings(labels, color, font) {
  const fileName = "bookcase_label_setting.json";
  const data = new Blob(
    [JSON.stringify({ list: labels, color: color, font: font })],
    {
      type: "text/json",
    }
  );
  const jsonURL = window.URL.createObjectURL(data);
  const link = document.createElement("a");
  document.body.appendChild(link);
  link.href = jsonURL;
  link.setAttribute("download", fileName);
  link.click();
  document.body.removeChild(link);
}

async function importSettings(
  setLabels,
  setColor,
  handleFontChange,
  handleWeightChange
) {
  // ファイル選択ダイアログを表示してユーザーのファイル選択を待つ
  const fSelector = async () => {
    try {
      return await window.showOpenFilePicker({
        types: [
          {
            description: "JSON",
            accept: {
              "text/json": [".json"],
            },
          },
        ],
        multiple: false,
      });
    } catch {}
    return [];
  };
  const files = await fSelector();
  if (files.length > 0) {
    const file = await files[0].getFile();
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (json instanceof Object !== true) {
          throw new Error("Unreadable json!");
        }
        if (!Array.isArray(json.list)) {
          throw new Error("Unreadable json!");
        }
        const validJson = json.list.map((row) => {
          if (row instanceof Object !== true) {
            throw new Error("Unreadable json!");
          }
          return {
            title: row.title ?? "",
            spine: row.spine ?? "",
            desc: row.desc ?? [],
            mini: row.mini === true,
          };
        });
        setLabels(validJson);

        if (json.color) {
          setColor(json.color);
        }

        if (json.font) {
          const fontInfo = json.font.split(fontWeightJoinToken);
          if (fontInfo.length > 0) {
            fontAllowed.map((font, idx) => {
              if (font.label == fontInfo[0]) {
                handleFontChange(idx);
                if (fontInfo.length > 1) {
                  fontAllowed[idx].weight.map((wght, i) => {
                    if (wght == fontInfo[1]) {
                      handleWeightChange(i);
                    }
                  });
                }
              }
            });
          }
        }
      } catch (_error) {}
    };
  }
  return [];
}

function IndexImage(props) {
  // 128dot = 10.8mm
  const width = 2480;
  const height = 3508;
  const mergin = 128;
  const padding = 120;
  const band = 6;

  const spineHeight = 200;
  const spineWidth = 1960;
  const spineMinWidth = 1300;

  const subjectWidth = 1360;
  const subjectMinWidth = 1080;
  const subjectHeight = 500;
  const subjectMinHeight = 480;

  const svgId = useId();

  let tmpYLabel = mergin;
  let tmpYSubject = 0;
  const labelX = mergin;
  const labelY =
    mergin +
    (spineHeight + padding * 2) * props.labels.length +
    subjectWidth +
    padding * 2;
  let elmLabel = [];
  let elmSub = [];
  props.labels.map((label) => {
    if (label.spine.length > 0) {
      elmLabel.push(
        <IndexLabel
          text={label.spine}
          x={labelX}
          y={tmpYLabel}
          width={label.mini ? spineMinWidth : spineWidth}
          height={spineHeight}
          band={band}
          padding={padding}
          font={props.font}
          color={props.color}
          open={props.open}
        />
      );
      tmpYLabel += spineHeight + padding * 2;
    }
    if (label.title.length > 0 || label.desc.length > 0) {
      elmSub.push(
        <IndexSubject
          textTitle={label.title}
          textDesc={label.desc
            .replace("\r", "\n")
            .split("\n")
            .filter((str) => str.length > 0)}
          x={0}
          y={tmpYSubject}
          width={label.mini ? subjectMinWidth : subjectWidth}
          height={label.mini ? subjectMinHeight : subjectHeight}
          band={band}
          padding={padding}
          font={props.font}
          color={props.color}
          open={props.open}
        />
      );
      tmpYSubject += subjectMinHeight + padding * 2;
    }
  });

  return (
    <>
      <h2>Download</h2>
      <Button
        variant="contained"
        startIcon={<SaveAsIcon />}
        onClick={() => convertSvgToPng(svgId)}
      >
        Download PNG
      </Button>
      <Box sx={{ m: 1 }} />
      <Button
        variant="contained"
        startIcon={<SaveAsIcon />}
        onClick={() => convertSvg(svgId)}
      >
        Download SVG
      </Button>
      <h3>Preview</h3>
      <Container sx={styleFill}>
        <svg
          id={svgId}
          width={width}
          height={height}
          viewBox={`0 ${height / 8} ${width} ${height}`}
          style={styleFill}
        >
          <FontStyleEmbed
            fontFamily={props.font}
            string={props.labels
              .map((data) => "" + data.title + data.spine + data.desc)
              .join("")}
          />

          <rect width={width} height={labelY + padding} fill={props.color} />
          {elmLabel}
          <g transform={`rotate(270) translate(-${labelY}, ${padding})`}>
            {elmSub}
          </g>
        </svg>
      </Container>
    </>
  );
}

function IndexList(props) {
  return (
    <>
      <h2>Settings</h2>
      <Container>
        <Box sx={{ m: 5 }} />
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={10}>
            <List component="nav">
              {props.labels.map((val, i) => {
                return (
                  <IndexListItem
                    key={`label_item_${i}`}
                    openModal={props.openModal}
                    setIndex={props.setIndex}
                    index={i}
                    label={props.labels}
                  />
                );
              })}
            </List>
          </Grid>
          <Grid item xs={3} />
          <Grid item xs={5}>
            {props.labels.length < 3 ? (
              <Button
                variant="contained"
                onClick={() => {
                  props.openModal(-1);
                }}
              >
                追加
              </Button>
            ) : (
              <></>
            )}
          </Grid>
          <Grid item xs={4}>
            <IconButton
              onClick={() => {
                props.openModal2();
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ m: 3 }} />
          </Grid>
          <Grid item xs={5} md={12}></Grid>
          <Grid item xs={8} md={4}>
            <Button
              sx={{ m: 1 }}
              variant="contained"
              component="label"
              size="small"
              startIcon={<UploadIcon />}
              onClick={async () => {
                await importSettings(
                  props.setLabels,
                  props.setColor,
                  props.handleFontChange,
                  props.handleWeightChange
                );
              }}
            >
              Import
            </Button>
          </Grid>
          <Grid item xs={8} md={4}>
            <Button
              sx={{ m: 1 }}
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() =>
                exportSettings(props.labels, props.color, props.font)
              }
            >
              Export
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

function IndexListItem(props) {
  const openModalItem = () => {
    props.setIndex(props.index);
    props.openModal(props.index);
  };

  return (
    <ListItemButton divider onClick={openModalItem}>
      <ListItemText
        primary={
          props.label[props.index].title || props.label[props.index].spine
        }
        secondary={
          props.label[props.index].title
            ? props.label[props.index].spine || props.label[props.index].desc
            : props.label[props.index].desc
        }
      />
      <ListItemIcon>
        <EditIcon />
      </ListItemIcon>
    </ListItemButton>
  );
}

function IndexEdit(props) {
  const upsertLabel = () => {
    const data = {
      title: props.title,
      spine: props.spine,
      desc: props.desc,
      mini: Boolean(props.isMini),
    };
    if (props.index == -1) {
      props.setLabels([...props.labels, data]);
    } else {
      props.setLabels(
        props.labels.map((lb, idx) => (idx === props.index ? data : lb))
      );
    }
    props.handleClose();
  };

  const deleteLabel = () => {
    props.setLabels(props.labels.filter((_l, idx) => idx != props.index));
    props.handleClose();
  };

  return (
    <Container>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack spacing={1}>
            <Container sx={styleFill}>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked={props.isMini}
                      onChange={(e) => {
                        props.setIsMini(e.target.checked);
                      }}
                    />
                  }
                  label="for mini case"
                />
              </FormControl>
            </Container>
            <Container sx={styleFill}>
              <FormControl>
                <InputLabel htmlFor="input0">Title</InputLabel>
                <Input
                  sx={styleWidth}
                  id="input0"
                  aria-describedby="my-helper-text"
                  defaultValue={props.title}
                  onChange={(e) => {
                    props.setTitle(e.target.value);
                  }}
                />
              </FormControl>
            </Container>
            <Container sx={styleFill}>
              <FormControl>
                <InputLabel htmlFor="input1">Spine</InputLabel>
                <Input
                  sx={styleWidth}
                  id="input1"
                  aria-describedby="my-helper-text"
                  defaultValue={props.spine}
                  onChange={(e) => {
                    props.setSpine(e.target.value);
                  }}
                />
              </FormControl>
            </Container>
            <Container sx={styleFill}>
              <FormControl>
                <InputLabel htmlFor="input2">Description</InputLabel>
                <Input
                  sx={styleWidth}
                  id="input2"
                  multiline
                  aria-describedby="my-helper-text"
                  defaultValue={props.desc}
                  onChange={(e) => {
                    props.setDesc(e.target.value);
                  }}
                />
              </FormControl>
            </Container>
            <Container sx={styleRight}>
              <Button variant="contained" onClick={upsertLabel}>
                {props.index == -1 ? "追加" : "更新"}
              </Button>
              <Box sx={{ m: 1 }} />
              {props.index == -1 ? (
                ""
              ) : (
                <Button variant="contained" onClick={deleteLabel}>
                  削除
                </Button>
              )}
            </Container>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
}

function SettingEdit(props) {
  const weightRef = useRef(null);

  return (
    <Container>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack spacing={1}>
            <Container sx={styleFill}>
              <FormControl>
                <InputLabel id="font-selector-label">Font</InputLabel>
                <Select
                  labelId="font-selector-label"
                  value={props.fontIndex}
                  label="Font"
                  onChange={(event) =>
                    props.handleFontChange(event.target.value)
                  }
                >
                  {fontAllowed.map((fonts, idx) => (
                    <MenuItem key={fonts.label} value={idx}>
                      {fonts.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ m: 1, display: "inline" }}></Box>
              <FormControl>
                <InputLabel id="font-weight-selector-label">
                  Font Weight
                </InputLabel>
                <Select
                  labelId="font-weight-selector-label"
                  value={props.weightIndex}
                  label="FontWeight"
                  onChange={(event) =>
                    props.handleWeightChange(event.target.value)
                  }
                >
                  {fontAllowed[props.fontIndex].weight.map((weight, idx) => (
                    <MenuItem key={weight} value={idx}>
                      {weight}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Container>
            <Container sx={styleFill}>
              <MuiColorInput
                fullWidth
                format="hex"
                isAlphaHidden
                value={props.color}
                onChange={(c) => props.setColor(c)}
              />
            </Container>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
}

function App() {
  const [title, setTitle] = useState("");
  const [spine, setSpine] = useState("");
  const [desc, setDesc] = useState("");
  const [isMini, setIsMini] = useState(false);

  const [labels, setLabels] = useState([]);
  const [index, setIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen2(false);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const openModal = (idx) => {
    setIndex(idx);
    setTitle(idx >= 0 && idx < labels.length ? labels[idx].title : "");
    setSpine(idx >= 0 && idx < labels.length ? labels[idx].spine : "");
    setDesc(idx >= 0 && idx < labels.length ? labels[idx].desc : "");
    setIsMini(idx >= 0 && idx < labels.length ? labels[idx].mini : false);
    handleOpen();
  };

  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => {
    setOpen(false);
    setOpen2(true);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };
  const openModal2 = () => {
    handleOpen2();
  };

  const [color, setColor] = useState("#185C44");
  const [font, setFont] = useState("M PLUS Rounded 1c:wght@100");
  const [fontIndex, setFontIndex] = useState(0);
  const [weightIndex, setWeightIndex] = useState(0);
  const handleFontChange = (idx) => {
    if (fontAllowed[idx].weight.length > 1) {
      setFont(
        fontAllowed[idx].label +
          fontWeightJoinToken +
          fontAllowed[idx].weight[0]
      );
    } else {
      setFont(fontAllowed[idx].label);
    }
    setFontIndex(idx);
    setWeightIndex(0);
  };
  const handleWeightChange = (idx) => {
    if (fontAllowed[fontIndex].weight.length > 1) {
      setFont(
        fontAllowed[fontIndex].label +
          fontWeightJoinToken +
          fontAllowed[fontIndex].weight[idx]
      );
    }
    setWeightIndex(idx);
  };

  return (
    <>
      <h1>KATO Book Case Label Generator</h1>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <IndexList
            openModal={openModal}
            openModal2={openModal2}
            setIndex={setIndex}
            labels={labels}
            setLabels={setLabels}
            color={color}
            setColor={setColor}
            font={font}
            handleFontChange={handleFontChange}
            handleWeightChange={handleWeightChange}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <IndexImage
            labels={labels}
            color={color}
            open={open || open2}
            font={font}
          />
        </Grid>
      </Grid>
      <IndexEdit
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
        index={index}
        labels={labels}
        setLabels={setLabels}
        title={title}
        setTitle={setTitle}
        spine={spine}
        setSpine={setSpine}
        desc={desc}
        setDesc={setDesc}
        isMini={isMini}
        setIsMini={setIsMini}
      />
      <SettingEdit
        open={open2}
        font={font}
        setFont={setFont}
        color={color}
        setColor={setColor}
        fontIndex={fontIndex}
        weightIndex={weightIndex}
        handleFontChange={handleFontChange}
        handleWeightChange={handleWeightChange}
        handleOpen={handleOpen2}
        handleClose={handleClose2}
      />
    </>
  );
}

export default App;
