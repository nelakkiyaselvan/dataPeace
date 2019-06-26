import React, { Component } from 'react';
import backLogo from'./img/left-arrow-icon.png';
import './App.css';

class UserDetail extends Component {
    renderUserDetails = (userData) => {
        if (Object.keys(userData).length) {
            return (
                <div class="userDetailWrapper">
                    <ul>
                        <li class="userDetail"><span class="cls_fName">{userData.first_name} {userData.last_name}</span></li>
                        <li class="userDetail"><span class="cls_left">Company</span><span class="cls_right">{userData.company_name}</span></li>
                        <li class="userDetail"><span class="cls_left">City</span><span class="cls_right">{userData.city}</span></li>
                        <li class="userDetail"><span class="cls_left">State</span><span class="cls_right">{userData.state}</span></li>
                        <li class="userDetail"><span class="cls_left ">ZIP</span><span class="cls_right">{userData.zip}</span></li>
                        <li class="userDetail"><span class="cls_left">Email</span><span class="cls_right">{userData.email}</span></li>
                        <li class="userDetail"><span class="cls_left">Web</span><span class="cls_right">{userData.web}</span></li>
                        <li class="userDetail"><span class="cls_left">Age</span><span class="cls_right">{userData.age}</span></li>
                    </ul>
                </div>
            );
        }
        else {
            this.props.history.push('/');
        }
    }
    render() {
        return (
            <React.Fragment>
                <div class="header"><div class="headerIcon" onClick={this.props.history.goBack}><img src={backLogo}/></div><div class="headerText">data peace</div></div>
                {this.renderUserDetails(this.props.userData)}
            </React.Fragment>
        );
    }
}
export default UserDetail;
