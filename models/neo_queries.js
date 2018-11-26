
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

}


function addFriend(session, user) {

}


function removeFriend(session, user) {

}




module.exports = {
    createUser: createUser,
    deleteUser: deleteUser(),
    removeFriend: removeFriend(),
    addFriend: addFriend(),
};