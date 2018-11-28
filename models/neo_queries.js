
function createUser(session, user) {
    let queries = [];
    queries.push(
        session.run('MERGE (u: User {username: $username}) ' +
            'RETURN u',
            {
                username: user.username
            }
        )
    );

}


function deleteUser(session, user) {
    let queries = [];
    queries.push(
        session.run('MATCH (u: User {username: $username}) DETACH DELETE u ' +
            'RETURN u',
            {
                username: user.username
            }
        )
    );
}

function addFriend(session, userName, otherName) {
    return session.run(
        'MATCH (user1: User {username: $userName}), (user2: User {username: $otherName}) ' +
        'CREATE (user1)-[:FRIEND]->(user2) ' +
        'RETURN user1, user2',
        {
            userName: userName,
            otherName: otherName
        }
    );
}


function removeFriend(session, userName, otherName) {
    return session.run(
        'MATCH (user1:User)-[r:FRIEND]-(user2:User) ' +
        'WHERE (user1.username = $username1 AND user2.username = $username2) OR (user1.username = $username2 AND user2.username = $username1) ' +
        'DELETE r',
        {
            username1: userName,
            username2: otherName
        }
    );
}

function getFriendship(session, user1, user2) {
    return session.run(
        'MATCH (user1:User)-[r:FRIEND]-(user2:User) ' +
        'WHERE (user1.username = $username1 AND user2.username = $username2) OR (user1.username = $username2 AND user2.username = $username1) ' +
        'RETURN r',
        {
            username1: user1,
            username2: user2
        }
    );
}




module.exports = {
    createUser,
    deleteUser,
    removeFriend,
    addFriend,
    getFriendship
};