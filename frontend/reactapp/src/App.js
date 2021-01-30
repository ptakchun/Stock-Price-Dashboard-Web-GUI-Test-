import React,{useState, useEffect} from 'react';
import axios from 'axios';

import './bootstrap/dist/css/bootstrap.min.css';
import './stylesheet/App.css';

import {symbolsListToMultiSelectOption, API_URL} from './js/util'
import {HistTable} from "./js/histTable"
import {Main} from "./js/main"



const App = (props) =>{
  const [optionsSymbols, setOptionsSymbols] = useState([]);
  const [number_of_elements, set_number_of_elements] = useState(10);
  const [update_frequency_ms, set_update_frequency_ms] = useState(1000);

  useEffect(()=>{
    getServerConfig();
    
  },[]);

  function getServerConfig(){
    axios.get(API_URL+'/getServerConfig').then(function(res){
      // console.log(res);
      let arr = symbolsListToMultiSelectOption(res.data.available_symbols);
      // console.log(arr);
      setOptionsSymbols(arr); 
      // setSelectedSymbols(symbolsListToMultiSelectOption(arr));
      set_number_of_elements(res.data.elements_per_update); 
      set_update_frequency_ms(res.data.update_frequency_milliseconds);
    });
  }

  return (
    <div id="App">
      <h1>Stock Price Dashoard</h1>
      <br/>
        <Main
        optionsSymbols = {optionsSymbols}
        number_of_elements = {number_of_elements}
        update_frequency_ms = {update_frequency_ms}
        />
      <br/>
      <div>
          <HistTable 
          optionsSymbols = {optionsSymbols}
          />

      </div>
    </div>
  );
}

export default App;
