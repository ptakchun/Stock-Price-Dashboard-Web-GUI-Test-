
//Stock Table configuration
export const tableConfig ={
    columns:[
      {
        name: 'Symbol',
        selector: 'symbol',
      },
      {
        name: 'Price',
        selector: 'price',
        right: true,
      },
    ],
    conditionalRowStyles:(setValue) =>[
      {
        when: row => setValue<row.price,
        style:{
          color: "green"
        },
      },
      {
        when: row => setValue>row.price,
        style:{
          color: "red"
        },
      },    
    ],
  };

  export const historicalPriceTableConfig = {
    columns:[
      {
        name: 'Time',
        selector: 'time',
      },
      {
        name: 'Price',
        selector: 'price',
        right: true,
      },
    ],
  };

  
