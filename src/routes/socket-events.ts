import { SocketEvent } from '../infrastructure/socket-io-controller';

const joinRoomEvent: SocketEvent = {
    name: 'join-room',
};

const addNewRoomMemberEvent: SocketEvent = {
    name: 'add-new-room-member',
};

const fulfillRoomEvent: SocketEvent = {
    name: 'fulfill-room-event',
};

const findAvailableRoomEvent: SocketEvent = {
    name: 'find-available-room',
};

export {
    joinRoomEvent,
    addNewRoomMemberEvent,
    fulfillRoomEvent,
    findAvailableRoomEvent,
};
