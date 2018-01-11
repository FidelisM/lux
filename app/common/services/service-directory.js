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
        addMember: '/spoqn/convo/members/add',
        removeMember: '/spoqn/convo/members/remove',
        getMessages: '/spoqn/convo/messages/:id',
        getMembers: '/spoqn/convo/members/:id'
    },
    friend: {
        add: '/spoqn/friends/add',
        getAll: '/spoqn/friends'
    }
}