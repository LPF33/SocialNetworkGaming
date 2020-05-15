import axios from "../axios.js";

export async function loadFriends(){

    const friends = await axios.get("/loadmyfriends");

    return {
        type: "loadFriends",
        loadfriends: friends.data.friends
    };
}

export async function accept(otherUserId){
    await axios.post(`/crudfriendstatus/${otherUserId}/request-made-by-other`);

    return {
        type: "accept",
        id: otherUserId
    };
}

export async function unfriend(otherUserId){
    await axios.post(`/crudfriendstatus/${otherUserId}/request-accepted`);

    return {
        type: "unfriend",
        id: otherUserId
    };
}

export function chatMessages(messageHistory){
    return {
        type: "messageHistory",
        messageHistory: messageHistory.data
    };
}

export function chatMessage(message){
    return {
        type: "receivedMessage",
        message : message
    };
}

export async function getAllUsersOnline(){
    const allUsersOnline = await axios.post("/getallusersonline");

    return {
        type: "usersOnline",
        data: allUsersOnline.data.allUsersOnline
    };
}

export async function getAllFriendsOnline(){
    const allFriendsOnline = await axios.post("/getallfriendssonline");

    return {
        type: "usersFriendsOnline",
        data: allFriendsOnline.data.allFriendsOnline
    };
}

export function inviteChat(invitation){
    return {
        type: "chatInvitation",
        data: invitation
    };
}

export function invitePlay(invitation){
    return {
        type: "gameInvitation",
        data: invitation
    };
}

export function acceptChat(data){
    return {
        type: "acceptChatInvitation",
        data: data
    };
}

export function singleChat(data){
    return{
        type: "singleChat",
        data: data
    };
}

export function acceptInvitationTrue(index){
    return{
        type: "acceptInvitationTrue",
        index: index
    };
}

export function declineChatInvitation(index){
    return{
        type: "declineChatInvitation",
        index: index
    };
}
