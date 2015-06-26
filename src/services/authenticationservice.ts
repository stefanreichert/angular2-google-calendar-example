export class AuthenticationService {
	// constants
	static clientId = '955641291165-ah9q59fs2mqvmdjsolthjtalenqrm36v.apps.googleusercontent.com';
	static apiKey = 'AIzaSyC_AVRBRTKnnd2C8ZBQxwv708KiCFnYti0';
	static scopes = ['https://www.googleapis.com/auth/plus.me','https://www.googleapis.com/auth/calendar.readonly'];
	static logoutUrl = 'https://accounts.google.com/o/oauth2/revoke?token=';
	/* 
	 * global application state, so it's OK to keep it as field value of a singleton. alternative would be a 
	 * buitl-in global value store.
	 */
	public isAuthenticated: boolean = false;
	public userName: string;
	public userImageUrl: string;

	constructor(){
		// check the authentication silently
		this.internalAuthenticate(true);
	}

	login() {
		console.log('proceed login');
        // check the authentication and present a dialog on failure
        this.internalAuthenticate(false);
    }

    logout(){
    	console.log('proceed logout');
		// reset the gloab application state
		this.isAuthenticated = false;
		this.setUserData('','');
		/* revoke existing token - there is no Google API support for that, window.fetch() is
		 * a replacement for the JS XHTTP Request, is not available in older browsers though.
		 */
		 window.fetch(AuthenticationService.logoutUrl + gapi.auth.getToken().access_token);
	}

	private internalAuthenticate(immediate: boolean){
		/* heavily use promises here for 2 reasons:
		 *
		 * nr1: readability (image callback syntax here :( )
		 * nr2: ui synchronisation: due to the GAPI, the result is handled in a callback, 
		 *		angular does therefor not know of any scope changes. since ther is no scope
		 *		as in angular1 one cannot manually trigger the scope digest.
		 *		Using Promises solves this problem since the scope digest is triggered on 
		 *		resove() and reject().
		 * The callbacks passed to then() are lambdas to ensure the call applies to the correct
		 * scope.
		 */
		 return this.proceedAuthentication(immediate)
		 .then(() => this.initializeGooglePlusAPI())
		 .then(() => this.initializeGoogleCalendarAPI())
		 .then(() => this.loadGooglePlusUserData())
		 .then((response:any) => this.setUserData(response.result.displayName, response.result.image.url))
		 .catch((error:any) => {console.log('authentication failed: ' + error)});
	}

	private proceedAuthentication(immediate:boolean){
		return new Promise((resolve, reject) => {
			console.log('proceed authentication - immediate: ' + immediate);
			gapi.client.setApiKey(AuthenticationService.apiKey);
			var authorisationRequestData =
			{
				'client_id': AuthenticationService.clientId, 
				'scope': AuthenticationService.scopes, 
				'immediate': immediate
			} 
			gapi.auth.authorize(authorisationRequestData,
				(authenticationResult) => {
					if(authenticationResult && !authenticationResult.error){
						this.isAuthenticated = true
						this.setUserData('unknown', '');
						resolve()
					}
					else {
						this.isAuthenticated = false
						this.setUserData('','');
						reject();
					}
				}
				);
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
			resolve(gapi.client.plus.people.get({'userId': 'me'}));
		});
	}

	private setUserData(userName: string, userImageUrl: string){
		this.userName = userName;
		this.userImageUrl = userImageUrl;
		console.log('user: ' + this.userName + ', image: ' + this.userImageUrl);
	}
}