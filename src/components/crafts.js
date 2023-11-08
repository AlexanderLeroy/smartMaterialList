import React, { useState } from 'react';
import * as indexFile from '../index.js';

export function Presets({setCraftsList}) {
    const setDefault = () => {
        indexFile.setDefaultCrafts();
        setCraftsList(indexFile.getSortedCrafts());
    }
    const setPepeland = () => {
        indexFile.setPepelandCrafts();
        setCraftsList(indexFile.getSortedCrafts());
    }
    const setClear = () => {
        indexFile.clearCrafts();
        setCraftsList(indexFile.getSortedCrafts());
    }

    return (
        <div className="upload-block">
            <div className="upload-control">
            <h1 className="preset-title">Пресеты настроек</h1>
            </div>
            <div className="upload-control">
                <button className="preset-button-default" onClick={setDefault}>Default</button>
                <button className="preset-button-pepeland" onClick={setPepeland}>PepeLand</button>
                <button className="upload-button preset-button-clear" onClick={setClear}>Clear</button>
            </div>
        </div>
    );
}

export function CustomCraft({ item, index, openList, setHighlightBlock, setSecondBlock, setUpdateFunction, setBlocksList, setCraftsList }) {
    const handleInputChange = (event) => {
        let value = event.target.value;
        let num = parseInt(value, 10);

        if (!isNaN(num) && num >= 1 && num <= 64) {
            value = num;
        } else if (num > 64) {
            value = 64;
        } else {
            value = 1;
        }
        //setMaterialAmount(value);
        renderChanges({
            "material": item.materialId,
            "materialAmount": value,
            "result": item.resultId,
            "resultAmount": item.resultAmount
          }, true, true);
    };

    const handleInputChange2 = (event) => {
        let value = event.target.value;
        let num = parseInt(value, 10);

        if (!isNaN(num) && num >= 1 && num <= 64) {
            value = num;
        } else if (num > 64) {
            value = 64;
        } else {
            value = 1;
        }
        renderChanges({
            "material": item.materialId,
            "materialAmount": item.materialAmount,
            "result": item.resultId,
            "resultAmount": value
          }, true, true);
    };

    const materialMinus = (event) => {
        let value = item.materialAmount;
        if (event.shiftKey && value - 5 > 0) {
            value -= 5;
        } else if (value - 1 > 0) {
            value -= 1;
        };
        renderChanges({
            "material": item.materialId,
            "materialAmount": value,
            "result": item.resultId,
            "resultAmount": item.resultAmount
          }, true, true);
    };
    const materialPlus = (event) => {
        let value = item.materialAmount;
        if (event.shiftKey && value + 5 < 65) {
            value += 5;
        } else if (value + 1 < 65) {
            value += 1;
        };
        renderChanges({
            "material": item.materialId,
            "materialAmount": value,
            "result": item.resultId,
            "resultAmount": item.resultAmount
          }, true, true);
    };
    const resultMinus = (event) => {
        let value = item.resultAmount;
        if (event.shiftKey && value - 5 > 0) {
            value -= 5;
        } else if (value - 1 > 0) {
            value -= 1;
        };
        renderChanges({
            "material": item.materialId,
            "materialAmount": item.materialAmount,
            "result": item.resultId,
            "resultAmount": value
          }, true, true);
    };
    const resultPlus = (event) => {
        let value = item.resultAmount;
        if (event.shiftKey && value + 5 < 65) {
            value += 5;
        } else if (value + 1 < 65) {
            value += 1;
        };
        renderChanges({
            "material": item.materialId,
            "materialAmount": item.materialAmount,
            "result": item.resultId,
            "resultAmount": value
          }, true, true);
    };

    const updateMaterial = (id) => { 
        renderChanges({
            "material": id,
            "materialAmount": item.materialAmount,
            "result": item.resultId,
            "resultAmount": item.resultAmount
          }, true, true);
        
    }
    const updateResult = (id) => {
        renderChanges({
            "material": item.materialId,
            "materialAmount": item.materialAmount,
            "result": id,
            "resultAmount": item.resultAmount
        }, true, true);
    }

    const showMaterialList = () => {
        setHighlightBlock(item.materialId);
        setSecondBlock(item.resultId);
        setUpdateFunction([updateMaterial]);
        setBlocksList(indexFile.getSortedBlockList(item.resultId, "", item.materialId));
        openList(true);
    }
    const showResultList = () => {
        setHighlightBlock(item.resultId);
        setSecondBlock(item.materialId);
        setUpdateFunction([updateResult]);
        setBlocksList(indexFile.getSortedBlockList(item.materialId, "", item.resultId));
        openList(true);
    }

    const deleteCraft = () => {
        indexFile.deleteCrafts(index - 1);
        setCraftsList(indexFile.getSortedCrafts());
    }

    const renderChanges = (data, save, render) => {
        if (save) {
            if (index == 0) {
                if (data.material != "" && data.result != "" && data.material != null && data.result != null) {
                    indexFile.saveCrafts(index, data, true);
                } else {
                    indexFile.saveFirst(data);
                }
            } else {
                indexFile.saveCrafts(index - 1, data, false);
            }
        }
        if (render) {
            setCraftsList(indexFile.getSortedCrafts());
        }
    }

    return (
        <div className={`table-row table-row-gap ${index % 2 !== 0 ? "table-second-color" : ""}`} key={index}>
            <div className="block-picker" onClick={showMaterialList}>
                <i className="block-icon" style={{ backgroundPosition: `${item.materialPosx}px ${item.materialPosy}px` }}/>
                <span className="block-info">{item.materialName}</span>
            </div>
            <div className="input-64-block">
                <button className="input-64-button" onClick={materialMinus}>-</button>
                <input className="input-64" type="text" 
                onChange={handleInputChange} value={item.materialAmount}/>
                <button className="input-64-button" onClick={materialPlus}>+</button>
            </div>
            <div className="right"></div>
            <div className="block-picker" onClick={showResultList}>
                <i className="block-icon" style={{ backgroundPosition: `${item.resultPosx}px ${item.resultPosy}px` }}/>
                <span className="block-info">{item.resultName}</span>
            </div>
            <div className="input-64-block">
                <button className="input-64-button" onClick={resultMinus}>-</button>
                <input className="input-64" type="text" 
                onChange={handleInputChange2} value={item.resultAmount}/>
                <button className="input-64-button" onClick={resultPlus}>+</button>
            </div>
            {(index !=0) && <div className="picker-cross" onClick={deleteCraft}>&#10006;</div>}
      </div>
    );
}

function FindBlock({ item, index, changed, updateFunction, openList, setFindStr}) {
    const changeBlock = (event) => {
        if (!changed) {
            updateFunction[0](item.id);
            openList(false);
            setFindStr("");
        }
    }
    return (
        <div className={`table-row ${index % 2 !== 0 ? "table-second-color" : ""} ${changed ? "list-changed" : "list-find"}`}
            onClick={changeBlock} key={index}>
            <i className="block-icon" style={{ backgroundPosition: `${item.posx}px ${item.posy}px` }}/>
            <span className="block-info">{item.ru}</span>
        </div>
    );
}

export function CreateFindList({ blocksList, openList, stateList, highlightBlock, secondBlock, updateFunction, setBlocksList }) {
    const [findStr, setFindStr] = useState("");

    const changeListState = () => {
        openList(false);
        setFindStr("");
    };

    const changeFindStr = (event) => {
        setFindStr(event.target.value);
        setBlocksList(indexFile.getSortedBlockList(secondBlock, event.target.value, highlightBlock));
    };

    return (
        <div>
            <div className={`list-blocks-container ${stateList ? 'slow-visible' : 'slow-hidden'}`}>
                <div className="indent"></div>
                <div className="list-blocks">
                    <input type="text" className="list-blocks-input"
                    onChange={changeFindStr} value={findStr}/>
                    <div className="list-find-container">
                        {blocksList.map((item, index) => (
                            <FindBlock key={index} index={index} item={item} changed={item.id == highlightBlock}
                                updateFunction={updateFunction} openList={openList} setFindStr={setFindStr}/>
                        ))}
                    </div>
                </div>
                <div className="indent"></div>
            </div>
            <div className={`list-blocks-cross ${stateList ? 'slow-visible' : 'slow-hidden'}`}
             onClick={changeListState}>&#10006;</div>
        </div>
    );
}

export function CreateCrafts({ openList, setHighlightBlock, setSecondBlock, setUpdateFunction, setBlocksList, setCraftsList, craftsList }) {
    return (
        craftsList.map((item, index) => (
          <CustomCraft index={index} key={index} item={item} openList={openList} 
          setHighlightBlock={setHighlightBlock} setSecondBlock={setSecondBlock} 
            setUpdateFunction={setUpdateFunction} setBlocksList={setBlocksList}
            setCraftsList={setCraftsList}/>
        ))
    );
}