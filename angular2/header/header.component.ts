import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { RouterModule, Routes } from '@angular/router';
@Component({
  selector: 'mora-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
qsearchtxt ;
  constructor(private router: Router,) { }
  ngOnInit() {
  }

  onSubmit() {
    console.log("routing to client/search ......");
    console.log(this.qsearchtxt);
    this.router.navigate(['/home/client/search/'+ this.qsearchtxt]);
  }


}
