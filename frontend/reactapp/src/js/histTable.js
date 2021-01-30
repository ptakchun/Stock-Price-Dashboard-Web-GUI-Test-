import React,{useState, useEffect} from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';

import '../bootstrap/dist/css/bootstrap.min.css';
import '../stylesheet/App.css';
import {historicalPriceTableConfig} from './config'
import {API_URL} from './util'

import Select from 'react-select'


export const HistTable = (props) =>{
  const [historicalPriceTable, setHistoricalPriceTable] = useState([]);
  const [selectedSymbolReplay, setSelectedSymbolReplay] = useState(null); 

  useEffect(()=>{
    if(selectedSymbolReplay){
      axios.post(API_URL+"/getHistoricalPriceTable", {symbol:selectedSymbolReplay.value}).then((res)=>{
        console.log(res);
        setHistoricalPriceTable(res.data);
      }); 
    }
    
  },[selectedSymbolReplay]);

  return (
    <div id="HistTable">
      <div>
          <Select 
          className="selectSymbolReplay"
          options={props.optionsSymbols}
          onChange={setSelectedSymbolReplay}
          value={selectedSymbolReplay}
          />
          <br/>
          <DataTable
          title="Historical Price Table (5 mins ago)"
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

export default HistTable;
