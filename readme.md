# TASK CREATION API - OPENIN APP ASSIGNMENT

This is a Task creating and managing API built using Node.js and MongoDB.

### Deployed live at [https://task-management-rcxq.onrender.com](https://task-management-rcxq.onrender.com)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rishavchanda/openin_app_assignment
   cd openin_app_assignment
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up MongoDB:**

   - Make sure MongoDB is installed and running on your machine or you can use my mongo db test url.
   - Create a `.env` file in the root directory with the following content:

     ```env
     MONGO_URL=mongodb://localhost:27017/openin_app_assignment
     ```

     or

     ```
     MONGO_URL = "mongodb+srv://<username>:<password>@<clusterName>.<clusterID>.mongodb.net/?retryWrites=true&w=majority"
     ```

4. **Set up Enviornment Variables**
   - On the `.env` file add the variables:
     ```
     MONGO_URL=""
     JWT=""
     TWILLO_ACCOUNT_SID=""
     TWILLO_AUTH_TOKEN=""
     ```

## Running the Application

```bash
npm start
```

## API Endpoints

### User

| Method | Endpoint             | Description         | Request Body                  | Response Body              |
| ------ | -------------------- | ------------------- | ----------------------------- | -------------------------- |
| `POST` | `/api/user/register` | Register a new User | JSON: {phone_number,priority} | JSON: {token,user,message} |
| `GET`  | `/api/user/:user_id` | Get User details    | NULL                          | JSON: {user}               |

### Tasks

| Method   | Endpoint             | Description                | Query                                   | Headers                         | Request Body                       | Response Body                                |
| -------- | -------------------- | -------------------------- | --------------------------------------- | ------------------------------- | ---------------------------------- | -------------------------------------------- |
| `GET`    | `/api/task/`         | Get all Tasks of the User  | priority, status, due_date, page, limit | Authorization: Bearer JWT token | N/A                                | JSON: {docs,totalDocs,page,limit,totalPages} |
| `POST`   | `/api/task/`         | Create a new task for User | N/A                                     | Authorization: Bearer JWT token | JSON: {title,description,due_date} | JSON: {task,message}                         |
| `PATCH`  | `/api/task/:task_id` | Update task for User       | N/A                                     | Authorization: Bearer JWT token | JSON: {status,due_date}            | JSON: {task,message}                         |
| `DELETE` | `/api/task/:task_id` | Soft Delete task for User  | N/A                                     | Authorization: Bearer JWT token | N/A                                | JSON: {task,message}                         |

### Sub Tasks

| Method   | Endpoint                 | Description                    | Query   | Headers                         | Request Body    | Response Body           |
| -------- | ------------------------ | ------------------------------ | ------- | ------------------------------- | --------------- | ----------------------- |
| `GET`    | `/api/sub-task/`         | Get all Sub Tasks of the User  | task_id | Authorization: Bearer JWT token | N/A             | JSON: {subTasks}        |
| `POST`   | `/api/sub-task/`         | Create a new Sub Task for User | N/A     | Authorization: Bearer JWT token | JSON: {task_id} | JSON: {subTask,message} |
| `PATCH`  | `/api/task/:sub_task_id` | Update Sub Task for User       | N/A     | Authorization: Bearer JWT token | JSON: {status}  | JSON: {subTask,message} |
| `DELETE` | `/api/task/:sub_task_id` | Soft Delete Sub Task for User  | N/A     | Authorization: Bearer JWT token | N/A             | JSON: {subTask,message} |

### Cron Jobs

| Name                     | Function Name     | Description                                                                                        |
| ------------------------ | ----------------- | -------------------------------------------------------------------------------------------------- |
| Task Priority            | `priorityCronJob` | It runs at midnight and checks the date and updates the priority accordingly                       |
| Call User if Task is Due | `priorityCronJob` | It runs after every hour and checks if task is due for some user calls the user and gives reminder |

## License

[MIT](https://choosealicense.com/licenses/mit/)
