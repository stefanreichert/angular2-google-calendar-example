/// <reference path="../typings/angular2/angular2.d.ts" />
import {Component, View, bootstrap} from 'angular2/angular2';
import {Header} from '../src/views/header';
import {Appointments} from '../src/views/appointments';
import {AppointmentsService} from '../src/services/appointmentsservice'
import {AuthenticationService} from '../src/services/authenticationservice'

/*
 * the Application class represents the main component. it is referenced by the 
 * index.html file and is also reponsible for bootstrapping the application.
 */
@Component({
  selector: 'ajs2-oauth-sample'
})
@View({
  templateUrl: 'src/shell.html',
  directives: [Header, Appointments] // these directives are used in the shell.html file
})
class Application {
	// nothing special required here
}

/*
 * boostrap the application with all available services. these services will be available
 * as singleton, container elements may use constructor based injection to get hold of the
 * instance
 * 
 * example:
 *
 * constructor(authenticationService: AuthenticationService) {
 * 		this.authenticationService = authenticationService; 
 * }
 *
 * 
 */
bootstrap(Application, [AuthenticationService, AppointmentsService]);