/* eslint-disable */
import {CognitoAuth, StorageHelper} from 'amazon-cognito-auth-js';
import IndexRouter from '../router/index';
import UserInfoStore from './user-info-store';
import UserInfoApi from './user-info-api';


// const CLIENT_ID = process.env.VUE_APP_COGNITO_CLIENT_ID;
// const APP_DOMAIN = process.env.VUE_APP_COGNITO_APP_DOMAIN;
// const REDIRECT_URI = process.env.VUE_APP_COGNITO_REDIRECT_URI;
// const USERPOOL_ID = process.env.VUE_APP_COGNITO_USERPOOL_ID;
// const REDIRECT_URI_SIGNOUT = process.env.VUE_APP_COGNITO_REDIRECT_URI_SIGNOUT;
// const APP_URL = process.env.VUE_APP_APP_URL;

const CLIENT_ID = "48q14q979ohgjg1kmt172uab2b";
const APP_DOMAIN = "lamaabp.auth.us-east-1.amazoncognito.com";
const REDIRECT_URI = "https://master.d18ewksbg2mt7e.amplifyapp.com/login/oauth2/code/cognito";
const USERPOOL_ID = "lama-abp-cognito";
const REDIRECT_URI_SIGNOUT = "https://master.d18ewksbg2mt7e.amplifyapp.com/logout";
const APP_URL = "https://master.d18ewksbg2mt7e.amplifyapp.com";

var authData = {
    ClientId : CLIENT_ID, // Your client id here
    AppWebDomain : APP_DOMAIN,
    TokenScopesArray : ['openid', 'email'],
    RedirectUriSignIn : REDIRECT_URI,
    RedirectUriSignOut : REDIRECT_URI_SIGNOUT,
    UserPoolId : USERPOOL_ID,
}

var auth = new CognitoAuth(authData);
auth.userhandler = {
    onSuccess: function(result) {
        console.log("On Success result", result);
        UserInfoStore.setLoggedIn(true);
        UserInfoApi.getUserInfo().then(response => {
            IndexRouter.push('/');
        });


    },
    onFailure: function(err) {
        UserInfoStore.setLoggedOut();
        IndexRouter.go({ path: '/error', query: { message: 'Login failed due to ' + err } });
    }
};

function getUserInfoStorageKey(){
    var keyPrefix = 'CognitoIdentityServiceProvider.' + auth.getClientId();
    var tokenUserName = auth.signInUserSession.getAccessToken().getUsername();
    var userInfoKey = keyPrefix + '.' + tokenUserName + '.userInfo';
    return userInfoKey;
}

var storageHelper = new StorageHelper();
var storage = storageHelper.getStorage();
export default{
    auth: auth,
    login(){
        auth.getSession();
    },
    logout(){
        if (auth.isUserSignedIn()) {
            var userInfoKey = this.getUserInfoStorageKey();
            auth.signOut();

            storage.removeItem(userInfoKey);
        }
    },
    getUserInfoStorageKey,

}