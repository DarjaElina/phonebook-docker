db.createUser(
  {
    user: 'the_user',
    pwd: 'the_password',
    roles: [
      {
        role: 'readWrite',
        db: 'my_db'
      }
    ]
  }
)

db.createCollection('people')

db.todos.insert({ name: 'Anna', number: '040-123456' })
db.todos.insert({ name: 'Alex', number: '041-123456' })