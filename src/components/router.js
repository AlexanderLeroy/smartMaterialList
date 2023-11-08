// AppRouter.js
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as table from './table';
import * as nav from './nav';
import * as body from './body';
import * as crafts from './crafts';
import * as guide from './guide.js';
import * as footer from './footer';
import * as indexFile from '../index.js';

function Home() {
  let data = indexFile.getSortedList();
  const [materialList, setMaterialList] = useState(data[1]);
  const [schemaList, setSchemaList] = useState(data[0]);

  const childComponents = [
      <body.CreateSchemaList childComponents={[<table.CreateShema schemaList={schemaList} 
        setMaterialList={setMaterialList} setSchemaList={setSchemaList}/>] } 
      setMaterialList={setMaterialList} setSchemaList={setSchemaList}/>,
      <body.CreateTableBlock childComponents={[<table.CreateList materialList={materialList}/>]}/>
    ];
  return (
      <React.Fragment>
          <nav.CreateHeader/>
          <body.CreateContentBlock childComponents={childComponents}/>
          <footer.CreateFooter/>
      </React.Fragment>
  );
}

function Crafts() {
  const [isVisibleList, setIsVisibleList] = useState(false);
  const [highlightBlock, setHighlightBlock] = useState("");
  const [secondBlock, setSecondBlock] = useState("");
  const [updateFunction, setUpdateFunction] = useState(null);
  const [blocksList, setBlocksList] = useState([]);
  const [craftsList, setCraftsList] = useState(indexFile.getSortedCrafts());

  const childComponents = [
    <crafts.Presets key="1" setCraftsList={setCraftsList}/>,
    <body.CreateTableBlock key="2" childComponents={[<crafts.CreateCrafts openList={setIsVisibleList} 
      stateList={isVisibleList} setHighlightBlock={setHighlightBlock} 
      setSecondBlock={setSecondBlock} setUpdateFunction={setUpdateFunction}
      setBlocksList={setBlocksList} setCraftsList={setCraftsList} craftsList={craftsList}/>]}/>
  ];

  return (
      <React.Fragment>
          <nav.CreateHeader/>
          <crafts.CreateFindList openList={setIsVisibleList} stateList={isVisibleList} 
          highlightBlock={highlightBlock} updateFunction={updateFunction}
          secondBlock={secondBlock} blocksList={blocksList} setBlocksList={setBlocksList}/>
          <body.CreateContentBlock childComponents={[childComponents]}/>
          <footer.CreateFooter/>
      </React.Fragment>
  );
}

function Guide() {
  const childComponents = [
    <guide.GuideBlock/>
  ];

  return (
    <React.Fragment>
        <nav.CreateHeader/>
        <body.CreateContentBlock childComponents={childComponents}/>
        <footer.CreateFooter/>
    </React.Fragment>
);
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<Home/>}/>
        <Route path="/crafts" element={<Crafts/>}/>
        <Route path="/guide" element={<Guide/>}/>
      </Routes>
    </BrowserRouter>
  );
}