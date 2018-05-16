import * as React from "react";
import paragraphs from "lines-to-paragraphs";

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

const TextField = ({ variable, externalId, setValue }) => (
  <div className="form-element">
    <label htmlFor={variable.id + externalId}>{variable.name}</label>
    <input
      type="text"
      id={variable.id + externalId}
      onChange={e => setValue(externalId, variable.id, paragraphs(e.target.value))}
      pattern={`.{${variable.requirements.minimum_length},${variable.requirements.maximum_length}}`}
      placeholder={`Minimum: ${variable.requirements.minimum_length}, Maximum: ${variable.requirements.maximum_length}`}
      required
    />
  </div>
);

const Multiline = ({ variable, externalId, setValue }) => (
  <div className="form-element">
    <label htmlFor={variable.id + externalId}>{variable.name}</label>
    <textarea
      id={variable.id + externalId}
      onChange={e => setValue(externalId, variable.id, paragraphs(e.target.value))}
      placeholder={`Minimum: ${variable.requirements.minimum_length}, Maximum: ${variable.requirements.maximum_length}`}
      required
    />
  </div>
);

const AssetUpload = () => {};

const VideoUpload = () => {};
