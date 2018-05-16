import React from 'react';
import paragraphs from 'lines-to-paragraphs';

const FormElement = (props) => {
  switch (props.variable.type) {
    case 'text':
      if (props.variable.requirements.multiline) {
        return (<Multiline {...props} />);

      }

      return (<TextField {...props} />);

    case 'image':
      return (<AssetUpload {...props} />);

    case 'video':
      return (<VideoUpload {...props} />);
  }
};

export default FormElement;


const TextField = (props) => {
  return (
    <div className="form-element">
      <label htmlFor={props.variable.id + props.externalId}>{props.variable.name}</label>
      <input
        type="text"
        id={props.variable.id + props.externalId}
        onChange={(e) => props.setValue(props.externalId, props.variable.id, paragraphs(e.target.value))}
        pattern={`.{${props.variable.requirements.minimum_length},${props.variable.requirements.maximum_length}}`}
        placeholder={`Minimum: ${props.variable.requirements.minimum_length}, Maximum: ${props.variable.requirements.maximum_length}`}
        required
      />
    </div>
  );
};

const Multiline = (props) => {
  return (
    <div className="form-element">
      <label htmlFor={props.variable.id + props.externalId}>{props.variable.name}</label>
      <textarea
        id={props.variable.id + props.externalId}
        onChange={(e) => props.setValue(props.externalId, props.variable.id, paragraphs(e.target.value))}
        placeholder={`Minimum: ${props.variable.requirements.minimum_length}, Maximum: ${props.variable.requirements.maximum_length}`}
        required
      />
    </div>
  );
};


const AssetUpload = () => {

};

const VideoUpload = () => {

};