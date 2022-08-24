# Task Manager API

## _An Api for managing various task_

[![Build Status](https://circleci.com/gh/nkasi-e/task-manager-app/tree/.png?circle-token=:circle-token)]

## Features

- [x] Users can create a personally secured account.
- [x] Users can Login to their account.
- [x] Users can create tasks.
- [x] Users can update task.
- [x] Users can update profile details.
- [x] Users can search for task.
- [x] Supports reading of all the task.
- [x] Users can filter the list of task they want see.
- [x] Users can sort for task in Ascending or descending order.
- [x] Supports paging if we have so many task
- [x] Users can delete tasks.
- [x] Users can delete their personal account.
- [x] Users can logout their account from a single device.
- [x] Users can logout from every device their account is being logged in
- [x] Support profile picture upload
- [x] Users can update their profile picture
- [x] Users can delete their profile picture

## Root Endpoint

[https://nkasitaskmanager-api.herokuapp.com]

## API Documentation

API documentation:

[https://documenter.getpostman.com/view/21638586/VUqrPHfS]

> The purpose of the task manger API is to give users the ability to create and manage their own task when necessary so as to help the users keep track of what task is needed to be done and also the task that has already been done completely.

## Getting Started

### Prerequisites

In order to install and run this project locally, you would need to have the following installed on your local machine.

- Node JS
- MongoDB
- Robo 3T

### Installation

- Clone this repository

```
git clone [https://github.com/nkasi-e/Task-Manager-API.git]
```

- Navigate to the project directory
- Run `npm install` or `yarn` to install the project dependencies
- create a `.env` file and copy the contents of the `dev.env` file into it and supply the values for each variable

```
cp dev.env .env
```

- Create a MongoDB database and run the mongoose file in the models directory to migrate the database
