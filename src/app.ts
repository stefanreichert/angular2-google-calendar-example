/// <reference path="../typings/angular2/angular2.d.ts" />
import {Component, View, bootstrap} from 'angular2/angular2';
import {Header} from '../src/views/header';
import {Appointments} from '../src/views/appointments';
import {AppointmentsService} from '../src/services/appointmentsservice'
import {AuthenticationService} from '../src/services/authenticationservice'

@Component({
  selector: 'cat-cal-zone'
})
@View({
  templateUrl: 'src/shell.html',
  directives: [Header, Appointments]
})
class CatCalZone {
}

bootstrap(CatCalZone, [AuthenticationService, AppointmentsService]);