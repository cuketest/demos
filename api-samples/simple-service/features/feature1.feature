@math
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

2. start the mock-json server 
json-server data.json

  Scenario Outline: Get data
    * Get the service api "<URL>" and i should get the '<expectval>'
    Examples: 
      | URL                           | expectval                                                                                                            |
      | http://localhost:3000/users/1 | {   "id": 1,   "name": "therebelrobot",   "location": "USA" }                                                        |
      | http://localhost:3000/users/2 | {   "id": 2,   "name": "visiting-user",   "location": "UK" }                                                         |
      | http://localhost:3000/posts/1 | {   "id": 1,   "title": "json-mock",   "body": "The internet is cool!",   "author": "therebelrobot",   "userId": 1 } |

  Scenario Outline: Post data
    * Post to service api "<URL>" with '<data>' and I should get the '<expectval>'
    Examples: 
      | URL                         | data                                                | expectval                                           |
      | http://localhost:3000/users | { "id": 3, "name": "cuketest", "location": "CHINA"} | { "id": 3, "name": "cuketest", "location": "CHINA"} |

  Scenario Outline: Put data
    * Put to service api "<URL>" with '<data>' and I should get the '<expectval>'
    Examples: 
      | URL                           | data                                                   | expectval                                              |
      | http://localhost:3000/users/3 | {   "id": 4,   "name": "jack",   "location": "china" } | {   "id": 4,   "name": "jack",   "location": "china" } |

  Scenario Outline: Patch data
    * Patch to service api "<URL>" with '<data>' and I should get the '<expectval>'
    Examples: 
      | URL                           | data            | expectval                                              |
      | http://localhost:3000/users/4 | {"name":"zack"} | {   "id": 4,   "name": "zack",   "location": "china" } |

  Scenario Outline: Delete data
    * Delete to service api "<URL>" and I should get the '<expectval>'
    Examples: 
      | URL                              | expectval |
      | http://localhost:3000/comments/2 | {}        |