
import React,{useState} from 'react';

export const API_URL = 'http://localhost:3000';

export function symbolsListToMultiSelectOption(arr){
    let output = [];
    for(let i =0; i<arr.length;++i){
      output.push({label: arr[i], value:arr[i]});
    }
    return output;
  }

 export function multiSelectOptionToSymbolsList(arr){
    let output = [];
    for(let i =0; i<arr.length;++i){
      output.push(arr[i].value);
    }
    return output;
  }

export function useInput({ type, label, id }) {
    const [value, setValue] = useState("");
    
    const input = (<div><label for={id}>{label}</label>
                    <input id={id} className="textInput" value={value} onChange={e => setValue(e.target.value)} type={type} />
                  </div>);
    return [value, input,setValue];
  }