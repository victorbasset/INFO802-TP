import { Component, OnInit } from '@angular/core';
import {DatePipe} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(private datePipe: DatePipe) {}

  villeA: string;
  villeB: string;
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

  villes = [
    {lon: 5.93333,lat: 45.56667, label: 'Chambéry'},
    {lon: 2.3488,lat: 48.85341, label: 'Paris'},
    {lon: -3.70256,lat: 40.4165, label: 'Madrid'}
  ];

  monnaies = [
  ];

  myControl: FormControl = new FormControl();

  options = [
    'One',
    'Two',
    'Three'
  ];


  transformDate() {
    return this.datePipe.transform(Date.now(), 'yyyy-MM-dd'); //whatever format you need.
  }
  filteredOptions: Observable<object>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(this.villes))
      );
    this.getCurrencies();
  }

  filter(villes: object): object {
    return villes;
  }


  getDistance() {
    this.clear();
    this.loading = true;

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/INFO802_TP_SDP_war_exploded/services/SDP?wsdl', true);
    // the following variable contains my xml soap request (that you can get thanks to SoapUI for example)
    const sr =
      `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tro="http://trouvetontrain/">
         <soapenv:Header/>
         <soapenv:Body>
            <tro:getDistance>
               <arg0>`+this.villeA.valueOf().split(';')[0]+`</arg0>
               <arg1>`+this.villeA.valueOf().split(';')[1]+`</arg1>
               <arg2>`+this.villeB.valueOf().split(';')[0]+`</arg2>
               <arg3>`+this.villeB.valueOf().split(';')[1]+`</arg3>
            </tro:getDistance>
         </soapenv:Body>
      </soapenv:Envelope>`;

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.responseType = 'document';
    xmlhttp.send(sr);

    xmlhttp.onreadystatechange =  () => {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          const xml = xmlhttp.responseXML;
          this.xmlResponse = new XMLSerializer().serializeToString(xml);
          const response_number = parseInt(xml.getElementsByTagName('return')[0].childNodes[0].nodeValue)/1000; // Here I'm getting the value contained by the <return> node
          this.resultLabelDistance = response_number + ' km';
          this.loading = false;
        }
      }
    };
  }


  getPrix() {
    this.clear();
    this.loading = true;

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/INFO802_TP_SDP_war_exploded/services/SDP?wsdl', true);
    // the following variable contains my xml soap request (that you can get thanks to SoapUI for example)
    const sr =
      `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tro="http://trouvetontrain/">
         <soapenv:Header/>
         <soapenv:Body>
            <tro:getDistancePrice>
               <arg0>`+this.villeA.valueOf().split(';')[0]+`</arg0>
               <arg1>`+this.villeA.valueOf().split(';')[1]+`</arg1>
               <arg2>`+this.villeB.valueOf().split(';')[0]+`</arg2>
               <arg3>`+this.villeB.valueOf().split(';')[1]+`</arg3>
            </tro:getDistancePrice>
         </soapenv:Body>
      </soapenv:Envelope>`;

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.responseType = 'document';
    xmlhttp.send(sr);

    xmlhttp.onreadystatechange =  () => {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          const xml = xmlhttp.responseXML;
          this.xmlResponse = new XMLSerializer().serializeToString(xml);
          const response_number = xml.getElementsByTagName('return')[0].childNodes[0].nodeValue; // Here I'm getting the value contained by the <return> node
          this.resultLabelPrix = response_number + ' €';
          this.resultLabelPrixConvert = parseFloat(response_number);
          this.inputPrix = response_number;
          this.loading = false;
        }
      }
    };
  }

  getConvertedPrice() {
    this.clear();
    this.loading = true;

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://currencyconverter.kowabunga.net/converter.asmx?WSDL', true);
    // the following variable contains my xml soap request (that you can get thanks to SoapUI for example)
    const sr =
      `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">
           <soap:Header/>
           <soap:Body>
              <tem:GetConversionAmount>
                 <tem:CurrencyFrom>`+this.monnaieA.valueOf()+`</tem:CurrencyFrom>
                 <tem:CurrencyTo>`+this.monnaieB.valueOf()+`</tem:CurrencyTo>
                 <tem:RateDate>`+this.transformDate()+`</tem:RateDate>
                 <tem:Amount>`+this.inputPrix.valueOf()+`</tem:Amount>
              </tem:GetConversionAmount>
           </soap:Body>
        </soap:Envelope>`;

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.responseType = 'document';
    xmlhttp.send(sr);

    xmlhttp.onreadystatechange =  () => {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          const xml = xmlhttp.responseXML;
          this.xmlResponse = new XMLSerializer().serializeToString(xml);
          this.resultLabelConverted = xml.getElementsByTagName('GetConversionAmountResult')[0].childNodes[0].nodeValue; // Here I'm getting the value contained by the <return> node
          this.loading = false;
        }
      }
    };
  }

  getCurrencies() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://currencyconverter.kowabunga.net/converter.asmx?WSDL', true);
    // the following variable contains my xml soap request (that you can get thanks to SoapUI for example)
    const sr =
      `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">
         <soap:Header/>
         <soap:Body>
            <tem:GetCurrencies/>
         </soap:Body>
      </soap:Envelope>`;

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.responseType = 'document';
    xmlhttp.send(sr);

    xmlhttp.onreadystatechange =  () => {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          const xml = xmlhttp.responseXML;
          this.xmlResponse = new XMLSerializer().serializeToString(xml);
          const response = xml.getElementsByTagName('GetCurrenciesResult')[0]; // Here I'm getting the value contained by the <return> node
          const arrayCurrencies = response.getElementsByTagName('string');
          for(let i = 0; i< arrayCurrencies.length; i++){
            if(arrayCurrencies[i].innerHTML == 'EUR'){
              this.monnaieA = arrayCurrencies[i].innerHTML;
            }
            this.monnaies.push({value: arrayCurrencies[i].innerHTML, label: arrayCurrencies[i].innerHTML});
          }
        }
      }
    };
  }

  clear() {
    this.labelConverted = undefined;
    this.labelPrix = undefined;
    this.labelDistance = undefined;
    this.jsonResponse = undefined;
    this.xmlResponse = undefined;
  }

}
