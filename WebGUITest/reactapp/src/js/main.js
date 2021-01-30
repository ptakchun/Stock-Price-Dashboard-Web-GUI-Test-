import React,{useState, useEffect} from 'react';
import DataTable from 'react-data-table-component';
import MultiSelect from "react-multi-select-component";
import axios from 'axios';

import '../bootstrap/dist/css/bootstrap.min.css';
import '../stylesheet/App.css';
import {multiSelectOptionToSymbolsList, useInput, API_URL} from './util'
import {tableConfig} from './config'

export const Main = (props) =>{
  const [getTableFunc, setGetTableFunc] = useState(0);
  const [client_config, set_client_config] = useState({"update_frequency_ms": 3000});
  const [update_frequency_ms, update_frequency_ms_user_input, set_update_frequency_ms] = useInput({ type: "text",label:"Data Update Frequency(ms): ", id:"update_frequency_ms" });
  const [update_show_frequency_ms, update_show_frequency_ms_user_input,set_update_show_frequency_ms] = useInput({ type: "text",label:"Show Frequency(ms): ", id:"update_show_frequency_ms" });
  const [number_of_elements, number_of_elements_user_input,set_number_of_elements] = useInput({ type: "text",label:"Elements per update: ", id:"number_of_elements" });
  const [checkedValue, checkedValue_user_input,set_checkedValue] = useInput({ type: "text",label:"Set Value: ", id:"ncheckedValue" });
  const [table, setTable] = useState([]);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [errorMessage_update_show_frequency_ms, setErrorMessage_update_show_frequency_ms] = useState("");
  const [errorMessage_update_frequency_ms, setErrorMessage_update_frequency_ms] = useState("");
  const [errorMessage_number_of_elements, setErrorMessage_number_of_elements] = useState("");
  const [errorMessage_checkedValue, setErrorMessage_checkedValue] = useState("");

  useEffect(()=>{
    set_checkedValue(50);
    set_update_show_frequency_ms(3000);
    handleReloadTable();
    setErrorMessage_update_show_frequency_ms("");
    setErrorMessage_checkedValue("");
    set_update_frequency_ms(props.update_frequency_ms);
    set_number_of_elements(props.number_of_elements);
  },[]);

  useEffect(()=>{
    set_update_frequency_ms(props.update_frequency_ms);
  },[props.update_frequency_ms]);

  useEffect(()=>{
    set_number_of_elements(props.number_of_elements);
  },[props.number_of_elements]);  

  

  
  function handleReloadTable(){
    clearInterval(getTableFunc);
    let user_input = parseInt(update_show_frequency_ms);
    if(Number.isFinite(user_input) && user_input > 0){
      set_client_config({...client_config, "update_frequency_ms":user_input});
      setErrorMessage_update_show_frequency_ms("");
    }else{
      setErrorMessage_update_show_frequency_ms("The input of Show Frequency(ms) is not valid! Please input a positive number");
    }
    let user_input_checkedValue = parseInt(checkedValue);
    if(Number.isFinite(user_input_checkedValue)){
      set_client_config({...client_config, "checkedValue":checkedValue});
      setErrorMessage_checkedValue("");
    }else{
      setErrorMessage_checkedValue("The input of Set Value is not valid! Please input a number");
    }
    
    setGetTableFunc(setInterval(function(){ 
      axios.get(API_URL+"/getTable").then((res)=>{
        // console.log(res);
  
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

  
  
  
  return (
    <div id="Main">
      <h4>Server Configuration:</h4>
      <MultiSelect
        className="MultiSelectSymbol"
        options={props.optionsSymbols}
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
      {checkedValue_user_input}
      <p className="errorMessage">{errorMessage_checkedValue}</p>

      

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
        conditionalRowStyles = {tableConfig.conditionalRowStyles(client_config.checkedValue)}
        dense={true}
        center = {true}
        paginationPerPage={100}
        paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
        />
      </div>
      <br/>
    </div>
  );
}

export default Main;
