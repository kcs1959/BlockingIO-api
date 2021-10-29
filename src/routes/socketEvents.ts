import { SocketEvent } from '../infrastructure/socketIOController';

const joinRoomEvent: SocketEvent = {
    name: 'join-room',
};

const roomStateEvent: SocketEvent = {
    name: 'room-state',
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

const requestAfterGameEvent: SocketEvent = {
    name: 'request-after-game',
};

const setupUidEvent: SocketEvent = {
    name: 'setup-uid',
};

const updateUserEvent: SocketEvent = {
    name: 'on-update-user',
};

export {
    joinRoomEvent,
    roomStateEvent,
    findAvailableRoomEvent,
    updateFieldEvent,
    tryMoveEvent,
    requestAfterGameEvent,
    setupUidEvent,
    updateUserEvent,
};
