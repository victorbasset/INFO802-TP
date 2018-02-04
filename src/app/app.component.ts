import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { ApiRestService } from './api-rest.service';
import { Http } from '@angular/http';
import { ApiSoapService } from './api-soap.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  monnaieA: string;
  monnaieB: string;
  jsonResponse: any;
  xmlResponse: string;
  labelConverted: string;
  labelPrix: string;
  labelDistance: string;
  inputPrix: string;
  loading: boolean;
  resultLabelPrixConvert: number;
  resultLabelConverted: string;
  resultLabelDistance: string;
  resultLabelPrix: string;
  showDiagnostic = false;
  apiRest = new ApiRestService(this.httpClient);
  apiSoap = new ApiSoapService(this.httpClient);

  monnaies = [
  ];

  villes: any[] = [
  ];

  villeA: FormControl = new FormControl();
  villeB: FormControl = new FormControl();

  filteredOptionsVilleA: Observable<any[]>;
  filteredOptionsVilleB: Observable<any[]>;

  constructor(private http: Http, private httpClient: HttpClient) {}

  ngOnInit() {
    this.getCurrencies();
    this.getVilles();
    this.filteredOptionsVilleA = this.villeA.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val.toString()))
      );

    this.filteredOptionsVilleB = this.villeB.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val.toString()))
      );
  }

  displayFn(ville): string {
    return ville ? ville.name : ville;
  }

  filter(val: string): string[] {
    if (val.length >= 2) {
      return this.villes.filter(option => option.name.toLowerCase().indexOf(val.toLowerCase()) === 0)
    } else {
      return null
    }
  }

  getDistance() {
    this.clear();
    this.loading = true;

    const lat_v1 = parseFloat(this.villeA.value.lat);
    const lon_v1 = parseFloat(this.villeA.value.lon);
    const lat_v2 = parseFloat(this.villeB.value.lat);
    const lon_v2 = parseFloat(this.villeB.value.lon);

    this.apiSoap.getDistance(lat_v1, lon_v1, lat_v2, lon_v2).then(
      ({result, xml}) => {
        this.xmlResponse = xml;
        this.resultLabelDistance = (parseInt(result, 10) / 1000).toString() + ' km';
        this.loading = false;
      },

    error => {
        alert(error);
        this.loading = false;
      });
  }

  getPrix() {
    this.clear();
    this.loading = true;

    const lat_v1 = parseFloat(this.villeA.value.lat);
    const lon_v1 = parseFloat(this.villeA.value.lon);
    const lat_v2 = parseFloat(this.villeB.value.lat);
    const lon_v2 = parseFloat(this.villeB.value.lon);

    this.apiSoap.getPrix(lat_v1, lon_v1, lat_v2, lon_v2).then(
      ({result, xml}) => {
        this.xmlResponse = xml;
        this.resultLabelPrix = result.toString() + ' €';
        this.resultLabelPrixConvert = parseFloat(result.toString());
        this.inputPrix = result.toString();
        this.loading = false;
      },
      error => {
        alert(error);
        this.loading = false;
      });
  }

  getConvertedPrice() {
    this.clear();
    this.loading = true;
    const money_1 = this.monnaieA.valueOf();
    const money_2 = this.monnaieB.valueOf();
    const price = parseFloat(this.inputPrix.valueOf());

    this.apiSoap.getConvertedPrice(money_1, money_2, price).then(
      ({result, xml}) => {
        this.xmlResponse = xml;
        this.resultLabelConverted = result.toString();
        this.loading = false;
      },
      error => {
        alert(error);
        this.loading = false;
      });
  }

  getCurrencies() {
    this.clear();

    this.apiSoap.getCurrencies().then(
      ({result, xml}) => {
        for (let i = 0; i < result.length; i++) {
          if (result[i].innerHTML === 'EUR') {
            this.monnaieA = result[i].innerHTML;
          }
          this.monnaies.push({value: result[i].innerHTML, label: result[i].innerHTML});
        }
        this.xmlResponse = xml;
      },
      error => {
        alert(error);
      });
  }

  getVilles() {
    this.clear();
    this.loading = true;

    this.apiRest.getStopAreas().then(
      (result) => {
        this.villes = result[0].stop_areas;
        this.jsonResponse = result;
        this.loading = false;
      },
      error => {
        alert(error);
        this.loading = false;
      });
  }

  getJourneys() {
    this.clear();
    this.loading = true;

    this.apiRest.getJourneys(this.villeA.value.id, this.villeB.value.id, '20180204T120000').then(
      (result) => {
        console.log(result);
        this.jsonResponse = result;
        this.loading = false;
      },
      error => {
        alert(error);
        this.loading = false;
      });
  }

  clear() {
    this.labelConverted = undefined;
    this.labelPrix = undefined;
    this.labelDistance = undefined;
    this.jsonResponse = undefined;
    this.xmlResponse = undefined;
  }

}
