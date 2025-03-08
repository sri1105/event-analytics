export default Object.freeze({
    DB_OPERATIONS: {
        INSERT: 'insert',
        UPDATE: 'update',
        DELETE: 'delete',
        FIND: 'find',
        COUNT: 'count',
    },
    COLLECTIONS: {
        USERS: 'users',
        APPS: 'apps',
        STATUS_MESSAGE: 'status_message',
        EVENTS: 'events',
    },
    STATUS_CODES: {
        SYSTEM_ERROR: '6',
        SUCCESS: '9'
    },
    SYSTEM_MESSAGE: {
        SYSTEM_ERROR: 'Oops something went wrong.',
        USER_ID_REQUIRED: 'User id is required.',
        USER_NOT_FOUND: 'User not found.',
        INVALID_API_KEY: 'Invalid API key.',
        API_KEY_REQUIRED: 'API key is required.',
        APP_ID_NOT_FOUND: 'App id not found.',
    }
});