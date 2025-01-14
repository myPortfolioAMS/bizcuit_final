<div style="display: flex; justify-content: center;">
<img src="https://www.dotslash.nl/wp-content/uploads/2021/08/Bizcuit-logo.png" alt="Bizcuit logo" width="1000" />

</div>

<h1 style="text-align: center;">ToDo Application - Backend </h1>


A ToDo application developed as an assignment to deploy a backend API  to allow user to create tasks, manage them, put deadlines on tasks and mark them as done. It provides endpoints to create, read, update and delete tasks with comprehensive API documentation.


---
## Table of Content


1. [Project Name and Introduction](#project-name-and-introduction)
2. [Features](#features)
3. [Stack](#stack)
4. [Requirements](#requirements)
5. [Recommended Modules](#recommended-modules)
6. [Installation](#installation)
7. [Swagger and API Documentation](#swagger-and-api-documentation)
8. [Testing](#testing)
9. [Design Decisions](#design-decisions)
10. [Potential Improvements](#potential-improvements)
11. [Stay in Touch](#stay-in-touch)
12. [License](#license)


---

## 2. Features

- JWT based authentication
- User registration and login
- Task creation, retrieval, updating and deletion
- PostgreSQL as database
- TypeORM for Object Relational Mapper for TypeScript
- Event logging & Centralized error handling
- Comprehensive API documentation with Swagger

---

## 3. Stack

- Language: TypeScript (Node.js)
- Framework: NestJS
- Database: PostgreSQL with TypeORM
- Authentication: JWT-based authentication


---

## 4. Requirements

Before starting, ensure you have the following installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for local testing, if needed)
- [psql](https://www.postgresql.org/docs/current/app-psql.html) (PostgreSQL CLI)

---

## 5. Recommended Modules (optional)

While not mandatory, the following tools are recommended for smoother development and debugging:
- [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) for API testing
- [PostgreSQL client](https://dbeaver.io/) (optional, for database debugging)

---

## 6. Installation


### Setup Instructions

### 6.1 Clone the repository

```bash
git clone https://github.com/myPortfolioAMS/bizcuit_final.git
cd bizcuit_final
cd bizcuit_backend
```

### 6.2 Install Dependencies

Run the following command to install all required Node.js packages:
```bash
npm install 
```
### 6.3 Set up Environment Variables

Create a .env file in the root directory with the following content:

```env
DB_HOST=localhost
DB_PORT=5437
DB_USERNAME=bizcuit_user
DB_PASSWORD=bizcuit_password
DB_NAME=bizcuit_database
DB_SYNC=true
```

### 6.4 PostgreSQL & Import Data

### 6.4.1 Pull the PostgreSQL Docker Image

```bash
Open a terminal and pull the latest PostgreSQL image:
docker pull postgres:latest
```

### 6.4.2 Run the PostgreSQL Container

Ensure Docker is running before executing this command
```bash
Start a PostgreSQL container :
 docker run --name bizcuit_postgres \
   -e POSTGRES_USER=bizcuit_user \
   -e POSTGRES_PASSWORD=bizcuit_password \
   -e POSTGRES_DB=bizcuit_database \
   -p 5437:5432 \
   -d postgres

```
### 6.4.3 Verify the Database is running

```bash
List running containers:
 docker ps
```
You should see bizcuit_postgres in the list with 5437 as the bound port.

### 6.4.4 Connect to PostgreSQL database using psql:

```bash
psql -h localhost -p 5437 -U bizcuit_user -d bizcuit_database
```
Once connected, you’ll see a prompt like this:

```sql
bizcuit_database=#
```

### 6.4.5 Database Schema:


### Tasks Table    

    The `Tasks` table stores information about tasks created by users.

| Column       | Data Type               | Constraints                 | Default Value |
|--------------|-------------------------|-----------------------------|---------------|
| id           | INTEGER, PRIMARY KEY    | AUTO_INCREMENT              | N/A           |
| title        | VARCHAR                 | NOT NULL                    | N/A           |
| description  | TEXT                    | NOT NULL                    | N/A           |
| category     | TEXT                    | NOT NULL                    | 'General'     |
| dueDate      | TIMESTAMP WITH TIME ZONE| NULLABLE                    | NULL          |
| sharedTask   | BOOLEAN                 | NOT NULL                    | false         |
| sharedUser   | TEXT                    | NOT NULL                    | 'General'     |
| completed    | BOOLEAN                 | NOT NULL                    | false         |
| userId       | INTEGER, FOREIGN KEY    | REFERENCES Users(id) ON DELETE CASCADE | N/A |


   
### Users Table
The `Users` table stores information about registered users.

| Column   | Data Type   | Constraints           | Default Value |
|----------|-------------|-----------------------|---------------|
| id       | INTEGER     | PRIMARY KEY, AUTO_INCREMENT | N/A       |
| username | VARCHAR     | UNIQUE, NOT NULL      | N/A           |
| password | VARCHAR     | NOT NULL              | N/A           |



### 6.4.6 Start the application

```bash
npm run start:dev
```

---
### 7. Swagger and API Documentation 

API documentation is auto-generated and available at http://localhost:3000/api-docs

**7.1 Authentication**</br>
**Register a User**

**POST** /auth/register

Request Body:
```bash
{
  "username": "bizcuit_developer@bizcuit.com",
  "password": "bizcuit_password"
}
```

Response:

```bash
{
  "message": "User registered successfully"
}
```
---
**7.2 Login**

**POST** /auth/login

Request Body:
```bash
{
  "username": "bizcuit_developer@bizcuit.com",
  "password": "bizcuit_password"
}
```

Response:

```bash
{
  "access_token": "jwt_token",
   "user": {
        "id": 1,
        "username": "bizcuit_developer@bizcuit.com"
}
```
---
**7.3 CRUD - CREATE, RETRIEVE, UPDATE & DELETE Endpoints (Protected)**

Included the JWT token in the Authorization header for all requests.


**7.3.1 Create Task Record**

**POST** /tasks

Request Body:

```json
{
"title": "developer 5 take a swhoer",
  "description": "shower is important",
  "category":"Leisure",
  "dueDate": "2025-01-15T00:00:00.000Z",
  "sharedTask": true,
  "sharedUser": "1",
  "completed": false
}
```

Response:

```bash
{
    "title": "developer 5 take a swhoer",
    "description": "shower is important",
    "category": "Leisure",
    "dueDate": "2025-01-15T00:00:00.000Z",
    "sharedTask": true,
    "sharedUser": "1",
    "completed": false,
    "user": 1,
    "id": 28
    }
```
---
**7.3.2 Get Tasks Data**

**GET** BY TASK ID /tasks/:id

Path Variables:
```Params

  key: id
  value: 12
```

Response:

```json
{
 "id": 12,
    "title": "Leisure Time off",
    "description": "Cycling in the Amsterdam forest",
    "category": "Leisure",
    "dueDate": "2025-01-15T00:00:00.000Z",
    "sharedTask": true,
    "sharedUser": "1",
    "completed": false
}
```
---
**GET** all tasks /tasks

Response:

```json
[
    {
        "id": 1,
        "title": "comprar remédio da alergia",
        "description": "Remédio Alergia",
        "category": "FARMACY",
        "dueDate": "2025-01-12T00:00:00.000Z",
        "sharedTask": false,
        "sharedUser": "",
        "completed": true
    },
    {
        "id": 5,
        "title": "looking for new glasses",
        "description": "looking for new glasses",
        "category": "HOME",
        "dueDate": "2025-01-17T00:00:00.000Z",
        "sharedTask": true,
        "sharedUser": "2",
        "completed": false
    },
    ...
    ...
    ,
    {
        "id": 22,
        "title": "Novo teste 456",
        "description": "Novo teste 456",
        "category": "Bills",
        "dueDate": "2025-01-30T00:00:00.000Z",
        "sharedTask": true,
        "sharedUser": "5",
        "completed": false
    },
    {
        "id": 23,
        "title": "Novo teste 789",
        "description": "Novo teste 789",
        "category": "Bills",
        "dueDate": "2025-01-31T00:00:00.000Z",
        "sharedTask": true,
        "sharedUser": "3",
        "completed": false
    },
]
```
---
**GET** Shared Tasks BY sharedUser /tasks/shared/:sharedUser


Path Variables:
```Params

  key : sharedUser
  value: 1
```


Response:

```json
{
        "id": 28,
        "title": "Bizcuit Assignment",
        "description": "Deploy YUP for form/field validation",
        "category": "Work",
        "dueDate": "2025-01-15T00:00:00.000Z",
        "sharedTask": true,
        "sharedUser": "1",
        "completed": false
}
```
---
**GET** Tasks BY user ID /tasks/userId/:userId

Path Variables:
```Params

  key : userId
  value: 3
```

Response:

```json
{
{
        "id": 10,
        "title": "Walk the dog",
        "description": "take Preta for a walk",
        "category": "Leisure",
        "dueDate": "2025-01-15T00:00:00.000Z",
        "sharedTask": false,
        "sharedUser": "",
        "completed": false,
        "user": {
            "id": 3,
            "username": "developer_3@bizcuit.com",
        }
    }
}
```
---
**7.3.3 Update Tasks Data**

**PUT** Update Task BY Id /tasks/:id

Path Variables:
```Params

  key : id
  value: 1
```

Request Body:

```json
{
    "title": "comprar remédio da alergia",
    "description": "Remédio Alergia",
    "category": "FARMACY",
    "dueDate": "2025-01-12T00:00:00.000Z",
    "sharedTask": false,
    "sharedUser": "",
    "completed": true
}
```

Response:

```json
{
    "id": 1,
    "title": "comprar remédio da alergia",
    "description": "Remédio Alergia",
    "category": "FARMACY",
    "dueDate": "2025-01-12T00:00:00.000Z",
    "sharedTask": false,
    "sharedUser": "",
    "completed": true
}
```
---
**7.3.4 Delete Tasks Data**

**DELETE** Delete Task BY Id /tasks/:id

Path Variables:
```Params

  key : id
  value: 3
```

Response:

```json
{
        "message": "Task with ID 3 was deleted"
}
```
---
### 8. Testing

- **8.1** Use Postman or curl to test endpoints
- **8.2** Authenticate to obtain a JWT token before accessing secured endpoints.
- **8.3** for a unit test, run npx jest src/tasks/tasks.service.spec.ts on the root folder.

---

### 9. Design Decisions

- **9.1 Framework**: NestJS for modularity and TypeScript support.
- **9.2 Database**: TypeORM with PostgreSQL for ORM capabilities.
- **9.3 Security**: Exclude sensitive fields like password and use hashing.
- **9.4 Logging**: Use NestJS's Logger for observability.
- **9.5 Error Handling**: Standardized exceptions like NotFoundException.
- **9.6 API Documentation**: Swagger for developer-friendly documentation.
- **9.7 Modular Design**: Feature-based modules for scalability.
- **9.8 Testing**: Jest for robust unit and integration tests.
- **9.9 Collaboration**: Support for shared tasks (sharedTask, sharedUser fields).
- **9.10 REST API**: Follows REST principles for consistent endpoint design.

---

### 10. Potential Improvements
If this project were to be production-ready, the following improvements would be considered:
- **10.1 Performance Improvements**: Query Optimization, Database Indexing and Caching.
- **10.2 Security Enhancements**: Improve password management, rate limiting, secure API communication, input validation and sensitive data protection.
- **10.3 Authorization Enhancements:** Role-Based Access Control (RBAC), JWT improvements and OAuth2.0 Support for third party integrations.
- **10.4 Scalability Enhancements:** Horizontal and Database scalling, Load Balancing, Async Processing.
- **10.5 Testing:** Increase test coverage with integration test for API endpoints amd load tests using Artillery or k6
- **10.6 Monitoring:** Add monitoring tools like New Relic for observability.
- **10.7 Suggsted AWS Architecture:** 

      - **10.7.1 API Gateway**
            Acts as the main entry point.
            Handles rate limiting, throttling, and request validation.

      - **10.7.2 ECS/EKS**
            Runs the backend services in containers.
            Scales automatically based on traffic.

      - **10.7.3 RDS (PostgreSQL)**
            Managed database service with Read Replicas and Multi-AZ for high availability.

      - **10.7.4 ElastiCache (Redis)**
            Caches frequently accessed data for faster performance.

      - **10.7.5 SQS**
            Handles asynchronous tasks like notifications or background jobs.

      - **10.7.6 CloudWatch**
            Provides centralized logging and monitoring for all services.
            
      - **10.7.7 Secrets Manager**
            Stores sensitive information securely (e.g., database credentials, JWT secrets).

---

## 11. Stay in Touch

- Author - [Miguel Gil](https://www.linkedin.com/in/mggil/)
- email - [miguel.gustavo.gil@gmail.com](miguel.gustavo.gil@gmail.com)
- mobile - +31 6 450 36 513
- 1181 CR Amstelveen, The Netherlands

---
## 12. License

This project is licensed under the MIT License. You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, provided that proper credit is given.

See the [LICENSE](./LICENSE) file for more details.

