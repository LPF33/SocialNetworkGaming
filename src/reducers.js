export default function (state = {}, action) {

    if(action.type == "loadFriends"){
        let allFriends;
        if(action.loadfriends.length > 0){
            allFriends = action.loadfriends;
        } else {
            allFriends = null;
        }
        
        state = {
            ...state,
            loadfriends: allFriends
        };
    }

    if(action.type == "accept"){
        state = {
            ...state,
            loadfriends: state.loadfriends.map(friend => {
                if(friend.id == action.id){
                    friend.accepted = true;
                }
                return friend;
            })
        };
    }

    if(action.type == "unfriend"){
        state = {
            ...state,
            loadfriends: state.loadfriends.filter(friend => {
                if(friend.id == action.id){
                    return false;
                } else {
                    return true;
                }
            })
        };
    }

    if(action.type == "messageHistory"){
        state = {
            ...state,
            allMessages: action.messageHistory
        };
    }

    if(action.type == "receivedMessage"){

        const newData = state.allMessages ? [...state.allMessages, action.message] : [action.message];

        state = {
            ...state,
            allMessages: newData
        };
    }

    if(action.type == "usersOnline"){
        const allUsersOnline = [...action.data];
        
        state = {
            ...state,
            allUsersOnline
        };
    
    }

    if(action.type == "usersFriendsOnline"){
        const allFriendsOnline = [...action.data];
        
        state = {
            ...state,
            allFriendsOnline
        };
    
    }

    if(action.type == "chatInvitation"){

        const allChatInvitations = state.allChatInvitations ? [...state.allChatInvitations, action.data] : [action.data];
    
        state = {
            ...state,
            allChatInvitations
        };
    }

    if(action.type == "gameInvitation"){

        const allGameInvitations = state.allGameInvitations ? [...state.allGameInvitations, action.data] : [action.data];
    
        state = {
            ...state,
            allGameInvitations
        };
    }

    if(action.type == "acceptChatInvitation"){
        const allChatInvitations = state.allChatInvitations ? [...state.allChatInvitations, action.data] : [action.data];
    
        state = {
            ...state,
            allChatInvitations
        };
    }

    if(action.type == "singleChat"){
        const RoomMessages = state.RoomMessages ? [...state.RoomMessages, action.data] : [action.data];
    
        state = {
            ...state,
            RoomMessages
        };
    }

    if(action.type == "acceptInvitationTrue"){

        state = {
            ...state,
            allChatInvitations : state.allChatInvitations.map((item,index) => {
                if(index==action.index){
                    item.accept = true;
                }
                return item;
            })
        };
    }

    if(action.type == "declineChatInvitation"){
        if(state.allChatInvitations.length>1){
            state.allChatInvitations.splice(action.index,1);
        } else {
            delete state.allChatInvitations;
        }

        state = {
            ...state
        };
    }

    return state;
}