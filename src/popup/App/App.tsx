import React from 'react';
import './App.css';
import mockJson from '../../assets/mock.json'
import {Website} from "../Website/Website";
import Chart from "react-apexcharts";


function App() {

    const state = {
        options: {
            labels: ["youtube.com", "google.com.au", "instagram.com", "goodreads.com", "sciencedirect.com", "nationalgeographic.com", "facebook.com"]
        },
        series: [3.76, 1.95, 1.74, 1.3, 0.76, 0.45, 0.39],
    };

  return (
    <div className="App">
      <div className="header">
        <h3 className="title">Quantified student dashboard</h3>
      </div>
      <div>
          <Chart
              options={state.options}
              series={state.series}
              type="donut"
              width="100%"
          />
      </div>
      <div className="list">
          {mockJson
              .sort((a, b) => a.length < b.length ? 1 : -1)
              .map((website, key) =>(
              <div key={key}>
                  <Website favicon={website.favIconUrl} length={website.length} name={website.hostname}/>
              </div>
          ))}
      </div>

    </div>
  );
}

export default App;
