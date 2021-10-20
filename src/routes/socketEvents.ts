import { SocketEvent } from '../infrastructure/socketIOController';

const joinRoomEvent: SocketEvent = {
    name: 'join-room',
};

const roomStateEvent: SocketEvent = {
    name: 'room-state-event',
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
    roomStateEvent,
    findAvailableRoomEvent,
    updateFieldEvent,
    tryMoveEvent,
};
