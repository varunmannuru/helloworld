import {Injectable} from '@angular/core';
import {RequestOptions,RequestMethod,RequestOptionsArgs,Http,Headers, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';
import { ClientSearchRequest } from './search/clientSearchRequest.model';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class ClientService {
    private updateRTCAFormSource = new Subject<string>();
  // Observable string streams
  updateRTCAForm$ = this.updateRTCAFormSource.asObservable();

  constructor(private http:Http) { }

  getProviders(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({ headers: headers});
  //  console.log("Sending HTTP Requests now ------------------>");
    return this.http.get(environment.apiUrl + '/refdata/providers', options).map((res: Response) => res.json());
  }

  getAlienNbrsAutoCompleteResults(alienPattern) {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({ headers: headers, method:RequestMethod.Get});
    console.log("getAlienNbrsAutoCompleteResults Sending HTTP Requests now ------------------>");
    return this.http.get(environment.apiUrl + '/client/alienNumber/'+alienPattern, options).map((res: Response) => res.json());
   }

  getGenders(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({ headers: headers});
    return this.http.get(environment.apiUrl + '/refdata/genders', options).map((res: Response) => res.json());
  }

  getImmigrationStatuses(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({ headers: headers});
    return this.http.get(environment.apiUrl + '/refdata/immigrationStatuses', options).map((res: Response) => res.json());

  }
    getStates(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({ headers: headers});
    return this.http.get(environment.apiUrl + '/refdata/states', options).map((res: Response) => res.json());
  }


  getMaritalStatuses(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({ headers: headers});
    return this.http.get(environment.apiUrl + '/refdata/maritalStatuses', options).map((res: Response) => res.json());
  }

  getClientSearchResults(searchRequest, page, size) {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({ headers: headers, method:RequestMethod.Post});
    if( searchRequest.entryDate == '') {
      searchRequest.entryDate = null;
    }

    if(searchRequest.dateOfBirth == ''){
      searchRequest.dateOfBirth = null;
    }
    searchRequest.defaultDate = null;
    console.log("getClientSearchResults Sending HTTP Requests now ------------------>");
   console.log("getClientSearchResults Sending HTTP Requests now ------------------>", searchRequest, options);		    console.log("getClientSearchResults Sending HTTP Requests now ------------------>");
    return this.http.post(environment.apiUrl + '/client/search/page/' + page +'/size/'+ size , searchRequest, options).map((res: Response) => res.json());
   }

   getHigherEducationalData(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({ headers: headers, method:RequestMethod.Get});
    return this.http.get(environment.apiUrl + '/refdata/educationLevels', options).map((res: Response) => res.json());
  }

  getCountryOfOriginData(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({ headers: headers, method:RequestMethod.Get});
    return this.http.get(environment.apiUrl + '/refdata/countryOfOrigins', options).map((res: Response) => res.json());
  }

 getPreviousoccupationaData(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({ headers: headers, method:RequestMethod.Get});
    return this.http.get(environment.apiUrl + '/refdata/previousOccupations', options).map((res: Response) => res.json());
  }

  getRelationships(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({ headers: headers, method:RequestMethod.Get});
    return this.http.get(environment.apiUrl + '/refdata/relationShips', options).map((res: Response) => res.json());
  }

 getClientDetails(alienNmbr) {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({ headers: headers, method:RequestMethod.Get});
    console.log("getClientDetails Sending HTTP Requests now ------------------>");
    return this.http.get(environment.apiUrl + '/client/'+alienNmbr, options).map((res: Response) => res.json());
  }

  getClientDemoAuditData(alienNmbr){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({ headers: headers, method:RequestMethod.Get});
    return this.http.get(environment.apiUrl + '/client/demo/audit/'+alienNmbr, options).map((res: Response) => res.json());
  }

  getClientAddressAuditData(alienNmbr){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({ headers: headers, method:RequestMethod.Get});
    return this.http.get(environment.apiUrl + '/client/address/audit/'+alienNmbr, options).map((res: Response) => res.json());
  }

 saveClientDetailsResults(clientinfo) {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let options = new RequestOptions({ headers: headers, method:RequestMethod.Post});
    return this.http.post(environment.apiUrl + '/client/', clientinfo, options).map((res: Response) => res.json());
  }

  getQuickSearchResults(qsearchtxt, page, size) {
      let headers = new Headers();
      headers.append('Content-Type','application/json');
      let options = new RequestOptions({ headers: headers, method:RequestMethod.Get});
      return this.http.get(environment.apiUrl + '/client/quicksearch/'+qsearchtxt + "/page/" + page + '/size/' + size, options).map((res: Response) => res.json());

  }

  getAddressInfo(zip: number): Observable<any> {
        return this.http.get(environment.apiUrl + "/refdata/zipmapping/" + zip)
                          .map(res => res.json())
                          .catch(res => this.handleError(res));
    }


   private handleError (error: any) {
      let errMsg = error.message || 'Server error';
      console.error(errMsg); // log to console instead
      return Observable.throw(errMsg);
    }

    updateRTCAClients(alienNumber) {
      this.updateRTCAFormSource.next(alienNumber);
    }
}
