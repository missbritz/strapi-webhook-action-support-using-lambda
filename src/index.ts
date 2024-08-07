import 'isomorphic-fetch';
import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {

  // Destructure and set default values
  const user = event.headers['ghx-user'] || '';
  const repo = event.headers['ghx-repo'] || '';
  const branch = event.headers['ghx-branch'] || 'master';
  const workflowID = event.headers['ghx-workflow'] || '';
  const gtoken = `Bearer ${event.headers.authorization}`;

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

  try {
    // Make the fetch request to GitHub API
    const response = await fetch(url, { method: 'POST', headers, body });

    // Ensure the response body exists and is JSON before parsing
    let responseData = null;

    // Github returns 204 on success which has no JSON to parse
    // https://docs.github.com/en/rest/actions/workflows?apiVersion=2022-11-28#create-a-workflow-dispatch-event
    if (response.status !== 204 && !response.ok) {
      responseData = await response.json();
      console.error('GitHub API error:', responseData);
      throw new Error(responseData ? responseData.message : 'Unknown error occurred');
    }

    console.log('GitHub workflow triggered successfully:', responseData);

    const postGithubHook = responseData === null ? { published: 'success' } : responseData

    return {
      statusCode: 200,
      body: JSON.stringify(postGithubHook)
    };
  } catch (error) {
    console.error('Error triggering GitHub workflow:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};