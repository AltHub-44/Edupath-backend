# EDUPATH

### Introduction

EduPath Backend API services




### Installation Guide

* Download and Install Postgres SQL, you can use [this](https://www.w3schools.com/postgresql/postgresql_install.php) guide for easier process

* Setup a Postgres database and note the dtatbase name, the username and the password

* Navigate to your editor, open terminal and proceed as follow


```bash
git clone https://github.com/AltHub-44/Edupath-backend.git
```


* Navigate to the project directory:
```bash
    cd Edupath-backend
```
* Run `npm install` to install all dependencies
*clone the .env.example into .env
```bash
cp .env.example .env
```
for windows user
```bash
copy .env.example .env
```
* Assign your database values to their corresponding environment variables and
run `nodemon server.js`