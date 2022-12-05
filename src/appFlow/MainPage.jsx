import React, { useState, useEffect } from "react"
import { json, Link, useNavigate } from "react-router-dom";
import { usePublicMesagges } from "../dataComponents/publicMessages.js";
import { GetUsers } from "../dataComponents/users.js";
import { getAllRegisteredUsers,changeStatus, sendPublicMessage, getAllUserPrivateChats, getUsernameFromToken, getUserType, muteUnmute } from "../Utilities/rest";
import { serverAddress } from "../Utilities/constants";
import Register from "./Register";
import { Button } from "bootstrap";
import { get } from "jquery";
import {GetUsersNew} from "../dataComponents/newUsers.jsx";
import { openConnection, isConnected } from "../Utilities/socketjs.js";
import PrivateChat from "../dataComponents/PrivateChat.jsx";
import Logout from "./Logout.jsx";


export const MainPage = () => {
    const navigate = useNavigate();

    const [publicMessages,] = usePublicMesagges();
    const [messageToSend, setMessageToSend] = useState("");
    const [privateChat, setPrivateChat] = useState();
    const [users] = GetUsers();
    const [newUsers, setnewUsers] = useState([]);
    const [lastUpdate, setLastUpdate] = useState();
    const [tab, setTab] = useState("Main Chat");
    const [userType, setUserType]= useState("");
    let username = null;
    

    useEffect(() => {
        async function init() {
        username = await getUsernameFromToken();
        let type = await getUserType();
        setUserType(type);
        console.log("userType");
        console.log(userType);
        openConnection(username);
        } 
        init();
       
    }, []);

    useEffect(() => {
        console.log("useEffect");
        console.log(publicMessages);
    }, [publicMessages]);

    function changeTab(t) {
        setTab(t);
        console.log(tab)
    }

    async function onMuteUnmute(username){
        let x= await muteUnmute(username);
    }

    async function onChangeStatus(username){
        let x= await changeStatus(username);
    }





    function inputMessage(e) {
        setMessageToSend(e.target.value);
    }
    //getMessages();


    return (
        <div className="MainPage">
            
            {tab === "Main Chat" ? <div className="container">
                <h2 className="main-chat-title">Main Chat Room</h2>
                <div className="users">
                    <ul title="All Registered Users :"> {users && users.map(
                        (user, index) => 
                        <li key={index}>
                            {<button className="user-li" onClick={()=>setTab(user.username)}>{user.username}</button>}
                            <div>
                                {userType === "ADMIN" ? <button className="mute-unmute" onClick={() => onMuteUnmute(user.username)}>mute</button> :
                                <div></div>}    
                            </div>
                            
                        </li>
                        )}
                    </ul>
                </div>
                <div className="messages-container">
                    <div className="messages">
                        <ul>{publicMessages && publicMessages.map(
                            (message, index) => <li className = "message-li" key={index}>{message.time + "  " + message.sender + ": " + message.content}</li>
                        )}</ul>
                    </div>
                    <input className="text-in" onChange={inputMessage}></input>
                    <button className="send-btn" onClick={() => sendPublicMessage(messageToSend)}>send</button>
                </div>
                <div>
                <button className="change-status-btn" onClick={() => onChangeStatus()}>change status</button>
                </div>
                <div >
                    <button className="profile-btn" onClick={() => navigate("/Profile")}> edit profile</button>
                </div> 
                <div>
                    <Logout/>
                </div>
                </div> : 
                <PrivateChat user={tab}/> }

           
            
        </div>
    )
}


export default MainPage

    // return(
    //     <ul>
    //         {members.map(d=> <li>{d.username}</li>)}
    //     </ul>
    // )

