import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { CommonService } from "../../../shared/services/common.service";

export type ChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  yaxis?: ApexYAxis;
  xaxis?: ApexXAxis;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  stroke?: ApexStroke;
  legend?: ApexLegend;
};

@Component({
  selector: 'app-track-dashboard',
  templateUrl: './track-dashboard.component.html',
  styleUrls: ['./track-dashboard.component.scss']
})
export class TrackDashboardComponent {
  public chartOptions: ChartOptions;
public donutChartOptions: any = {
    series: [44, 55, 41],
    chart: {
      type: 'donut',
      height: 300
    },
    
    labels: ['Train', 'Surface', 'AIR'],
     legend: {
    position: 'bottom' // <--- this moves the legend below the chart
  },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 600
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  constructor(
     public commonService: CommonService,
  ) {
    this.commonService.activeNavigationUrl.next('Track Trace');
    this.chartOptions = {
      series: [
        {
          name: "customer",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
          name: "LSP",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        },
        {
          name: "Free Cash Flow",
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadiusApplication: "end"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]
      },
      yaxis: {
        title: {
          text: "$ (thousands)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return "$ " + val + " thousands";
          }
        }
      }
    };
  }
}
