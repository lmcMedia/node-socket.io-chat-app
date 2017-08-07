const expect = require('expect');
const {Users} = require('./../utils/users');

describe('Users', () => {

  // seed data
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node Fans'
    }, {
      id: '2',
      name: 'Chris',
      room: 'Reaktor Fans'
    }, {
      id: '3',
      name: 'Steve',
      room: 'Node Fans'
    }];
  });

  it('should add a new user object', () => {
    let users = new Users();
    let user = {
      id: '123',
      name: 'Chris',
      room: 'Node Fans'
    };
    let result = users.addUser(user.id, user.name, user.room);

    // 1st users is the Users object, 2nd users is the users array in the object
    expect(users.users).toEqual([user]);
  });

  it('should return names for node fans', () => {
    let userList = users.getUserList('Node Fans');
    expect(userList).toEqual(['Mike', 'Steve']);
  });

  it('should return names for reaktor fans', () => {
    let userList = users.getUserList('Reaktor Fans');
    expect(userList).toEqual(['Chris']);
  });

  it('should remove a user', () => {
    let userId = '1';
    let user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should NOT remove a user', () => {
    let userId = '99';
    let user = users.removeUser(userId);
    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should get a user', () => {
    let result = users.getUser('1');
    expect(result.name).toEqual('Mike');
  });

  it('should NOT get a user', () => {
    let result = users.getUser('blah');
    expect(result).toNotEqual('Mike');
  });

});
