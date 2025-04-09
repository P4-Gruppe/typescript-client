# GitHub CI/CD Integration for Redtype

This repository is configured with GitHub Actions for continuous integration and deployment status tracking.

## CI Workflow

The CI workflow runs automatically when:
- Code is pushed to the `main` branch
- A pull request is opened against the `main` branch

The workflow performs the following checks:
- Code formatting with `rustfmt`
- Linting with `clippy`
- Building the project
- Running tests

## Deployment Status Tracking

The deployment status workflow can be used to update GitHub with the status of deployments from Coolify.

### Setting up Coolify to notify GitHub

To have Coolify update the deployment status in GitHub, you need to set up a webhook in your Coolify project:

1. In your Coolify project settings, find the webhook configuration section
2. Add a new webhook with the following URL:
   ```
   https://api.github.com/repos/P4-Gruppe/Redtype/dispatches
   ```
3. Set the content type to `application/json`
4. Add a GitHub Personal Access Token with `repo` scope as the authorization header:
   ```
   Authorization: token YOUR_GITHUB_PAT
   ```
5. Configure the webhook payload to include:
   ```json
   {
     "event_type": "deployment-status",
     "client_payload": {
       "status": "success",  // or "failure", "in_progress"
       "environment": "production",
       "description": "Coolify deployment",
       "deployment_id": "YOUR_DEPLOYMENT_ID"
     }
   }
   ```
6. Configure the webhook to trigger on:
   - Deployment started (with status: "in_progress")
   - Deployment succeeded (with status: "success")
   - Deployment failed (with status: "failure")

### Manual Deployment Status Updates

You can also manually update the deployment status from the GitHub Actions tab by running the "Deployment Status" workflow.

## Viewing Deployment Status

Deployment statuses will be visible:
- On the repository's main page
- In the "Environments" section
- On commits and pull requests
