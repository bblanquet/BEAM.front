##Development Recipe
clone repository
npm install
npm run start
open browser to http://localhost:8080

##Docker Recipe
clone repository
npm install
npm build:local
docker build -t imagename .
docker run --detach --publish 8282:8282 --name containername imagegname
open browser to http://localhost:8282

##demo
[here](https://kimchistudio.tech/wp/front)
##docker image
[here](https://hub.docker.com/repository/docker/kimchiboy/wp_front)