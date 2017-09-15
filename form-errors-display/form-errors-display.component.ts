import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-errors-display',
  templateUrl: './form-errors-display.component.html',
  styleUrls: ['./form-errors-display.component.css']
})
export class FormErrorsDisplayComponent implements OnInit {
  @Input() errorsInForm;
  constructor() { }

  ngOnInit() {
  }

  openErrorsDialog() {       
    document.getElementById("openErrorBtn").click();
  }
  
}
