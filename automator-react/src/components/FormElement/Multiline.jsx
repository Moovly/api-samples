import * as React from 'react';
import paragraphs from "lines-to-paragraphs";

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

export default Multiline;