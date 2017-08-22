import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
  model: any = {}
  loading = false;
  returnUrl: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home'
  }

  login(){
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .then(result => {
          if ( result ){
            this.router.navigate([this.returnUrl]);
          }
      }).catch((ex) => {
        this.loading = false;
        this.alertService.error("Invalid Credential !");
      });
  }

}
