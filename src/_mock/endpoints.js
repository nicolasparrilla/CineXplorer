/*
http://localhost:4000/api/users/registration
{
    "name": "Nicolás Parrilla",
    "email": "cuentacolegio3@gmail.com",
    "password": "password"
}

http://localhost:4000/api/users/login
{
    "email": "nicolasparrilla01@gmail.com",
    "password": "password"
}

http://localhost:4000/api/users/lists/addMovie
{
    "userId": "6677afbc070e2a3bc00e6a28",
    "listId": "favoritas",
    "movieId": "11"
}

http://localhost:4000/api/users/lists/removeMovie
{
    "userId": "6677afbc070e2a3bc00e6a28",
    "listId": "favoritas",
    "movieId": "11"

}

http://localhost:4000/api/users/lists/
{
    "userId": "6677afbc070e2a3bc00e6a28"
}

http://localhost:4000/api/users/forgot-password
{
    "email": "naparrilla2012@gmail.com"
}

http://localhost:4000/api/users/reset-password
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2M5OGIyOTNjZDNmMjY3NDljNzRiMiIsImlhdCI6MTcyMDIwNjg4MSwiZXhwIjoxNzIwMjEwNDgxfQ.0VaCBhw5yk7OYZem7mR8-Wsq1TWhV-oJt6Jpf9codTM",
    "newPassword": "password3"
}

*/