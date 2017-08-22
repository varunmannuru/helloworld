import { Http } from '@angular/http';

export class AuthenticationService{

  //constructor(private http: Http)
  isLoggedIn(){
    if (localStorage.getItem('currentUser')) {
      return true;
    }else{
      return false;
    }
  }

  login(username: string, password: string) {
    return new Promise<boolean>( (resolve, reject) => {
      if ( username === password  ){
        localStorage.setItem('currentUser', username );
        //var sampleResponse = {"response" : "success" , "username" : username};
        resolve (true);
      }else{
        reject(false);
      }
    });
  }


  logout(){
    localStorage.removeItem('currentUser');
  }
    /*
    return this.http.post('/api/authenticate', JSON.stringify({ username: username, password: password }))
        .map((response: Response) => {
            // login successful if there's a jwt token in the response
            let user = response.json();
            if (user && user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
        });
  */


}
