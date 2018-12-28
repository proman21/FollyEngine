import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiModule } from "../api/api.module";
import { environment } from "../../environments/environment";
import { AkitaNgDevtools } from "@datorama/akita-ngdevtools";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    ApiModule
  ],
  providers: []
})
export class StateModule { }
