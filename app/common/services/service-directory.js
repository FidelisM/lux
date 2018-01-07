export default {
    login: {
        url: '/spoqn/login'
    },

    register: {
        url: '/spoqn/register'
    },

    refresh: {
        url: '/spoqn/refresh'
    },
    room: {
        create: '/spoqn/convo/create',
        allRooms: '/spoqn/convo',
        addMember: '/spoqn/convo/member/add'
    },
    chat: {
        openConnection: '/spoqn/messenger/open/:id',
        getMessages: '/spoqn/convo/:id'
    },
    friend: {
        add: '/spoqn/friends/add',
        getAll: '/spoqn/friends'
    }
}