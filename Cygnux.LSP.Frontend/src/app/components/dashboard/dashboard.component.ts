import { Component } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexLegend,
  ApexResponsive,
  ApexFill,
  ApexTitleSubtitle,
  ApexDataLabels
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  fill: ApexFill;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  colors: string[]; // ✅ Add this for custom colors
};


@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
 public chartOptions: ChartOptions;

constructor(private commonService:CommonService){
  this.commonService.activeNavigationUrl.next('Dashboard');

  this.chartOptions = {
      series: [
        {
          name: 'SA',
          data: [44, 55, 41, 67, 22, 43, 21, 49]
        },
        {
          name: 'CUSTOMER',
          data: [13, 23, 20, 8, 13, 27, 33, 12]
        },
        {
          name: 'LSP',
          data: [11, 17, 15, 15, 21, 14, 15, 13]
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        stackType: '100%',
        toolbar: {
          show: false  
        }
      },
      colors: ['#4faad5', '#77a862', '#ffd468'], 
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '8px',
          colors: ['#fff']
        },
        formatter: (val: number) => `${val}%`
      },
      xaxis: {
        categories: [
          '2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4',
          '2012 Q1', '2012 Q2', '2012 Q3', '2012 Q4'
        ],
        labels: {
          style: {
            fontSize: '8px'
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '10px',
        offsetY: 10
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      title: {
        text: 'Sales Distribution by Quarter',
        align: 'center',
        style: {
          fontSize: '8px',
          color: '#333'
        }
      }
    };
  }
}
