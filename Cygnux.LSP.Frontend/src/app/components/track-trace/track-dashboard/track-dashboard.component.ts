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
import { Router } from "@angular/router";
import { DocketService } from "../../../shared/services/docket.service";
import { ToastrService } from "ngx-toastr";
import { DocketResponse } from "../../../shared/models/docket.model";
import { SignalRService } from "../../../shared/services/signal-r.service";
import { UserService } from "../../../shared/services/user.service";

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
  styleUrls: ['./track-dashboard.component.scss'],
})
export class TrackDashboardComponent {
  public totalDocket: number = 0;
  public chartOptions: ChartOptions;
  public docketCount: DocketCountResponse[] = [];
  public isContentVisible = false;
  public dockets: DocketResponse[] = [];
  public userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
  public dateRange: [Date, Date] = [new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)];
  public searchText: string = '';
  public donutChartOptions: any;
  public users:any;
  public selectedUserId= null;
public filteredUsers: any[] = [];

  dashboardMeta = [
    { name: 'Booked', color: 'red', icon: 'fa-solid fa-book', progress: "progress-gradient-danger", headerColor: 'header-text-danger' },
    { name: 'Pick Up', color: 'orange', icon: 'fa-solid fa-box-open', progress: "progress-gradient-secondary", headerColor: 'header-text-secondary' },
    { name: 'PickUp Approve', color: 'blue', icon: 'fa-solid fa-boxes-packing', progress: "progress-gradient-primary", headerColor: 'header-text-primary' },
    { name: 'In-Transit', color: 'purple', icon: 'fa-solid fa-truck', progress: "progress-gradient-info", headerColor: 'header-text-info' },
    { name: 'Out for Delivered', color: 'teal', icon: 'fa-solid fa-truck-ramp-box', progress: "progress-gradient-warning", headerColor: 'header-text-warning' },
    { name: 'Delivered', color: 'green', icon: 'fa-shipping-fast', progress: "progress-gradient-success", headerColor: 'header-text-success' }
  ];

  constructor(
    public commonService: CommonService,
    public trackTraceService: TrackTraceService,
    private identityService: IdentityService,
    private sweetAlertService: SweetAlertService,
    private docketService: DocketService,
    private toasterService: ToastrService,
    private router: Router,
    private signalRService: SignalRService,
    private userService:UserService

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

  ngOnInit() {
    this.getDockets();
    const fromDate = this.formatDate(this.dateRange[0]);
  const toDate = this.formatDate(this.dateRange[1]);
    this.signalRService.startConnection().then(() => {
      this.signalRService.on('DocketUpdated', (message) => {
        this.getDockets(); // Reload dockets
          this.getDocketCount(fromDate, toDate);
      this.getTransportModeCount(fromDate, toDate);
    });
  });
  this.getUsers()
  }

  onDateRangeSelected(selectedRange: any): void {
    const [fromDate, toDate] = selectedRange;
    const fromdate = this.formatDate(fromDate);
    const todate = this.formatDate(toDate);
    this.getDocketCount(fromdate, todate);
    this.getTransportModeCount(fromdate, todate);
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

slideContentInAndNavigate() {
  this.isContentVisible = !this.isContentVisible;
  setTimeout(() => {
    this.router.navigate(['/track/list'], {
      queryParams: { userId: this.selectedUserId || this.identityService.getLoggedUserId() }
    });
  }, 100);
}


  getDocketCount(fromdate: any, todate: any) {
    this.trackTraceService.getTrackigCountDetail((this.selectedUserId || this.identityService.getLoggedUserId()), fromdate, todate).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.totalDocket = response.totalCount;
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
      },
    })
  }

  getDockets(page: number = 1) {
    this.commonService.updateLoader(true);
    const filters: any = {
      Page: 1,
      PageSize: 100,
    };
    this.docketService.getDocketList((this.selectedUserId || this.identityService.getLoggedUserId()), filters).subscribe({
      next: (response) => {
        if (response) {
          this.dockets = response.data;
        }
        this.commonService.updateLoader(false);
      },
      error: (response: any) => {
        this.toasterService.error(response.error.message);
        this.commonService.updateLoader(false);
      },
    });
  }

  getTransportModeCount(fromdate: any, todate: any) {
    this.trackTraceService.getTransportModeCount((this.selectedUserId || this.identityService.getLoggedUserId()), fromdate, todate).subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
 
      const labels = response.data.map((item: any) => item.transportMode?.toString() ?? 'Unknown');
      const series = response.data.map((item: any) => Number(item.count) || 0);

          const colorMap: { [key: string]: string } = {
            'Train': '#C4FCEF',
            'Surface': '#A1E3D8',
            'AIR': '#7FC8A9'
          };
          const colors = labels.map(label => colorMap[label] || '#cccccc');

          this.donutChartOptions = {
            series: series,
            chart: {
              type: 'donut',
              height: 160,
            },
            labels: labels,
            dataLabels: {
              enabled: false
            },
            legend: {
              show: true,
              position: 'bottom',
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
            colors: colors,
            stroke: {
              show: false
            },
            tooltip: {
              enabled: true
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
        }
      },
      error: (response: any) => {
        this.sweetAlertService.error(response.error.message);
      },
    });
  }



getUsers(page: number = 1) {
  this.commonService.updateLoader(true);
  const filters = { Page: 1, PageSize: '' };
  this.userService.getUserList(this.identityService.getLoggedUserId(), filters).subscribe({
    next: (response) => {
      if (response && response.data) {
        this.users = response.data;
        // Prepare filteredUsers for dropdown
        this.filteredUsers = this.users.map((user: any) => ({
          id: user.id,
          displayName: user.customerName?.trim() ? user.customerName : user.firstName
        }));
      }
      this.commonService.updateLoader(false);
    },
    error: (response: any) => {
      this.commonService.updateLoader(false);
    },
  });
}



onUserChange() {
  const fromDate = this.formatDate(this.dateRange[0]);
  const toDate = this.formatDate(this.dateRange[1]);

  this.getDockets();
  this.getDocketCount(fromDate, toDate);
  this.getTransportModeCount(fromDate, toDate);
}
}
