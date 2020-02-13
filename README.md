# AXOSOFT CONFIGURATION

Add the POST url to the notification manage section this will cover the all workflows at once

Go to Tools->SystemSettings->Axosoft API Settings Click on Enable API
Click on Manage API Keys and create a set of Client Secret and Client Id keys
Click close
Click on Manage Tokens
Create a new Non Expiring Token
Select the application that was created previously on the API Key creation step
Give read/write access to the token
Copy the Token
Click create
Put the following configuration variables in the .env

AXOSOFT_BASE_URL=https://garcia.axosoft.com
AXOSOFT_OAUTH_TOKEN=${created_token}

# GITHUB

Click on settings for the repository that you want to add a webhook to
Click on webhooks and add a new webhook
Set the URL to the endpoint that is configured in the service to receive messages
Set the content type to application/json
For the secret use any generated key and save that somewhere
Select send me everything at lease for now
Before going to the next step make sure that the API is running and is accepting a POST method
Check the active checkbox and click on add webhook



# SLACK

Create an app that has Bot User Scope then add scope chat:write persmissions and get the OAuth token place it in the .env file with SLACK_ACCESS_TOKEN as key
Add bot to the channel that it will be using when sending messages to.

