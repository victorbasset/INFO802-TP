import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';

const datePipe = new DatePipe('FR');

@Injectable()
export class ApiSoapService {

  static transformDate() {
    return datePipe.transform(Date.now(), 'yyyy-MM-dd');
  }

  constructor(private http: HttpClient) {}

  public getDistance(lat_v1: number, lon_v1: number, lat_v2: number, lon_v2: number) {
    const request =
      `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tro="http://trouvetontrain/">
         <soapenv:Header/>
         <soapenv:Body>
            <tro:getDistance>
               <arg0>${lat_v1}</arg0>
               <arg1>${lon_v1}</arg1>
               <arg2>${lat_v2}</arg2>
               <arg3>${lon_v2}</arg3>
            </tro:getDistance>
         </soapenv:Body>
      </soapenv:Envelope>`;

    return new Promise( (resolve, reject) => {
      return this.http.post('http://localhost:8080/INFO802_TP_SDP_war_exploded/services/SDP?wsdl', request, {
        headers: new HttpHeaders().set('Content-Type', 'text/xml'),
        responseType: 'text'
      }).subscribe(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'text/xml');
        resolve({
          result : xml.getElementsByTagName('return')[0].textContent,
          xml : new XMLSerializer().serializeToString(xml)});
        }, err => {
          reject(err);
        });
    });
  }

  public getPrix(lat_v1: number, lon_v1: number, lat_v2: number, lon_v2: number) {
    const request =
      `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tro="http://trouvetontrain/">
         <soapenv:Header/>
         <soapenv:Body>
            <tro:getDistancePrice>
               <arg0>${lat_v1}</arg0>
               <arg1>${lon_v1}</arg1>
               <arg2>${lat_v2}</arg2>
               <arg3>${lon_v2}</arg3>
            </tro:getDistancePrice>
         </soapenv:Body>
      </soapenv:Envelope>`;

    return new Promise((resolve, reject) => {
      return this.http.post('http://localhost:8080/INFO802_TP_SDP_war_exploded/services/SDP?wsdl', request, {
        headers: new HttpHeaders().set('Content-Type', 'text/xml'),
        responseType: 'text'
      }).subscribe(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'text/xml');
        resolve({
          result : xml.getElementsByTagName('return')[0].textContent,
          xml : new XMLSerializer().serializeToString(xml)
        });
      }, err => {
        reject(err);
      });
    });
  }

  public getConvertedPrice(money_1: string, money_2: string, price: number) {
    const request =
      `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">
           <soap:Header/>
           <soap:Body>
             <tem:GetConversionAmount>
                <tem:CurrencyFrom>${money_1}</tem:CurrencyFrom>
                <tem:CurrencyTo>${money_2}</tem:CurrencyTo>
                <tem:RateDate>${ApiSoapService.transformDate()}</tem:RateDate>
                <tem:Amount>${price}</tem:Amount>
             </tem:GetConversionAmount>
           </soap:Body>
        </soap:Envelope>`;

    return new Promise((resolve, reject) => {
      return this.http.post('http://currencyconverter.kowabunga.net/converter.asmx?WSDL', request, {
        headers: new HttpHeaders().set('Content-Type', 'text/xml'),
        responseType: 'text'
      }).subscribe(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'text/xml');
        resolve({
          result : xml.getElementsByTagName('GetConversionAmountResult')[0].textContent,
          xml : new XMLSerializer().serializeToString(xml)
        });
      }, err => {
        reject(err);
      });
    });
  }

  public getCurrencies() {
    const request =
      `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">
        <soap:Header/>
          <soap:Body>
            <tem:GetCurrencies/>
        </soap:Body>
      </soap:Envelope>`;


    return new Promise((resolve, reject) => {
      return this.http.post('http://currencyconverter.kowabunga.net/converter.asmx?WSDL', request, {
        headers: new HttpHeaders().set('Content-Type', 'text/xml'),
        responseType: 'text'
      }).subscribe(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'text/xml');
        const response = xml.getElementsByTagName('GetCurrenciesResult')[0];
        resolve({
          result : response.getElementsByTagName('string'),
          xml : new XMLSerializer().serializeToString(xml)
        });
      }, err => {
        reject(err);
      });
    });
  }
}
