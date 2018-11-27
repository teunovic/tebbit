
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

//TODO: add friends property to user in neo4j

function deleteUser(session, user) {

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
        'CREATE (user2)-[:FRIEND]->(user1) ' +
        'RETURN user1, user2',
        {
            userName: userName,
            otherName: otherName
        }
    );
}


function removeFriend(session, userName, otherName) {
    return session.run(
        'MATCH (user1: User {username: $userName})-[r:FRIEND]-(user2: User {username: $otherName}) ' +
        'DELETE r',
        {
            userName: userName,
            otherName: otherName
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