import React,{useState, useEffect} from 'react';
import DataTable from 'react-data-table-component';
import MultiSelect from "react-multi-select-component";
import axios from 'axios';

import './bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {symbolsListToMultiSelectOption, multiSelectOptionToSymbolsList, useInput} from './src/util'
import {tableConfig, historicalPriceTableConfig} from './src/config'

import Select from 'react-select'

const API_URL = 'http://localhost:3000';


const App = (props) =>{
  const [getTableFunc, setGetTableFunc] = useState(0);
  const [client_config, set_client_config] = useState({"update_frequency_ms": 3000});
  const [update_frequency_ms, update_frequency_ms_user_input, set_update_frequency_ms] = useInput({ type: "text",label:"Data Update Frequency(ms): ", id:"update_frequency_ms" });
  const [update_show_frequency_ms, update_show_frequency_ms_user_input,set_update_show_frequency_ms] = useInput({ type: "text",label:"Show Frequency(ms): ", id:"update_show_frequency_ms" });
  const [number_of_elements, number_of_elements_user_input,set_number_of_elements] = useInput({ type: "text",label:"Elements per update: ", id:"number_of_elements" });
  const [table, setTable] = useState([]);
  const [historicalPriceTable, setHistoricalPriceTable] = useState([]);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [optionsSymbols, setOptionsSymbols] = useState([]);
  const [errorMessage_update_show_frequency_ms, setErrorMessage_update_show_frequency_ms] = useState("");
  const [errorMessage_update_frequency_ms, setErrorMessage_update_frequency_ms] = useState("");
  const [errorMessage_number_of_elements, setErrorMessage_number_of_elements] = useState("");
  const [selectedSymbolReplay, setSelectedSymbolReplay] = useState(null); 

  useEffect(()=>{
    set_update_show_frequency_ms(3000);
    getServerConfig();
    handleReloadTable();
    setErrorMessage_update_show_frequency_ms("");
  },[]);

  useEffect(()=>{
    if(selectedSymbolReplay){
      axios.post(API_URL+"/getHistoricalPriceTable", {symbol:selectedSymbolReplay.value}).then((res)=>{
        console.log(res);
  
        setHistoricalPriceTable(res.data);
  
      }); 
    }
    
  },[selectedSymbolReplay]);

  
  function handleReloadTable(){
    clearInterval(getTableFunc);
    let user_input = parseInt(update_show_frequency_ms);
    if(Number.isFinite(user_input) && user_input > 0){
      set_client_config({...client_config, "update_frequency_ms":user_input});
      setErrorMessage_update_show_frequency_ms("");
    }else{
      setErrorMessage_update_show_frequency_ms("The input of Show Frequency(ms) is not valid! Please input a positive number");
    }
    
    setGetTableFunc(setInterval(function(){ 
      axios.get(API_URL+"/getTable").then((res)=>{
        console.log(res);
  
        setTable((table)=>{
          let result = res.data;
          let n = res.data.length < table.length? res.data.length:table.length;
          for(let i=0; i<n; i++){
            result[i]["prev_price"] = table[i]['price'];
          }
          return result;
        });

      }); 
    }, client_config['update_frequency_ms']));

  }

  function handleServerConfig(){
    let server_config = {};
    let user_input_update_frequency_ms = parseInt(update_frequency_ms);
    let isError = false;
    if(Number.isFinite(user_input_update_frequency_ms) && user_input_update_frequency_ms > 0 ){
      server_config["update_frequency_milliseconds"] = user_input_update_frequency_ms;
      setErrorMessage_update_frequency_ms("");
    }else{
      isError = true;
      setErrorMessage_update_frequency_ms("The input of Data Update Frequency(ms) is not valid! Please input a positive number");
    }
    if(Number.isFinite(parseInt(number_of_elements))){
      server_config["elements_per_update"] = parseInt(number_of_elements)
      setErrorMessage_number_of_elements("");
    }else{
      isError = true;
      setErrorMessage_number_of_elements("The input of Elements per update is not valid! Please input a positive number");
    }
    if(isError){
      return;
    }
    server_config["symbols"] = multiSelectOptionToSymbolsList(selectedSymbols);
    console.log(server_config);
    axios.post(API_URL+'/setServerConfig',server_config).then(function(response){
      console.log("success update");
      console.log(response);
    });
  }

  function getServerConfig(){
    axios.get(API_URL+'/getServerConfig').then(function(res){
      console.log(res);
      let arr = symbolsListToMultiSelectOption(res.data.available_symbols);
      console.log(arr);
      setOptionsSymbols(arr); 
      // setSelectedSymbols(symbolsListToMultiSelectOption(arr));
      set_number_of_elements(res.data.elements_per_update); 
      set_update_frequency_ms(res.data.update_frequency_milliseconds);
    });
  }

  
  
  
  return (
    <div id="App">
      <h1>Web GUI</h1>
      <br/>
      <div>

      </div>
      <h4>Server Configuration:</h4>
      <MultiSelect
        className="MultiSelectSymbol"
        options={optionsSymbols}
        value={selectedSymbols}
        onChange={setSelectedSymbols}
        labelledBy={"Select Symbols"}
        overrideStrings = {{
          "selectSomeItems": "Select Symbols...",
          "allItemsAreSelected": "All Symbols are selected.",
          "selectAll": "Select All",
          "search": "Search symbols...",
          "clearSearch": "Clear Search"
        }}
      />
      {update_frequency_ms_user_input}
      <p className="errorMessage">{errorMessage_update_frequency_ms}</p>
      {number_of_elements_user_input}
      <p className="errorMessage">{errorMessage_number_of_elements}</p>
      <button className="mainButton btn btn-outline-info" onClick={()=>handleServerConfig()}>
        Update Server Config
      </button>
      <br/>
      <br/>
      <h4>Client GUI Configuration:</h4>
      {update_show_frequency_ms_user_input}
      <p className="errorMessage">{errorMessage_update_show_frequency_ms}</p>
      

      <button className=" mainButton btn btn-outline-info" onClick={()=>handleReloadTable()}>
        Reload Table
      </button>
      <br/>
      <br/>


      <div>
        <DataTable
        title="Stock Price Table"
        columns={tableConfig.columns}
        data={table}
        pagination={true}
        striped={true}
        conditionalRowStyles = {tableConfig.conditionalRowStyles}
        dense={true}
        center = {true}
        paginationPerPage={100}
        paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
        />
      </div>
      <br/>
      <div>
          <Select 
          className="selectSymbolReplay"
          options={optionsSymbols}
          onChange={setSelectedSymbolReplay}
          value={selectedSymbolReplay}
          />
          <br/>
          <DataTable
          title="Historical Price Table (5 min ago)"
          columns={historicalPriceTableConfig.columns}
          data={historicalPriceTable}
          pagination={true}
          striped={true}
          dense={true}
          center = {true}
          paginationPerPage={100}
          paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
          defaultSortField={"Time"}
          />

      </div>
    </div>
  );
}

export default App;
