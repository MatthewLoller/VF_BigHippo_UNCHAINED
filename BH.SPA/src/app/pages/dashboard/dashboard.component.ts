import { Component, OnInit } from "@angular/core";
import Chart from "chart.js";
import { ActivatedRoute } from '@angular/router';
import { Hippo } from 'src/app/_objects/models/hippo';

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  public canvas: any;
  public ctx;
  public datasets: any;
  public data: any;
  public myChartData;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;

  public hippos: Hippo[] = [];
  public locLabels: any[] = [];
  public locValues: any[] = [];
  public hippoCount: number = 0;

  constructor(    
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.hippos = data["data"];
      this.hippoCount = this.hippos.length;
    });

    this.getLocationStats();    

    var gradientBarChartConfiguration: any = {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },

      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.1)",
              zeroLineColor: "transparent",
            },
            ticks: {
              suggestedMin: 0,
              suggestedMax: 10,
              padding: 20,
              fontColor: "#9e9e9e",
            },
          },
        ],

        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              color: "rgba(29,140,248,0.1)",
              zeroLineColor: "transparent",
            },
            ticks: {
              padding: 20,
              fontColor: "#9e9e9e",
            },
          },
        ],
      },
    };

    this.canvas = document.getElementById("CountryChart");
    this.ctx = this.canvas.getContext("2d");
    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
    gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
    gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

    var myChart = new Chart(this.ctx, {
      type: "bar",
      responsive: true,
      legend: {
        display: false,
      },
      data: {
        labels: this.locLabels,
        datasets: [
          {
            label: "Locations",
            fill: true,
            backgroundColor: gradientStroke,
            hoverBackgroundColor: gradientStroke,
            borderColor: "#1f8ef1",
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: this.locValues,
          },
        ],
      },
      options: gradientBarChartConfiguration,
    });
  }

  getLocationStats() {
    let lookup = {};
    let items = this.hippos;
    let result = [];

    items.forEach(element => {
      var location = element.location;

      if (!(location in lookup)) {
        lookup[location] = 1;
        result.push(location);
      }
    });

    this.locLabels = result;

    this.locLabels.forEach(el => {
      let count = 0;

      this.hippos.forEach(e => {
        if (e.location === el) {
          count++;
        }
      });

      this.locValues.push(count);    
    });

  }

  public updateOptions() {
    this.myChartData.data.datasets[0].data = this.data;
    this.myChartData.update();
  }
}
