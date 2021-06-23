

To visit the app in dev mode: https://ticketing.local

Changes are committed to the dev branch 
Manually create a pull request to merge the dev branch into main
Github automatically runs tests for project
After the tests pass, we merge the dev branch into the main branch
Because master branch has changed, github builds and deploys

Use a single git repo instead of a repo for each service

Github Actions - scripts that we can fill with any code we want, run commands, run tests, deploy our app, and much more
On github, anytime you push some code, create a pull request, close a pull request, or fork a repository, it triggers an event internally inside of github. 
When an event occurs, we can trigger a github action

to switch github branches on the cli: git checkout -b name of branch