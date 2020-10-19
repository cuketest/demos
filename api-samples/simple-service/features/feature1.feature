Feature: Simple interface test
This is a Cucumber 3.x sample for testing restful service:

It uses json-mock as server. Before runing the script, please init the mock message and start the json-mock server.
1. edit the data.json
[
  {
    "id": 1,
    "name": "therebelrobot",
    "location": "USA"
  },
  {
    "id": 2,
    "name": "visiting-user",
    "location": "UK"
  }
]

2. start the local api server 
npm run json-server

* for presanting, it alway use file `data_origin.json` overwrite file `data.json` as soon as project starting. See detail in `feature/support/hook.js`

  @get
  Scenario Outline: Get data
    Given Get the service api "<URL>" and i should get the '<expectval>'
    Examples: 
      | URL                           | expectval                                                                                                            |
      | http://localhost:3000/users/1 | {   "id": 1,   "name": "therebelrobot",   "location": "USA" }                                                        |
      | http://localhost:3000/users/2 | {   "id": 2,   "name": "visiting-user",   "location": "UK" }                                                         |
      | http://localhost:3000/posts/1 | {   "id": 1,   "title": "json-mock",   "body": "The internet is cool!",   "author": "therebelrobot",   "userId": 1 } |

  @post
  Scenario Outline: Post data
    Given Post to service api "<URL>" with '<data>' and I should get the '<expectval>'
    Examples: 
      | URL                         | data                                                | expectval                                           |
      | http://localhost:3000/users | { "id": 5, "name": "cuketest", "location": "CHINA"} | { "id": 5, "name": "cuketest", "location": "CHINA"} |

  @put
  Scenario Outline: Put data
    Given Put to service api "<URL>" with '<data>' and I should get the '<expectval>'
    Examples: 
      | URL                           | data                                                   | expectval                                              |
      | http://localhost:3000/users/3 | {   "id": 3,   "name": "jack",   "location": "china" } | {   "id": 3,   "name": "jack",   "location": "china" } |

  @patch
  Scenario Outline: Patch data
    Given Patch to service api "<URL>" with '<data>' and I should get the '<expectval>'
    Examples: 
      | URL                           | data            | expectval                                              |
      | http://localhost:3000/users/4 | {"name":"zack"} | {   "id": 4,   "name": "zack",   "location": "china" } |

  @delete
  Scenario Outline: Delete data
    Given Delete to service api "<URL>" and I should get the '<expectval>'
    Examples: 
      | URL                              | expectval |
      | http://localhost:3000/comments/2 | {}        |