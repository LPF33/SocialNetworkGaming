import * as io from 'socket.io-client';
import { chatMessages, chatMessage , inviteChat, invitePlay, acceptChat, singleChat, getAllFriendsOnline,getAllUsersOnline} from './actions';

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on(
            "chatMessages",
            messageHistory => store.dispatch(
                chatMessages(messageHistory)
            )
        );

        socket.on(
            "chatMessage",
            message => store.dispatch(
                chatMessage(message)
            )
        );

        socket.on(
            "chatInvitation",
            invitation => store.dispatch(
                inviteChat(invitation)
            )
        );

        socket.on(
            "acceptChatInvitation",
            data => store.dispatch(
                acceptChat(data)
            )
        );

        socket.on(
            "singleChatMessage",
            data => store.dispatch(
                singleChat(data)
            )
        );

        socket.on(
            "gameInvitation",
            invitation => store.dispatch(
                invitePlay(invitation)
            )
        );

        socket.on(
            "useronline",
            () => {
                store.dispatch(getAllFriendsOnline());
                store.dispatch(getAllUsersOnline());
            }
        );
    }
};