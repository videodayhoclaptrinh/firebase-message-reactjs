import React, { Component } from 'react';
import logo from './logo.svg';
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
        this.state = {
            token: "",
            topics: []
        }
        this._sendMsg       = this._sendMsg.bind(this);
        this._createTopic   = this._createTopic.bind(this);
        this._showTopic     = this._showTopic.bind(this);
        this._subscribeTopic    = this._subscribeTopic.bind(this);
        this._unSubcribeTopic   = this._unSubcribeTopic.bind(this);
        this._unSubscribeTopic  = this._unSubscribeTopic.bind(this);
    }

    componentDidMount(){
        let messaging = firebase.messaging();
        messaging.usePublicVapidKey("BIKcQLdgpC8PuYT6GiKCnIqj3t2YJ2NqMuQ35S2hatKUdqVI5WWKLv3NulCzX0r4-68MfqjXw-iTwDsXz_d6up4");
        messaging.requestPermission()
        .then(()=>{
            console.log('Notification permission granted.');
            messaging.getToken()
            .then((currentToken)=>{
                if (currentToken) {
                    this.setState({token: currentToken});
                    // sendTokenToServer(currentToken);
                    // updateUIForPushEnabled(currentToken);
                    this._showTopic();
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

        messaging.onMessage((payload)=>{
            console.log(payload)
            // var notify = JSON.parse(payload.data.notification);
            // new Notification( notify.title , {
            //     icon : notify.icon,
            //     body : notify.body
            // });
        });
    }

    _sendMsg(msg, to){
        fetch( "https://fcm.googleapis.com/fcm/send" , {
            cache: 'no-cache', 
            credentials: 'same-origin', 
            headers: {
                'Content-Type'  : 'application/json',
                "Authorization" : "key=AIzaSyDm6SBmHIH1QjVJ6dq5aItqdJfFJlHCSI4"
            },
            method: 'POST', 
            body:JSON.stringify({
                to,
                data: {
                    msg
                }
            })
        })
        .then(response => response.json()) 
        .then((rs) => {
            console.log(rs)
            this.setState({msg:""})
        })
        .catch((err) => {
            console.log(err)
        });
    }

    _createTopic(topic){
        fetch( "https://iid.googleapis.com/iid/v1/"+this.state.token+"/rel/topics/"+topic , {
            cache: 'no-cache', 
            credentials: 'same-origin', 
            headers: {
                'Content-Type'  : 'application/json',
                "Authorization" : "key=AIzaSyDm6SBmHIH1QjVJ6dq5aItqdJfFJlHCSI4"
            },
            method: 'POST', 
            body:JSON.stringify({})
        })
        .then(response => response.json()) 
        .then((rs) => {
            console.log(rs)
            this._showTopic();
        })
        .catch((err) => {
            console.log(err)
        });
    }

    _showTopic(){
        fetch( "https://iid.googleapis.com/iid/info/"+this.state.token+"?details=true" , {
            cache: 'no-cache', 
            credentials: 'same-origin', 
            headers: {
                'Content-Type'  : 'application/json',
                "Authorization" : "key=AIzaSyDm6SBmHIH1QjVJ6dq5aItqdJfFJlHCSI4"
            },
            method: 'GET'
        })
        .then(response => response.json()) 
        .then((rs) => {
            let topics = [];
            if(rs.hasOwnProperty("rel")){
                for (var key in rs.rel.topics) {
                    // skip loop if the property is from prototype
                    if (!rs.rel.topics.hasOwnProperty(key)) continue;
              
                    topics.push({name: key});
                }
                this.setState({ topics: topics });
            }
        })
        .catch((err) => {
            console.log(err)
        });
    }

    _subscribeTopic(topic){
        fetch( "https://iid.googleapis.com/iid/v1:batchAdd" , {
            cache: 'no-cache', 
            credentials: 'same-origin', 
            headers: {
                'Content-Type'  : 'application/json',
                "Authorization" : "key=AIzaSyDm6SBmHIH1QjVJ6dq5aItqdJfFJlHCSI4"
            },
            method: 'POST', 
            body:JSON.stringify({
                to: "/topics/"+topic,
                registration_tokens: [this.state.token]
            })
        })
        .then(response => response.json()) 
        .then((rs) => {
            console.log(rs)
            this._showTopic();
        })
        .catch((err) => {
            console.log(err)
        });
    }

    _unSubscribeTopic(topic){
        fetch( "https://iid.googleapis.com/iid/v1:batchRemove" , {
            cache: 'no-cache', 
            credentials: 'same-origin', 
            headers: {
                'Content-Type'  : 'application/json',
                "Authorization" : "key=AIzaSyDm6SBmHIH1QjVJ6dq5aItqdJfFJlHCSI4"
            },
            method: 'POST', 
            body:JSON.stringify({
                to: "/topics/"+topic,
                registration_tokens: [this.state.token]
            })
        })
        .then(response => response.json()) 
        .then((rs) => {
            console.log(rs)
            this._showTopic();
        })
        .catch((err) => {
            console.log(err)
        });
    }

    _unSubcribeTopic(topic){
        let messaging = firebase.messaging();
        console.log(messaging);
    }

    render() {
        return (
            <div className="container">
                <div className="col-md-8 offset-md-2">
                    <p>Your token: {this.state.token}</p>
                    <hr className="my-4"></hr>
                    <div>
                        <p className="h3">Topics: </p>
                        <ul>
                            {
                                this.state.topics.map((topic,index)=>{
                                    return(
                                        <li key={index}>
                                            {topic.name}&ensp;
                                            <span onClick={()=>this.setState({toToken: "/topics/"+topic.name})} className="badge badge-primary">Send Msg</span>&ensp;   
                                            <span onClick={this._unSubscribeTopic.bind(this, topic.name)} className="badge badge-danger">Unsubscribe</span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <hr className="my-4"></hr>
                    <form>
                        <p className="h4">Gửi tin nhắn: </p>
                        <div className="form-group">
                            <label>Token</label>
                            <input defaultValue={this.state.toToken} onChange={(e)=>{this.setState({toToken:e.target.value})}} type="text" className="form-control" placeholder="Enter token" />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <input defaultValue={this.state.msg} onChange={(e)=>{this.setState({msg:e.target.value})}} type="text" className="form-control" placeholder="Message" />
                        </div>
                        <span onClick={this._sendMsg.bind(this, this.state.msg, this.state.toToken)} className="btn btn-primary btn-sm">Send msg</span>
                    </form>
                    <hr className="my-4"></hr>
                    <form>
                        <p className="h4">Tạo mới topic: </p>
                        <div className="form-group">
                            <label>Topic name</label>
                            <input defaultValue={this.state.topic} onChange={(e)=>{this.setState({topic:e.target.value})}} type="text" className="form-control" placeholder="Enter topic name" />
                        </div>
                        <span onClick={this._createTopic.bind(this,this.state.topic)} className="btn btn-primary btn-sm">Create topic</span>
                    </form>
                    <hr className="my-4"></hr>
                    <form>
                        <p className="h4">Subcribe topic: </p>
                        <div className="form-group">
                            <label>Topic name</label>
                            <input defaultValue={this.state.topic} onChange={(e)=>{this.setState({topic:e.target.value})}} type="text" className="form-control" placeholder="Enter topic name" />
                        </div>
                        <span onClick={this._subscribeTopic.bind(this,this.state.topic)} className="btn btn-primary btn-sm">Subcribe topic</span>
                    </form>
                </div>
            </div>
        );
    }
}

export default App;
