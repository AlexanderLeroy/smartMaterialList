import React, { useState } from 'react';
import * as indexFile from '../index.js';

function MaterialBlock({ item, index }) {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };

  let blockType;

  if (item.crafts && item.crafts.length > 0) {
    blockType = (
      <div className={`table-column ${index % 2 !== 0 ? "table-second-color" : ""}`} onClick={toggleVisibility}  key={index}>
        <div className="table-row table-row-list">
          <i className="block-icon" style={{ backgroundPosition: `${item.posx}px ${item.posy}px` }} />
          <span className="block-info">{item.ru}</span>
          <span className="block-info">
            {item.amount + " = 64 * " + Math.floor(item.amount / 64) +
              " + " + (item.amount - Math.floor(item.amount / 64) * 64) + " = " + (item.amount / 1728).toFixed(1) + " sb"}
          </span>
          <i className={`arrow ${isVisible ? "up" : "down"}`}></i>
        </div>
        <div className={`table-margin-column ${isVisible ? "visible" : "hidden"}`}>
          <CraftsList data={item.crafts} />
        </div>
      </div>
    );
  } else {
    blockType = (
      <div className={`table-row ${index % 2 !== 0 ? "table-second-color" : ""}`} key={index}>
        <i className="block-icon" style={{ backgroundPosition: `${item.posx}px ${item.posy}px` }} />
        <span className="block-info">{item.ru}</span>
        <span className="block-info">
          {item.amount + " = 64 * " + Math.floor(item.amount / 64) +
            " + " + (item.amount - Math.floor(item.amount / 64) * 64) + " = " + (item.amount / 1728).toFixed(1) + " sb"}
        </span>
      </div>
    );
  }

  return blockType;
}

function CraftsList({ data }) {
  return (
    data.map((item, index) => (
      <div className="table-row" key={index}>
        <i className="block-icon" style={{ backgroundPosition: `${item.posx}px ${item.posy}px` }} />
        <span className="block-info">{item.ru}</span>
        <span className="block-info">
          {item.amount + " = 64 * " + Math.floor(item.amount / 64) +
            " + " + (item.amount - Math.floor(item.amount / 64) * 64) + " = " + (item.amount / 1728).toFixed(1) + " sb"}
        </span>
      </div>
    ))
  );
}

export function CreateList({ materialList }) {
  return (
    materialList.map((item, index) => (
      <MaterialBlock key={index} index={index} item={item}/>
    ))
  );
}

export function CreateShema({ schemaList, setMaterialList, setSchemaList }) {
  const removeSchema = (index) => {
    indexFile.removeSchema(index);
    let data = indexFile.getSortedList();
    setMaterialList(data[1]);
    setSchemaList(data[0]);
  }

  return (
    schemaList.map((item, index) => (
      <div className="schema-block" key={index} onClick={() => removeSchema(index)}>
        {item}<span className="cross">&#10006;</span>
      </div>
    ))
  );
}