import { SocketEvent } from '../infrastructure/socketIOController';

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

const updateFieldEvent: SocketEvent = {
    name: 'udpate-field',
};

const tryMoveEvent: SocketEvent = {
    name: 'try-move',
};

export {
    joinRoomEvent,
    addNewRoomMemberEvent,
    fulfillRoomEvent,
    findAvailableRoomEvent,
    updateFieldEvent,
    tryMoveEvent,
};
