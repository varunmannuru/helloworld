import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { RouterModule, Routes } from '@angular/router';
import { ClientService } from '../client.service';
@Component({
  selector: 'client-search-pagination',
  templateUrl: './client-search-pagination.component.html',
  styleUrls: ['./client-search-pagination.component.css']
})
export class ClientSearchPaginationComponent implements OnInit {
  @Input() clientSearchResultsAvailable: boolean;
  @Input() clientSearchResults: any;
  @Input() minVal: number;
  @Input() maxVal: number;
  @Input() totalElements: number;
  @Input() p: number;
  @Input() size: number;
  @Input() anchorEnable: boolean;
  @Output() getPageEmitter: EventEmitter<any>;

  

  constructor(private clientService: ClientService) { 
      this.getPageEmitter = new EventEmitter();
  }

  ngOnInit() {
  }

  getPage(page) {
    this.getPageEmitter.emit(page);
  }

  update(clientId, alienNmbr) {
      console.log("time to update", clientId, alienNmbr);
      this.clientService.updateRTCAClients(alienNmbr);
  }

}
