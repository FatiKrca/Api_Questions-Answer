# Api_Questions/Answer
The project is a backend API that provides functionality for a site like StackOverflow. 
The API responds to get/put/post/delete requests using a MongoDB database and uses JSON Web Tokens for user registration and login. 
Passwords are hashed in the database and only administrators can perform block/unblock operations.
Registered users can share questions and provide answers. 
Additionally, registered users are allowed to like/dislike questions and answers, and user records are kept for this operation.

Furthermore, real email accounts are used for password reset, where users can reset their passwords via verification codes sent to their registered email addresses. Verification codes used in the API are generated randomly and can only be used once, preventing misuse and ensuring the security of the password reset process.

This comprehensive API provides essential functionality for a site like StackOverflow, such as user asking, answering, and liking questions, and is managed securely.

Postman Picture:
![image](https://user-images.githubusercontent.com/101465668/226070382-0b5423f3-55ce-4a82-ba98-f126d658865f.png)
![image](https://user-images.githubusercontent.com/101465668/226070426-b38c7a8f-eb13-4e8e-ac55-d72f79ef120f.png)
![image](https://user-images.githubusercontent.com/101465668/226070444-bc845f07-5d32-4ce8-91eb-7089b960aea1.png)

MongoDb Picture:
![image](https://user-images.githubusercontent.com/101465668/226070520-567fa698-d92f-40a0-b854-c7b7af063cda.png)
![image](https://user-images.githubusercontent.com/101465668/226070578-ed55724b-01d0-49d7-80d3-6c0ceed3d56d.png)
![image](https://user-images.githubusercontent.com/101465668/226070597-4733be6a-4ac6-48f8-a9b5-f48f80c61b4d.png)
