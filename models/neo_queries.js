
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



function addFriend(session, user) {

}


function removeFriend(session, user) {

}




module.exports = {
    createUser: createUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    removeFriend: removeFriend,
    addFriend: addFriend(),
};