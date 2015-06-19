/// <reference path="../../typings/angular2/angular2.d.ts" />
import {Component, View, NgIf} from 'angular2/angular2';
import {AuthenticationService} from '../services/authenticationservice'

@Component({
  selector: 'ccz-header'
})
@View({
  templateUrl: 'src/views/header.html',
  directives: [NgIf]
})
export class Header {
	service: AuthenticationService;

	constructor(service: AuthenticationService){
		this.service = service;
	}
}