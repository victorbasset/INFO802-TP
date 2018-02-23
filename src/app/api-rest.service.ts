import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiSoapService } from './api-soap.service';

@Injectable()
export class ApiRestService {

  constructor(private http: HttpClient, private apiSoap: ApiSoapService) {
  }

  public getStopAreas() {
    const stop_areas = [];
    const BASE_URL = 'https://api.sncf.com/v1/coverage/sncf/stop_areas?count=1000&start_page=';
    const headers = new HttpHeaders().set('Authorization', 'Basic ' + btoa('11f6cdb3-24b6-4e0e-9313-ffca6d997984'));

    const p1 = new Promise((resolve1, reject1) => {
      this.http.get(BASE_URL + '0', {
        headers: headers
      }).subscribe(page0 => {
        page0['stop_areas'].forEach(obj => {
          stop_areas.push({id: obj.id, name: obj.name, lat: obj.coord.lat, lon: obj.coord.lon});
        });
        resolve1('p1 success');
        }, err => {
        reject1('p1 error')
      });
    });

    const p2 = new Promise((resolve2, reject2) => {
      this.http.get(BASE_URL + '1', {
        headers: headers
      }).subscribe(page1 => {
        page1['stop_areas'].forEach(obj => {
          stop_areas.push({id: obj.id, name: obj.name, lat: obj.coord.lat, lon: obj.coord.lon});
        });
        resolve2('p2 success');
        }, err => {
        reject2('p2 error')
      });
    });

    const p3 = new Promise((resolve3, reject3) => {
      this.http.get(BASE_URL + '2', {
        headers: headers
      }).subscribe(page2 => {
        page2['stop_areas'].forEach(obj => {
          stop_areas.push({id: obj.id, name: obj.name, lat: obj.coord.lat, lon: obj.coord.lon});
        });
        resolve3('p3 success');
        }, err => {
        reject3('p3 error')
      });
    });

    return Promise.all([{page1: p1, page2: p2, page3: p3, stop_areas: stop_areas}])
  }

  public getJourneys(id_v1: string, id_v2: string, date: string) {
    const URL = 'https://api.sncf.com/v1/coverage/sncf/journeys?from=' + id_v1 + '&to=' + id_v2 + '&datetime=' + date;
    const headers = new HttpHeaders().set('Authorization', 'Basic ' + btoa('11f6cdb3-24b6-4e0e-9313-ffca6d997984'));
    const journeys = [];

    return new Promise((resolve, reject) => {
      this.http.get(URL, {
        headers: headers
      }).subscribe(data => {
        if ( data['journeys'] !== undefined ) {
          data['journeys'].forEach(journeys_data => {
            const promiseArray = [];
            journeys_data.sections.forEach(sections => {
              if (sections.type === 'public_transport') {
                const lat_v1 = sections.from.stop_point.coord.lat;
                const lon_v1 = sections.from.stop_point.coord.lon;
                const lat_v2 = sections.to.stop_point.coord.lat;
                const lon_v2 = sections.to.stop_point.coord.lon;

                promiseArray.push(
                  new Promise((resolve0) => {
                    this.apiSoap.getDistance(lat_v1, lon_v1, lat_v2, lon_v2).then(
                      ({result}) => {
                        resolve0(parseInt(result, 10) / 1000);
                      });
                  }));
              }
            });

            Promise.all(promiseArray).then((results) => {
              const distance = (results.map(Number)).reduce((a, b) => this.precisionRound(a + b, 1), 0);
              this.apiSoap.getPrixWithDistance(distance).then(({result}) => {
                journeys.push({
                  sections: journeys_data.sections,
                  type: journeys_data.type,
                  departure_date_time: journeys_data.departure_date_time,
                  arrival_date_time: journeys_data.arrival_date_time,
                  duration: journeys_data.duration,
                  distance: distance,
                  prix: this.precisionRound(parseFloat(result), 2)
                })
              });
            });
          });
        }
        resolve(journeys);
      }, err => {
        reject(err)
      });
    });
  }

  private precisionRound(number, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }
}
