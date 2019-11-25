import React from "react";
import { withStyles } from "@material-ui/core/styles";
import socketIOClient from "socket.io-client";

import Chart from "./Chart";

const styles = theme => ({
  "chart-container": {
    height: 400
  }
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      lineChartData: {
        labels: [],
        datasets: [
          {
            type: "line",
            label: "BTC-USD",
            backgroundColor: "rgba(0, 0, 0, 0)",
            lineTension: 0.45,
            data: []
          }
        ]
      },
      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          enabled: true
        },
        scales: {
          xAxes: [
            {
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10
              }
            }
          ]
        }
      }
    };
  }

  componentDidMount() {
    const { endpoint, lineChartData } = this.state;
    const newBtcDataSet = { ...lineChartData.datasets[0] };

    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => {
      newBtcDataSet.data.push(data.lastPrice);
      const newChartData = {
        ...this.state.lineChartData,
        datasets: [newBtcDataSet],
        labels: this.state.lineChartData.labels.concat(
          new Date().toLocaleTimeString()
        )
      };
      this.setState({ lineChartData: newChartData });
    });
  }

  render() {
    const { classes } = this.props;
    const { lineChartData } = this.state;
    return (
      <div className={classes["chart-container"]}>
        {lineChartData.labels.length !== 0 && (
          <Chart
            data={this.state.lineChartData}
            options={this.state.lineChartOptions}
          />
        )}
        {lineChartData.labels === 0 && <p>Loading...</p>}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
