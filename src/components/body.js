import React, { useState } from 'react';
import * as indexFile from '../index.js';


export function CreateSchemaList({ childComponents, setMaterialList, setSchemaList}) {
  const fileInputRef = React.useRef(null);

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = async (event) => {
    await indexFile.uploadSchemes(event.target.files);
    let data = indexFile.getSortedList();
    setMaterialList(data[1]);
    setSchemaList(data[0]);
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    indexFile.checkCraftState(event.target.checked);
    let data = indexFile.getSortedList();
    setMaterialList(data[1]);
    setSchemaList(data[0]);
  };

  return (
    <div className="upload-block">
      <div className="upload-control">
        <button className="upload-button" onClick={handleFileInputClick}>Загрузить файл</button>
        <input type="file" id="uploadFile" style={{display: "none"}} multiple accept=".csv" ref={fileInputRef} onChange={handleFileInputChange}/>
        <input type="checkbox" index="switcher" id="switcher" checked={isChecked} onChange={handleCheckboxChange}/>
        <label htmlFor="switcher"></label>
        <span className="switch-title">Ресурсы для крафта</span>
      </div>
      <div className="upload-control schema-control-block">
        {childComponents.map((child, index) => (
            <React.Fragment key={index}>
              {child}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
}

export function CreateTableBlock({childComponents}) {
  return (
    <div className="table-block" index="table">
      {childComponents.map((child, index) => (
          <React.Fragment key={index}>
            {child}
          </React.Fragment>
        ))}
    </div>
  );
}

export function CreateContentBlock(props) {
  return (
    <div className="content-container">
      <div className="indent"></div>
      <div className="main-content">
        {props.childComponents.map((child, index) => (
          <React.Fragment key={index}>
            {child}
          </React.Fragment>
        ))}
      </div>
      <div className="indent"></div>
    </div>
  );
}