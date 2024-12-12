import { Command } from 'commander';
import { Octokit } from 'octokit';
import { execSync } from 'child_process';

const program = new Command();
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

program
    .version('0.1.0')
    .requiredOption('-r, --repo <repo>', 'GitHub repository in the format owner/repo')
    .requiredOption('-p, --pr <prNumber>', 'Pull request number')
    .parse(process.argv);


interface PRDetails {
    title: string;
    body: string;

}


const options = program.opts();

async function getStagedCommits() {
    const stagedCommits = execSync('git diff --cached --name-only').toString().trim().split('\n');
    return stagedCommits;
}

async function getPRDetails(repo: string, prNumber: number): Promise<PRDetails> {
    const [owner, repoName] = repo.split('/');
    const {data} = await octokit.rest.search.issuesAndPullRequests({
        q: `repo:${owner}/${repoName} is:pr ${prNumber}`,
       
    });

    // from the data, get the title and body of the PR
    const pr = data.items[0];
    return {
        title: pr.title,
        body: pr.body!
    };

}

async function generateChangelog() {
    const stagedCommits = await getStagedCommits();
    const prDetails = await getPRDetails(options.repo, parseInt(options.pr, 10));

    console.log('Generating changelog for PR:', options.pr);
    console.log('Title:', prDetails.title);
    console.log('Description:', prDetails.body);
    console.log('Staged Commits:', stagedCommits.join('\n'));
}

generateChangelog().catch(error => {
    console.error('Error generating changelog:', error);
    process.exit(1);
});