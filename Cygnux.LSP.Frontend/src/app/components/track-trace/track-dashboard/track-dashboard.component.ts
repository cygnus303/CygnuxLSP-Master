import { Component } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
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
import { TrackTraceService } from "../../../shared/services/track-trace.service";
import { IdentityService } from "../../../shared/services/identity.service";
import { SweetAlertService } from "../../../shared/services/toastr.service";
import { DocketCountResponse } from "../../../shared/models/trackTrace.model";

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
  public totalDocket:number = 0;
  public chartOptions: ChartOptions;
  public docketCount:DocketCountResponse[]=[];
  public userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
  public dateRange: [Date, Date] = [new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)];
  public donutChartOptions: any = {
    series: [44, 55, 41],
    chart: {
      type: 'donut',
      height: 160,
    },
    labels: ['Train', 'Surface', 'AIR'],
    dataLabels: {
      enabled: false
    },
    legend: {
      show: true,              // ✅ Show the legend
      position: 'bottom',      // ✅ Display it below the chart
      fontSize: '14px',
      fontWeight: 400,
      markers: {
        width: 10,
        height: 10,
        radius: 12,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    colors: ['#7FC8A9', '#A1E3D8', '#C4FCEF'],
    stroke: {
      show: false
    },
    tooltip: {
      enabled: false
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 250
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };
  dashboardMeta = [
    { name: 'Booked', color: 'red', icon: 'fa-solid fa-book', progress:"progress-gradient-danger" ,headerColor:'header-text-danger'},
    { name: 'Pick Up', color: 'orange', icon: 'fa-solid fa-box-open' ,progress:"progress-gradient-secondary",headerColor:'header-text-secondary'},
    { name: 'PickUp Approve', color: 'blue', icon: 'fa-solid fa-boxes-packing',progress:"progress-gradient-primary",headerColor:'header-text-primary' },
    { name: 'In-Transit', color: 'purple', icon: 'fa-solid fa-truck' ,progress:"progress-gradient-info",headerColor:'header-text-info'},
    { name: 'Out for Delivered', color: 'teal', icon: 'fa-solid fa-truck-ramp-box' ,progress:"progress-gradient-warning",headerColor:'header-text-warning'},
    { name: 'Delivered', color: 'green', icon: 'fa-shipping-fast' ,progress:"progress-gradient-success",headerColor:'header-text-success'}
  ];

  dockets=[
        {
            "docketNo": "6756776",
            "bookingDate": "2025-06-03T00:00:00",
            "fromLocation": "surat",
            "toLocation": "mumbai",
            "customerName": "vidhi",
            "transporterDesc": "Wipro",
            "transportMode": "2",
            "transportModeDesc": "Surface",
            "quantity": 4,
            "currentStatusDesc": "Pick Up",
        },
        {
            "docketNo": "6756776",
            "bookingDate": "2025-06-03T00:00:00",
            "fromLocation": "surat",
            "toLocation": "mumbai",
            "customerName": "vidhi",
            "invoiceNo": "3",
            "transporterDesc": "Wipro",
            "transportMode": "2",
            "transportModeDesc": "Surface",
            "quantity": 4,
            "currentStatusDesc": "Pick Up",
        },
        {
            "docketNo": "6756776",
            "bookingDate": "2025-06-03T00:00:00",
            "fromLocation": "surat",
            "toLocation": "mumbai",
            "customerName": "vidhi",
            "invoiceNo": "3",
            "transporterDesc": "Wipro",
            "transportMode": "2",
            "transportModeDesc": "Surface",
            "quantity": 4,
            "currentStatusDesc": "Pick Up",
        },
        {
            "docketNo": "8988989",
            "bookingDate": "2025-06-03T00:00:00",
            "fromLocation": "Chad",
            "toLocation": "Niger",
            "customerName": "vidhi",
            "invoiceNo": "7",
            "transporterDesc": "Wipro",
            "transportMode": "2",
            "transportModeDesc": "Surface",
            "quantity": 7,
            "currentStatusDesc": "Booked",
        },
        {
            "docketNo": "56757",
            "bookingDate": "2025-06-03T00:00:00",
            "fromLocation": "Sudan",
            "toLocation": "Abeche",
            "customerName": "vidhi",
            "invoiceNo": "6",
            "transporterDesc": "Wipro",
            "transportMode": "1",
            "transportModeDesc": "Train",
            "quantity": 6,
            "currentStatusDesc": "In-Transit",
        },
        {
            "docketNo": "454545",
            "bookingDate": "2025-06-03T00:00:00",
            "fromLocation": "Salli",
            "toLocation": "Haripura",
            "customerName": "vidhi",
            "invoiceNo": "54",
            "transporterDesc": "Wipro",
            "transportMode": "2",
            "transportModeDesc": "Surface",
            "quantity": 5,
            "currentStatusDesc": "Out for Delivered",
        },
        {
            "docketNo": "12340",
            "bookingDate": "2025-06-03T00:00:00",
            "fromLocation": "Chad",
            "toLocation": "Niger",
            "customerName": "vidhi",
            "invoiceNo": "1",
            "transporterDesc": "Wipro",
            "transportMode": "2",
            "transportModeDesc": "Surface",
            "quantity": 2,
            "currentStatusDesc": "Delivered",
        }
    ]

  constructor(
     public commonService: CommonService,
     public trackTraceService:TrackTraceService,
     private identityService:IdentityService,
     private sweetAlertService:SweetAlertService
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
        }
      ],
      chart: {
        type: "bar",
        height: 290 
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

onDateRangeSelected(selectedRange: any): void {
  const [fromDate, toDate] = selectedRange;
  const fromdate = this.formatDate(fromDate);
  const todate = this.formatDate(toDate);
  this.getDocketCount(fromdate, todate);
}

formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

  getDocketCount(fromdate:any, todate:any){
    this.trackTraceService.getTrackigCountDetail(this.identityService.getLoggedUserId(),fromdate,todate).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.totalDocket= response.totalCount;
          const mergedData: any[] = [];

          this.dashboardMeta.forEach(meta => {
            const matchedItem = response.data.find((item: any) => item.name === meta.name);
            mergedData.push({
              name: meta.name,
              icon: meta.icon,
              color: meta.color,
              progress: meta.progress,
              headerColor: meta.headerColor,
              count: matchedItem ? matchedItem.count : 0,
            });
          });

          this.docketCount = mergedData;
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },})
  }
}
