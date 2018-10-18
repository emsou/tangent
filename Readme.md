WORK IN PROGRESS

Todo (short-term): 

- some issues with password
  - encrypt the password at some point before storing it
  - fix "incorrect password" error
  - separate new user + existing user logins
- add separate chats between:
  - pairs of users
  - groups of users
- add tangent feature
- construct a viable schema for all of the above

Todo (medium-term):
- add a remote client

Potential long-term questions:
1. How to dump data we don't need (old testing, etc.)
  a. For now we can just delete things in mLab, but when we get larger datasets (in prod) we will need to do it programatically
2. Update-proofing (changes in schema, moving the DB to another host, etc.)
  a. Confirmed: Old schema related messages render properly for our purposes
