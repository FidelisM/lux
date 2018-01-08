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
        addMember: '/spoqn/convo/member/add',
        removeMember: '/spoqn/convo/member/remove',
        getMessages: '/spoqn/convo/:id',
        getMembers: '/spoqn/convo/member/:id'
    },
    friend: {
        add: '/spoqn/friends/add',
        getAll: '/spoqn/friends'
    }
}