# Blogging
- Web app to post Blogs using nodejs, MongoDB
- supports user Login/sginUp + auth
- You should be a user to post a blog

# Building & Deployment
- require Nodejs
- require MongoDB either in your local or using Atlas 

## linux Users Deployment
- nodejs

1. use `sudo apt install nodejs` or you can use the Snap Store and search for node
  version that I used without any issues 17.8.0v 
2. check your version `node -v && npm -v`

- MongoDB

1. use `wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -` you should get <b>OK</b>
  if you faced an issue use `sudo apt-get install gnupg` then repate from 1 again
2. use `echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list`
3. use `sudo apt-get update` to reload a local package database
4. use `sudo apt-get install -y mongodb-org`

Run MongoDB
1. use `sudo systemctl start mongod`
2. use `sudo systemctl status mongod`

if you faced an issue use `sudo systemctl daemon-reload` to restart mongo

## deploy the project 
- cd ~/Blogging 
- use `node .`
- go to `localhost:4001`
