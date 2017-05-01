Course Planner [![CircleCI](https://circleci.com/gh/rit-sse/CoursePlanner/tree/master.svg?style=svg)](https://circleci.com/gh/rit-sse/CoursePlanner/tree/master)
=============

An application for planning which courses to take and which year to take them in.

Please refer to the <a href="https://github.com/rit-sse/CoursePlanner-/wiki" target="_blank">github wiki</a> for more information on dev environment setup and other info

<a href="https://rit-sse.github.io/CoursePlanner-/docs/gen/index.html" target="_blank">Auto generated code documentation here!</a>


# Getting Started (like, from the very very beginning):
1. Install NodeJS and MongoDB on your computer. This probably means you run sudo apt install nodejs mongodb on ubuntu
    * The app is currently on version 6.10.1 of node
2. Open a terminal, go to the project directory
3. Execute npm install
4. Next, I think you need to install gulp and bower globally via npm, so run `npm install -g gulp` and `npm install -g bower`
5. Run bower install to install the frontend dependencies
6. Next, run gulp to "build" the code
7. If you are starting from an empty database, you also need to run `npm run setupSchools`, which will run a script to populate the database with all the schools in the U.S.
8. Run npm start to start your server
