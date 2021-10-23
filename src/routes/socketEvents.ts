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
    name: 'update-field',
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
