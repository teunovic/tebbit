
function createUser(session, user) {
    let queries = [];
    queries.push(
        session.run('MERGE (u: User {username: $username, password: $password}) ' +
            'RETURN u',
            {
                username: user.username,
                password: user.password
            }
        )
    );

}


function deleteUser(session, user) {
    let queries = [];
    queries.push(
        session.run('MATCH (u: User {username: $username, password: $password}) DETACH DELETE u ' +
            'RETURN u',
            {
                username: user.username,
                password: user.password
            }
        )
    );
}

function updateUser(session, user) {
    let queries = [];
    queries.push(
        session.run('MATCH (n: User {username: $username}) ' +
            'SET n.password = $password_new ' +
            'RETURN n',
            {
                password: user.password_new
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




module.exports = {
    createUser: createUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    removeFriend: removeFriend,
    addFriend: addFriend,
};