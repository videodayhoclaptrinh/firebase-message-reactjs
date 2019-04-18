import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase                    from 'firebase';
var config = {
    apiKey: "AIzaSyA__Jp53VZctpONM0ft2qxQ_fNfXefMhI8",
    authDomain: "dayhoclaptrinh-123.firebaseapp.com",
    databaseURL: "https://dayhoclaptrinh-123.firebaseio.com",
    projectId: "dayhoclaptrinh-123",
    storageBucket: "dayhoclaptrinh-123.appspot.com",
    messagingSenderId: "994539545049"
};
firebase.initializeApp(config);

class App extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        let messaging = firebase.messaging();
        messaging.usePublicVapidKey("BIKcQLdgpC8PuYT6GiKCnIqj3t2YJ2NqMuQ35S2hatKUdqVI5WWKLv3NulCzX0r4-68MfqjXw-iTwDsXz_d6up4");
        messaging.requestPermission()
        .then(function() {
            console.log('Notification permission granted.');
            messaging.getToken()
            .then(function(currentToken) {
                if (currentToken) {
                    console.log(currentToken)
                    // sendTokenToServer(currentToken);
                    // updateUIForPushEnabled(currentToken);
                } else {
                    // Show permission request.
                    console.log('No Instance ID token available. Request permission to generate one.');
                    // Show permission UI.
                    // updateUIForPushPermissionRequired();
                    // setTokenSentToServer(false);
                }
            })
            .catch(function(err) {
                console.log('An error occurred while retrieving token. ', err);
                // showToken('Error retrieving Instance ID token. ', err);
                // setTokenSentToServer(false);
            });
        })
        .catch(function(err) {
            console.log('Unable to get permission to notify.', err);
        });

        messaging.onMessage(function(payload) {
            console.log('Message received. ', payload);
            // var obj = JSON.parse(payload.data.notification);
            // var notification = new Notification( obj.title , {
            //     icon : obj.icon,
            //     body : obj.body
            // });
        });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                </header>
            </div>
        );
    }
}

export default App;
