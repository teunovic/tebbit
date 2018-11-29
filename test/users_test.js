const assert = require('assert');
const User = require('../models/users');


describe('Users testing environment', () => {
    it('Saves a user', () => {
        const user1 = new User({username: 'user1', password: '123'});

        user1.save();
        user2.save();
    });
});
