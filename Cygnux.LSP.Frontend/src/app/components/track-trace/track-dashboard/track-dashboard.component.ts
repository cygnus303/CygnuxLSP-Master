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
        "docketId": "b3106f81-f694-435f-b8d3-2043330da287",
        "docketNo": "6756776",
        "bookingDate": "2025-06-03T00:00:00",
        "fromLocation": "surat",
        "toLocation": "mumbai",
        "customerId": "1a898f96-f8f6-4e22-85d7-765402b4261e",
        "customerName": "vidhi",
        "invoiceNo": "3",
        "transporter": "580414af-5d74-459a-8855-ad65c58464cc",
        "transporterDesc": "Wipro",
        "transportMode": "2",
        "transportModeDesc": "Surface",
        "quantity": 4,
        "entryBy": "1859fd76-8029-40d2-846d-125fc7539e46",
        "entryDate": "2025-06-03T11:48:43.977",
        "currentStatus": "2",
        "currentStatusDesc": "Pick Up",
        "totalCount": 13,
        "podLink": "-"
    },
    {
        "docketId": "b3106f81-f694-435f-b8d3-2043330da287",
        "docketNo": "6756776",
        "bookingDate": "2025-06-03T00:00:00",
        "fromLocation": "surat",
        "toLocation": "mumbai",
        "customerId": "1a898f96-f8f6-4e22-85d7-765402b4261e",
        "customerName": "vidhi",
        "invoiceNo": "3",
        "transporter": "580414af-5d74-459a-8855-ad65c58464cc",
        "transporterDesc": "Wipro",
        "transportMode": "2",
        "transportModeDesc": "Surface",
        "quantity": 4,
        "entryBy": "1859fd76-8029-40d2-846d-125fc7539e46",
        "entryDate": "2025-06-03T11:48:43.977",
        "currentStatus": "2",
        "currentStatusDesc": "Pick Up",
        "totalCount": 13,
        "podLink": "-"
    },
    {
        "docketId": "b3106f81-f694-435f-b8d3-2043330da287",
        "docketNo": "6756776",
        "bookingDate": "2025-06-03T00:00:00",
        "fromLocation": "surat",
        "toLocation": "mumbai",
        "customerId": "1a898f96-f8f6-4e22-85d7-765402b4261e",
        "customerName": "vidhi",
        "invoiceNo": "3",
        "transporter": "580414af-5d74-459a-8855-ad65c58464cc",
        "transporterDesc": "Wipro",
        "transportMode": "2",
        "transportModeDesc": "Surface",
        "quantity": 4,
        "entryBy": "1859fd76-8029-40d2-846d-125fc7539e46",
        "entryDate": "2025-06-03T11:48:43.977",
        "currentStatus": "2",
        "currentStatusDesc": "Pick Up",
        "totalCount": 13,
        "podLink": "-"
    },
    {
        "docketId": "4a147925-39f9-4d20-a6f6-b6c4cc2538d7",
        "docketNo": "8988989",
        "bookingDate": "2025-06-03T00:00:00",
        "fromLocation": "Chad",
        "toLocation": "Niger",
        "customerId": "1a898f96-f8f6-4e22-85d7-765402b4261e",
        "customerName": "vidhi",
        "invoiceNo": "7",
        "transporter": "580414af-5d74-459a-8855-ad65c58464cc",
        "transporterDesc": "Wipro",
        "transportMode": "2",
        "transportModeDesc": "Surface",
        "quantity": 7,
        "entryBy": "1859fd76-8029-40d2-846d-125fc7539e46",
        "entryDate": "2025-06-03T11:48:24.83",
        "currentStatus": "1",
        "currentStatusDesc": "Booked",
        "totalCount": 13,
        "podLink": "-"
    },
    {
        "docketId": "04f95815-325d-4293-a675-5b7ec57cd51d",
        "docketNo": "56757",
        "bookingDate": "2025-06-03T00:00:00",
        "fromLocation": "Sudan",
        "toLocation": "Abeche",
        "customerId": "1a898f96-f8f6-4e22-85d7-765402b4261e",
        "customerName": "vidhi",
        "invoiceNo": "6",
        "transporter": "580414af-5d74-459a-8855-ad65c58464cc",
        "transporterDesc": "Wipro",
        "transportMode": "1",
        "transportModeDesc": "Train",
        "quantity": 6,
        "entryBy": "1859fd76-8029-40d2-846d-125fc7539e46",
        "entryDate": "2025-06-03T11:48:11.593",
        "currentStatus": "4",
        "currentStatusDesc": "In-Transit",
        "totalCount": 13,
        "podLink": "-"
    },
    {
        "docketId": "ef93d696-c186-43d1-843e-5ed71ca9ef95",
        "docketNo": "454545",
        "bookingDate": "2025-06-03T00:00:00",
        "fromLocation": "Salli",
        "toLocation": "Haripura",
        "customerId": "1a898f96-f8f6-4e22-85d7-765402b4261e",
        "customerName": "vidhi",
        "invoiceNo": "54",
        "transporter": "580414af-5d74-459a-8855-ad65c58464cc",
        "transporterDesc": "Wipro",
        "transportMode": "2",
        "transportModeDesc": "Surface",
        "quantity": 5,
        "entryBy": "1859fd76-8029-40d2-846d-125fc7539e46",
        "entryDate": "2025-06-03T11:46:39.433",
        "currentStatus": "5",
        "currentStatusDesc": "Out for Delivered",
        "totalCount": 13,
        "podLink": "-"
    },
    {
        "docketId": "3a551a53-b4a1-4a58-af41-299e652ea0bd",
        "docketNo": "12340",
        "bookingDate": "2025-06-03T00:00:00",
        "fromLocation": "Chad",
        "toLocation": "Niger",
        "customerId": "1a898f96-f8f6-4e22-85d7-765402b4261e",
        "customerName": "vidhi",
        "invoiceNo": "1",
        "transporter": "580414AF-5D74-459A-8855-AD65C58464CC",
        "transporterDesc": "Wipro",
        "transportMode": "2",
        "transportModeDesc": "Surface",
        "quantity": 2,
        "entryBy": "1859fd76-8029-40d2-846d-125fc7539e46",
        "entryDate": "2025-06-03T11:24:28.083",
        "currentStatus": "6",
        "currentStatusDesc": "Delivered",
        "totalCount": 13,
        "podLink": "http://uatlspapi.cygnux.in/PODUpload/1a898f96-f8f6-4e22-85d7-765402b4261e/580414af-5d74-459a-8855-ad65c58464cc/2025-26/JUNE/12340.jpg"
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
          const apiData = response.data;
          this.totalDocket= response.totalCount;
          const mergedData: any[] = [];

          this.dashboardMeta.forEach(meta => {
            const matchedItem = apiData.find((item: any) => item.name === meta.name);

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
