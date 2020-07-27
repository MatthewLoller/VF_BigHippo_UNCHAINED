import { Component, OnInit, ViewChild } from "@angular/core";
import { HippoService } from "src/app/_services/hippo.service";
import { Hippo } from "src/app/_objects/models/hippo";
import { ActivatedRoute } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { Guid } from "guid-typescript";
import { NotifyService } from 'src/app/_services/notify.service';

@Component({
  selector: "app-hippomanager",
  templateUrl: "./hippomanager.component.html",
  styleUrls: ["./hippomanager.component.scss"],
})
export class HippomanagerComponent implements OnInit {
  @ViewChild("table") table: DatatableComponent;
  rows = [];
  columns = [
    { prop: "id" },
    { name: "Name" },
    { name: "Species" },
    { name: "Location" },
    { name: "Food" },
  ];

  editField: string;
  hippos: Hippo[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private _hippoService: HippoService,
    private _notifyService: NotifyService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.hippos = data["data"];
    });
  }

  remove(id: any) {
    console.log(id)

    let hippoToDelete: Hippo = this.hippos[id];

    console.log('hippo to delete', hippoToDelete)

    this._hippoService.deleteHippo(hippoToDelete.id).subscribe(res => {      
      this.hippos.splice(id, 1);
      this._notifyService.success('Hippo Deleted: ' + hippoToDelete.name)
    }, error => {
      this._notifyService.error('An ERROR has occured when trying to remove' + hippoToDelete.name)
    });
  }

  add() {
    let emptyHippo: Hippo = {
      id: Guid.create().toString(),
      name: '',
      species: '',
      location: '',
      food: '',
      edited: false
    }

    this.hippos.push(emptyHippo);    
  }

  save(id: any) {
    console.log(id)

    let hippoToSave: Hippo = this.hippos[id];

    console.log('hippo to save', hippoToSave);

    console.log(this.hippos);

    if (hippoToSave.name === '') {
      this._notifyService.error('Name must have a value.');
      return;
    }

    this._hippoService.createHippo(hippoToSave).subscribe(res => {
      this._notifyService.success('Hippo Saved: ' + hippoToSave.name)
      this.hippos[id].edited = false;
    }, error => {
      this._notifyService.error('An ERROR has occured when trying to save' + hippoToSave.name)
    });
  }
}
