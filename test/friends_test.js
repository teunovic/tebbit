const assert = require('assert');
const User = require('../models/users');


describe('Friends testing environment', () => {
    it('Saves a friendship', () => {
        const user1 = new User({username: 'user1'});
        const user2 = new User({username: 'user2'});

        user1.save();
        user2.save();
    });
});
