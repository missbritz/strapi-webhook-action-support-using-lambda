import dotenv from "dotenv"
dotenv.config()

import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log('Received event:', event);

  const user = process.env.GHX_USER
  const repo = process.env.GHX_REPO
  const branch = process.env.GHX_BRANCH
  const workflowID = process.env.GHX_WORKFLOW
  const gtoken = process.env.GHX_AUTH_TOKEN ? `Bearer ${process.env.GHX_AUTH_TOKEN}` : '';

  // Validate essential headers
  if (!user || !repo || !workflowID || !gtoken) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required params' })
    };
  }

  // Define the GitHub API URL and headers
  const url = `https://api.github.com/repos/${user}/${repo}/actions/workflows/${workflowID}/dispatches`;
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: gtoken,
    ContentType: 'application/json',
    'X-GitHub-Api-Version': '2022-11-28'
  };

  // Request body
  const body = JSON.stringify({
    ref: branch,
    inputs: {}
  });

  console.log(url)
  console.log(headers)

  try {
    // Make the fetch request to GitHub API
    const response = await fetch(url, { method: 'POST', headers, body });

    // Check for non-204 response codes and attempt to parse JSON if applicable
    if (response.status !== 204) {
      const responseData: { message?: string } = await response.json();
      if (!response.ok) {
        console.error('GitHub API error:', responseData);
        throw new Error(responseData.message || 'Unknown error occurred');
      }
      console.log('GitHub workflow triggered successfully:', responseData);
      return {
        statusCode: 200,
        body: JSON.stringify(responseData)
      };
    }

    // Handle 204 No Content response
    console.log('GitHub workflow triggered successfully: No Content');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'GitHub workflow triggered successfully: No Content' })
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error triggering GitHub workflow:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};