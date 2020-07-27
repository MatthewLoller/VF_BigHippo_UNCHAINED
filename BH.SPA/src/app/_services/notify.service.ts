import { Injectable } from "@angular/core";
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: "root",
})
export class NotifyService {
  constructor(private toastr: ToastrService) {}

  success(message: string) {
    this.toastr.success(message, '', {
      timeOut: 4000,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-success alert-with-icon",
      positionClass: 'toast-bottom-right'
    });
  }

  error(message: string) {
    this.toastr.success(message, '', {
      timeOut: 4000,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-danger alert-with-icon",
      positionClass: 'toast-bottom-right'
    });
  }
}
