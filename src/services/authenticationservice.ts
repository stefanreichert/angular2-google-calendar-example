export class AuthenticationService {
	static clientId = '955641291165-ah9q59fs2mqvmdjsolthjtalenqrm36v.apps.googleusercontent.com';
	static apiKey = 'AIzaSyC_AVRBRTKnnd2C8ZBQxwv708KiCFnYti0';
	static scopes = ['https://www.googleapis.com/auth/plus.me','https://www.googleapis.com/auth/calendar.readonly'];
	static logoutUrl = 'https://accounts.google.com/o/oauth2/revoke?token=';
	public isAuthenticated: boolean = false;
	public authenticatedUserName: string;
	public authenticatedUserImageUrl: string;

	constructor(){
        this.internalAuthenticate(true);
	}

	login() {
		console.log('proceed login');
        this.internalAuthenticate(false);
	}

	logout(){
		console.log('proceed logout');
		this.isAuthenticated = false;
		this.authenticatedUserName = '';
		this.authenticatedUserImageUrl = '';
		window.fetch(AuthenticationService.logoutUrl + gapi.auth.getToken().access_token);
	}

	private internalAuthenticate(immediate: boolean){
		return this.proceedAuthentication(immediate)
			.then(() => this.initializeGooglePlusAPI())
			.then(() => this.initializeGoogleCalendarAPI())
			.then(() => this.loadGooglePlusUserData())
			.then((response:any) => {
				this.updateUserData(response);
				this.updateUserData(response);
			})
			.catch((error:any) => {
				console.log(error)
			});
	}

	private proceedAuthentication(immediate:boolean){
		return new Promise((resolve, reject) => {
			console.log('proceed authentication with immediate: ' + immediate);
			gapi.client.setApiKey(AuthenticationService.apiKey);
			gapi.auth.authorize({client_id: AuthenticationService.clientId, scope: AuthenticationService.scopes, immediate: immediate}, (authenticationResult) => {
				if(authenticationResult && !authenticationResult.error){
			        this.isAuthenticated = true
			        resolve()
			    }
			    else {
			    	this.isAuthenticated = false
			        reject();
			    }
			});
		});
	}

	private initializeGooglePlusAPI(){
		return new Promise((resolve, reject) => {
			console.log('initialize Google Plus API');
			resolve(gapi.client.load('plus', 'v1'));
		});
	}

	private initializeGoogleCalendarAPI(){
		return new Promise((resolve, reject) => {
			console.log('initialize Google Calendar API');
			resolve(gapi.client.load('calendar', 'v3'));
		});
	}

	private loadGooglePlusUserData() {
		return new Promise((resolve, reject) => {
			console.log('load Google Plus data');
			resolve(
				gapi.client.plus.people.get(
					{
						'userId': 'me'
					})
				);
		});
	}

    private updateUserData(response: any){
    	this.authenticatedUserName = response.result.displayName;
    	this.authenticatedUserImageUrl = response.result.image.url;
        console.log('user: ' + this.authenticatedUserName + ', image: ' + this.authenticatedUserImageUrl);
    }
}