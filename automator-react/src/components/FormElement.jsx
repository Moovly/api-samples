import * as React from "react";
import paragraphs from "lines-to-paragraphs";
import Multiline from "./FormElement/Multiline";
import TextField from "./FormElement/TextField";
import AssetUpload from "./FormElement/AssetUpload";
import VideoUpload from "./FormElement/VideoUpload";

const FormElement = props => {
  switch (props.variable.type) {
    case "text":
      if (props.variable.requirements.multiline) {
        return <Multiline {...props} />;
      }

      return <TextField {...props} />;

    case "image":
      return <AssetUpload {...props} />;

    case "video":
      return <VideoUpload {...props} />;
  }
};

export default FormElement;