import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Hippo } from '../_objects/models/hippo';
import { CreateHippoDto } from '../_objects/dtos/createHippoDto';
import { UpdateHippoDto } from '../_objects/dtos/updateHippoDto';

@Injectable({
  providedIn: "root",
})
export class HippoService {
  baseUrl = environment.apiUrl + "/v1/hippos/";

  constructor(private http: HttpClient) {}

  getHippo(id: string) {
    return this.http.get<Hippo>(
      `${this.baseUrl}${id}`
    );
  }

  listHippos() {
    return this.http.get<Hippo[]>(
        `${this.baseUrl}`
    );
  }

  createHippo(hippo: CreateHippoDto) {
    return this.http.post(
        `${this.baseUrl}`,
        hippo
    );
  }

  deleteHippo(id: string) {
    return this.http.delete(
        `${this.baseUrl}${id}`
    );
  }

  updateHippo(id: string, hippo: UpdateHippoDto) {
    return this.http.put(
        `${this.baseUrl}${id}`,
        hippo
    );
  }
}
