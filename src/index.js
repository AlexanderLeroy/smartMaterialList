import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import jschardet from  "jschardet";
import blockData from "./blocks.json";
import fixes from "./fixes.json";
import * as routerApp from "./components/router.js";

let craftState = false;
let schemes = [];
//localStorage.clear("schemes");
let schemesGet = JSON.parse(localStorage.getItem("schemes"));
let customCrafts = JSON.parse(localStorage.getItem("crafts"));
if (schemesGet != null) {
  schemesGet.map((item, index) => {
    schemes[index] = {};
    schemes[index].fileName = item.fileName;
    schemes[index].content = [];
    item.content.forEach(el => {
      let info = findBlockInfoId(el.id);
      info.amount = el.amount;
      schemes[index].content.push(info);
    });
  })
}
if (customCrafts == null) {
  customCrafts = [];
}

let firstCraft = {
  "materialName": "Выбор блока",
  "materialId": "",
  "materialAmount": 1,
  "materialPosx": 32,
  "materialPosy": 32,
  "resultName": "Выбор блока",
  "resultId": "",
  "resultAmount": 1,
  "resultPosx": 32,
  "resultPosy": 32
};
const root = ReactDOM.createRoot(document.getElementById("root"));

//Загрузка новых файлов
export function uploadSchemes(files) {
  const promises = [];
  let schemesSave = [];
  if (schemes.length > 0) {
    schemes.map((item, index) => {
      schemesSave[index] = {};
      schemesSave[index].fileName = item.fileName;
      schemesSave[index].content = [];
      item.content.forEach(el => {
        schemesSave[index].content.push({"id": el.id, 
        "amount": el.amount});
      });
    })
  }
  for (const file of files) {
    if (file.name.endsWith(".csv")) {
      const promise = new Promise((resolve, reject) => {
      const reader = new FileReader();
        reader.onload = (event) => {
          const data = event.target.result;
          let encoding = jschardet.detect(data).encoding;
          if (!encoding) {
            encoding = "WINDOWS-1251";
          }
          const decoder = new TextDecoder(encoding);
          const text = decoder.decode(data);
          const lines = text.split("\n");

          if (lines.length > 0) {
            let index = schemes.length;
            
            schemes[index] = {};
            schemes[index].fileName = findFileName(file.name);
            schemes[index].content = [];

            schemesSave[index] = {};
            schemesSave[index].fileName = schemes[index].fileName;
            schemesSave[index].content = [];

            for (let i = 0; i < lines.length; i++) {
              let line = lines[i].trim().replace(/"/g, "").split(",");
              if (line.length > 1) {
                let info = findBlockInfo(line[0]);
                if (info != null) {
                  info.amount = parseInt(line[1]);
                  let id = schemes[index].content.findIndex((schema) => schema.id === info.id);
                  if (id === -1) {
                    schemes[index].content.push(info);
                    schemesSave[index].content.push({"id": info.id, "amount": info.amount});
                  } else {
                    let amount = info.amount;
                    schemes[index].content[id].amount += amount;
                    schemesSave[index].content[id].amount += amount;
                  }
                } else {
                  //console.log(line[0]);
                }
              }
            }
            schemes[index].content.sort((a, b) => b.amount - a.amount);
            schemesSave[index].content.sort((a, b) => b.amount - a.amount);
          }
          localStorage.setItem("schemes", JSON.stringify(schemesSave));
          resolve();
        }

        reader.onerror = () => {
          reject();
        };

        reader.readAsArrayBuffer(file);
      });
      promises.push(promise);
    }
  }
  return Promise.all(promises);
}

export function getSortedList() {
  if (schemes == null) {
    return [];
  }
  let fileNames = [];
  let totalSchemes = [];
  if (craftState) {
    schemes.forEach(el => {
      fileNames.push(el.fileName);
      el.content.forEach(block => {
        let info = Object.assign({}, block);
        //Имеет ли блок способы крафта
        if (checkBlockCraft(info.id)) {
          let blocksForCraft = [];
          let crafts = [info];
         
          do {
            let materials = [];
            crafts.forEach(material => {
              let materialCraft = findBlockCraft(material.id);              
              material.crafts = [];

              //Проверка цикличных крафтов
              let cycleCheck = true;
              if (materialCraft.length > 0) {
                materialCraft.forEach(el => {
                  if (blocksForCraft.findIndex((check) => check === el.material) !== -1) {
                    cycleCheck = false;
                  }
                });
              }
              if (cycleCheck) {
                blocksForCraft.push(material.id);
                if (materialCraft.length > 0) {
                  materialCraft.forEach(newCraft => {
                    let newInfo = findBlockInfoId(newCraft.material);
                    newInfo.amount = Math.ceil(newCraft.materialAmount / newCraft.resultAmount * material.amount);
                    materials.push(newInfo);
                  });
                } else {
                  totalSchemes = addInListWithCraft(totalSchemes, material, info);
                }
              }
            });
            crafts = materials;
          } while (crafts.length > 0);
        } else {
          info.crafts = [];
          totalSchemes = addInList(totalSchemes, info);
        }
      });
    });
  } else {
    schemes.forEach(el => {
      fileNames.push(el.fileName);
      el.content.forEach(block => {
        let info = Object.assign({}, block);
        info.crafts = [];
        totalSchemes = addInList(totalSchemes, info);
      });
    });
  }
  totalSchemes.sort((a, b) => b.amount - a.amount);
  for (let i = 0; i < totalSchemes.length; i++) {
    if (totalSchemes[i].crafts.length > 0) {
      let info = findBlockAmount(totalSchemes[i].id);
      if (info != null) {
        totalSchemes[i].crafts.push(info);
        totalSchemes[i].crafts.sort((a, b) => b.amount - a.amount);
      }
    }
  }
  return [fileNames, totalSchemes]
}

function addInList(array, el) {
  let index = array.findIndex((schema) => schema.id === el.id);
  if (index === -1) {
    array.push(el);
  } else {
    array[index].amount += el.amount;
  }
  return array;
}

function addInListWithCraft(array, el, craft) {
  let index = array.findIndex((schema) => schema.id === el.id);
  if (index === -1) {
    let craftIndex = el.crafts.findIndex((schema) => schema.id === craft.id);
    if (craftIndex === -1) {
      el.crafts.push(craft);
    } else {
      el.crafts[craftIndex].amount += craft.amount;
    }
    array.push(el);
  } else {
    array[index].amount += el.amount;
    let craftIndex = array[index].crafts.findIndex((schema) => schema.id === craft.id);
    if (craftIndex === -1) {
      array[index].crafts.push(craft);
    } else {
      array[index].crafts[craftIndex].amount += craft.amount;
    }
  }
  return array;
}

//Получение кастомных крафтов
export function getSortedCrafts() {
  let crafts = [firstCraft];
    customCrafts.forEach(el => {
      let material = findBlockInfoId(el.material);
      let result = findBlockInfoId(el.result);
      let craft = {
        "materialName": material.ru,
        "materialId": material.id,
        "materialAmount": el.materialAmount,
        "materialPosx": material.posx,
        "materialPosy": material.posy,
        "resultName": result.ru,
        "resultId": result.id,
        "resultAmount": el.resultAmount,
        "resultPosx": result.posx,
        "resultPosy": result.posy
      }
      crafts.push(craft);
    });
  return crafts;
}

//Получение списка блоков для крафтов
export function getSortedBlockList(secondBlock, findStr, highlightBlock) {
  let blocks = [];
  let blocksForCraft = [];
  let blocksForCraft2 = [];
  let crafts = [secondBlock];
  
  while (crafts.length > 0) {
    crafts.forEach(material => {
      let materials = [];

      let materialCraft = findBlockCraft(material);
      if (blocksForCraft.findIndex((check) => check == material) === -1) {
        blocksForCraft.push(material);
        if (materialCraft.length > 0) {
          materialCraft.forEach(newCraft => {
            let newInfo = findBlockInfoId(newCraft.material).id;
            materials.push(newInfo);
          });
        }
      }
      crafts = materials;
    });
  }
  crafts = [secondBlock];
  while (crafts.length > 0) {
    crafts.forEach(material => {
      let materials = [];

      let materialCraft = findBlockMaterial(material);
      if (blocksForCraft2.findIndex((check) => check == material) === -1) {
        blocksForCraft2.push(material);
        if (materialCraft.length > 0) {
          materialCraft.forEach(newCraft => {
            let newInfo = findBlockInfoId(newCraft.result).id;
            materials.push(newInfo);
          });
        }
      }
      crafts = materials;
    });
  }

  let ignoreBlocksRaw = blocksForCraft.concat(blocksForCraft2);
  let ignoreBlocks = removeDuplicates(ignoreBlocksRaw);
  ignoreBlocks.splice(ignoreBlocks.findIndex((check) => check == highlightBlock), 1);

  if (findStr != null || findStr != "") {
    blockData.blocks.forEach(el => {
      if (el.id.toLocaleLowerCase().includes(findStr.toLocaleLowerCase()) || 
      el.ru.toLocaleLowerCase().includes(findStr.toLocaleLowerCase()) || 
      el.en.toLocaleLowerCase().includes(findStr.toLocaleLowerCase())) {
        if ((ignoreBlocks.findIndex((check) => check == el.id) === -1)) {
          blocks.push(el);
        }
      }
    });
  } else {
    blocks = Object.assign({}, blockData.blocks);
  }
  return blocks;
}

//Сохранение изменений в крафтах
export function saveCrafts(key, data, add) {
  if (add) {
    customCrafts.unshift(data);
    localStorage.setItem("crafts", JSON.stringify(customCrafts));
    firstCraft = {
      "materialName": "Выбор блока",
      "materialId": "",
      "materialAmount": 1,
      "materialPosx": 32,
      "materialPosy": 32,
      "resultName": "Выбор блока",
      "resultId": "",
      "resultAmount": 1,
      "resultPosx": 32,
      "resultPosy": 32
    };
  } else {
    customCrafts[key] = data;
    localStorage.setItem("crafts", JSON.stringify(customCrafts));
  }
}

//Сохранение состояния добавления крафта
export function saveFirst(data) {
  let material = findBlockInfoId(data.material);
  let result = findBlockInfoId(data.result);
  if (material == null) {
    material = {
      "ru": "Выбор блока",
      "id": "",
      "posx": 32,
      "posy": 32
    }
  }
  if (result == null) {
    result = {
      "ru": "Выбор блока",
      "id": "",
      "posx": 32,
      "posy": 32
    }
  }
    firstCraft = {
      "materialName": material.ru,
      "materialId": material.id,
      "materialAmount": data.materialAmount,
      "materialPosx": material.posx,
      "materialPosy": material.posy,
      "resultName": result.ru,
      "resultId": result.id,
      "resultAmount": data.resultAmount,
      "resultPosx": result.posx,
      "resultPosy": result.posy
    };
}

//Удаление крафта
export function deleteCrafts(key) {
    customCrafts.splice(key, 1);
    localStorage.setItem("crafts", JSON.stringify(customCrafts));
}

//Переключение отображения материал листа
export function checkCraftState (state) {
  craftState = state;
};

//Удаление файла схемата
export function removeSchema(index) {
  schemes.splice(index, 1);
  let schemesSave = [];
  if (schemes != null) {
    schemes.map((item, index) => {
      schemesSave[index] = {};
      schemesSave[index].fileName = item.fileName;
      schemesSave[index].content = [];
      item.content.forEach(el => {
        schemesSave[index].content.push({"id": el.id, "amount": el.amount});
      });
    })
  }
  localStorage.setItem("schemes", JSON.stringify(schemesSave));
};

//Установка стандартных крафтов
export function setDefaultCrafts() {
  customCrafts = blockData.default;
  localStorage.setItem("crafts", JSON.stringify(customCrafts));
}

//Установка крафтов для ппл
export function setPepelandCrafts() {
  customCrafts = blockData.pepeland;
  localStorage.setItem("crafts", JSON.stringify(customCrafts));
}

//Очистка крафтов
export function clearCrafts() {
  customCrafts = [];
  localStorage.setItem("crafts", JSON.stringify(customCrafts));
}

//Поиск информации о блоке по названию
function findBlockInfo(searchString) {
  if (!blockData) {
    console.error("JSON-данные не загружены");
    return null;
  }
  if (!fixes) {
    console.error("JSON-данные не загружены");
    return null;
  }

  let search = searchString.replace(/§f\?/g, "").trim();
  for (const block of fixes.en) {
    if (block.name.toLocaleLowerCase() === search.toLocaleLowerCase()) {
      search = block.fix;
    }
  }
  for (const block of fixes.ru) {
    if (block.name.toLocaleLowerCase() === search.toLocaleLowerCase()) {
      search = block.fix;
    }
  }
  for (const block of blockData.blocks) {
    if (block.en.toLocaleLowerCase() === search.toLocaleLowerCase() || 
    block.ru.toLocaleLowerCase() === search.toLocaleLowerCase()) {
      return { "id": block.id, "ru": block.ru, "amount": 0, "posx": block.posx, "posy": block.posy };
    }
  }
  return null;
}

//Поиск информации о блоке по названию
function findBlockInfoId(searchString) {
  if (!blockData) {
    console.error("JSON-данные не загружены");
    return null;
  }
  if (searchString == null || searchString == "") {
    return null;
  }
  for (const block of blockData.blocks) { 
    if (block.id.toLocaleLowerCase() == searchString.toLocaleLowerCase()) {
      return { "id": block.id, "ru": block.ru, "amount": 0, "posx": block.posx, "posy": block.posy };
    }
  }
  return null;
}

//Поиск крафта блока
function findBlockCraft(searchString) {
  if (!blockData) {
    console.error("JSON-данные не загружены");
    return [];
  }
  let crafts = [];
  for (const block of customCrafts) {
    if (block.result.toLocaleLowerCase() === searchString.toLocaleLowerCase()) {
      crafts.push({"material": block.material, "materialAmount": block.materialAmount, "result": block.result, "resultAmount": block.resultAmount});
    }
  }
  return crafts;
}

function findBlockMaterial(searchString) {
  if (!blockData) {
    console.error("JSON-данные не загружены");
    return [];
  }
  let crafts = [];
  for (const block of customCrafts) {
    if (block.material.toLocaleLowerCase() === searchString.toLocaleLowerCase()) {
      crafts.push({"material": block.material, "materialAmount": block.materialAmount, "result": block.result, "resultAmount": block.resultAmount});
    }
  }
  return crafts;
}

function checkBlockCraft(searchString) {
  if (!blockData) {
    console.error("JSON-данные не загружены");
    return false;
  }
  for (const block of customCrafts) {
    if (block.result.toLocaleLowerCase() === searchString.toLocaleLowerCase()) {
      return true;
    }
  }
  return false;
}

//Поиск совпадающих имён файлов
function findFileName(fileName) {
  let uniqueFileName = fileName;
  let count = 1;

  while (schemes.some((scheme) => scheme.fileName === uniqueFileName)) {
    const fileNameParts = fileName.split(".");
    const extension = fileNameParts.pop();
    uniqueFileName = `${fileNameParts.join(".")}(${count}).${extension}`;
    count++;
  }

  return uniqueFileName;
}

//Поиск блока в материал листе
function findBlockAmount(id) {
  let info = findBlockInfoId(id);
  if (info != null) {
    for (const files of schemes) {
      for (const file of files.content) {
        if (file.id == id) {
          info.amount += file.amount;
        }
      }
    }
    if (info.amount > 0) {
      return info;
    } else {
      return null;
    }
  } else {
    return null
  }
}

//Удаление повторений из массива
function removeDuplicates(array) {
  return Array.from(new Set(array));
}

//Маршрутизация по странице
root.render(
  <React.StrictMode>
    <routerApp.AppRouter/> 
  </React.StrictMode>
);