import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  @Input() stepsInvolved: string[];
  @Input() stepsCompleted: string[]; // not the current step
  @Input() currentStep: number;

  constructor() { }

  ngOnInit() {
      console.log("steps stepsInvolved", this.stepsInvolved);
        console.log("steps completed", this.stepsCompleted);
          console.log("steps currentStep", this.currentStep);
  }

  checkStatus(step) {
      if(step === this.stepsInvolved[this.currentStep-1]) {
          return 'current';
      }
      return (this.stepsCompleted.indexOf(step) > -1)?'completed': 'incomplete';
  }


}
