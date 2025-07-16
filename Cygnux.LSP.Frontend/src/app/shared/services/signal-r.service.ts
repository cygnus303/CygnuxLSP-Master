import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SignalRService {

  //  private hubConnection!: signalR.HubConnection;

  // public startConnection(): void {
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl('http://localhost:5116/roleHub')
  //     .withAutomaticReconnect()
  //     .build();

  //   this.hubConnection
  //     .start()
  //     .then(() => console.log('SignalR Connected'))
  //     .catch(err => console.error('SignalR error:', err));
  // }

  // public onRoleListUpdate(callback: (message: string) => void): void {
  //   this.hubConnection.on('RoleListUpdated', callback);
  // }

//   private hubConnection!: signalR.HubConnection;

// startConnection() {
//   this.hubConnection = new signalR.HubConnectionBuilder()
//     .withUrl("http://localhost:5116/customerLspHub", {
//       withCredentials: true
//     })
//     .withAutomaticReconnect()
//     .build();

//   this.hubConnection
//     .start()
//     .then(() => console.log("SignalR Connected"))
//     .catch(err => console.log("Error: ", err));
// }

// // ✅ Only ONE method needed now
// onLspMappingListUpdated(callback: (message: string) => void) {
//   this.hubConnection.on("LspMappingListUpdated", callback);
// }



// private hubConnection!: signalR.HubConnection;

//   public startConnection(): Promise<void> {
//    this.hubConnection = new signalR.HubConnectionBuilder()
//   .withUrl('https://uatlspapi.cygnux.in/signalRHub', {
//     withCredentials: true
//   })
//   .withAutomaticReconnect()
//   .build();


//     return this.hubConnection
//       .start()
//       .then(() => console.log("✅ SignalR Connected"))
//       .catch(err => {
//         console.error("SignalR Connection Error:", err);
//         throw err;
//       });
//   }

//   public on(eventName: string, callback: (data: any) => void): void {
//     if (!this.hubConnection) {
//       console.error("SignalR connection not started yet");
//       return;
//     }
//     this.hubConnection.on(eventName, callback);
//   }
}
