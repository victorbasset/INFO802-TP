import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatIconModule,
  MatExpansionModule,
  MatProgressBarModule,
  MatToolbarModule,
  MatListModule,
  MatSelectModule,
  MatStepperModule,
  MatAutocompleteModule
} from '@angular/material';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiRestService } from './api-rest.service';
import { ApiSoapService } from './api-soap.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    MatStepperModule,
    MatAutocompleteModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatToolbarModule,

    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [DatePipe, ApiRestService, ApiSoapService],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent],
  exports: [AppComponent]
})
export class AppModule { }
