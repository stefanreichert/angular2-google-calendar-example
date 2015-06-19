/// <reference path="../../typings/angular2/angular2.d.ts" />
import {Component, View, NgFor, NgIf} from 'angular2/angular2';
import {AppointmentsService} from '../services/appointmentsservice'
import {AuthenticationService} from '../services/authenticationservice'

@Component({
	selector: 'ccz-appointments'
})
@View({
	templateUrl: 'src/views/appointments.html',
	directives: [NgFor, NgIf]
})
export class Appointments {
	appointments: Array<string>;
	authenticationService: AuthenticationService;
	appointmentService: AppointmentsService;

	constructor(appointmentService: AppointmentsService, authenticationService: AuthenticationService){
		this.appointments = ['No upcoming events found.'];
		this.authenticationService = authenticationService;
		this.appointmentService = appointmentService;
	}

	refreshAppointments() {
		this.appointmentService.loadAppointments().then((newAppointments) => {
			this.appointments.splice(0, this.appointments.length);
			this.appointments.push.apply(this.appointments, newAppointments);
			console.log('displaying ' + this.appointments.length + ' appointments')
		});
	}


}