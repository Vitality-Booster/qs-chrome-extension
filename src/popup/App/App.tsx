import React, {useEffect, useState} from 'react';
import './App.css';
import mockJson from '../../assets/mock.json'
import {Website} from "../Website/Website";
import Chart from "react-apexcharts";
import {OverallWebsite} from "../../types/statistics";
import {getOverallWebsites, getWebsiteStats} from "../../helpers/statistics";

interface ChartState {
    options: {
        labels: string[]
    },
    series: number[]
}

function App() {
    const [statistics, setStatistics] = useState<OverallWebsite[] | null>(null)
    const [chartState, setChartState] = useState<ChartState | null>(null)

    useEffect(() => {
        async function getWebsiteStatistics() {
            let data: OverallWebsite[] | null = await getOverallWebsites()
            if (!data) {
                data = await getWebsiteStats()
            }

            const labels: string[] = []
            const series: number[] = []
            
            data.forEach(st => {
                labels.push(st.hostname)
                series.push(st.length)
            })

            console.log("The labels that I collected: " + JSON.stringify(labels))
            console.log("The series that I collected: " + JSON.stringify(series))

            setChartState({options: {labels: labels}, series: series})
            setStatistics(data)
        }

        getWebsiteStatistics()
    }, []);

    // const state = {
    //     options: {
    //         labels: ["youtube.com", "google.com.au", "instagram.com", "goodreads.com", "sciencedirect.com", "nationalgeographic.com", "facebook.com"]
    //     },
    //     series: [3.76, 1.95, 1.74, 1.3, 0.76, 0.45, 0.39],
    // };

  return (
    <div className="App">
      <div className="header">
        <h3 className="title">Quantified student dashboard</h3>
      </div>
        { chartState && <div>
          <Chart
              options={chartState.options}
              series={chartState.series}
              type="donut"
              width="100%"
          />
        </div> }
      <div className="list">
          {statistics && 
              statistics.map((website, key) =>(
              <div key={key}>
                  <Website overallWebsite={website}/>
              </div>
          ))}
      </div>

    </div>
  );
}

export default App;
