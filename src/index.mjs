/* global fetch */
import fetch from 'node-fetch';

export const handler = async (event) => {
  console.log('Received event:', event);

  // Destructure and set default values
  const { params = {} } = event;
  const user = process.env.OWNER;
  const repo = process.env.REPO;
  const branch = process.env.BRANCH || 'master';
  const workflowID = process.env.WORKFLOW_ID;
  const gtoken = event.headers.authorization;

  // Define the GitHub API URL and headers
  const url = `https://api.github.com/repos/${user}/${repo}/actions/workflows/${workflowID}/dispatches`;
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${gtoken}`, // Added 'Bearer ' prefix for proper format
    'Content-Type': 'application/json', // Corrected header key spelling
    'X-GitHub-Api-Version': '2022-11-28'
  };

  // Request body
  const body = JSON.stringify({
    ref: branch,
    inputs: params
  });

  try {
    // Make the fetch request to GitHub API
    const response = await fetch(url, { method: 'POST', headers, body });
    const responseData = await response.json(); // Parse JSON response

    // Check if the response is not ok (status code 2xx)
    if (!response.ok) {
      console.error('GitHub API error:', responseData);
      throw new Error(responseData.message || 'Unknown error occurred');
    }

    console.log('GitHub workflow triggered successfully:', responseData);
    return {
      statusCode: 200,
      body: JSON.stringify(responseData)
    };
  } catch (error) {
    console.error('Error triggering GitHub workflow:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
