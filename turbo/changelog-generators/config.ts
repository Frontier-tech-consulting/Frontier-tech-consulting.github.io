import { PlopTypes } from "@turbo/gen";
import { execSync } from "child_process";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("example", {
    description:
      "updates the changelog file for each corresponding commits and PR, including all the PR's and related information of commits",
    prompts: [
      {
        type: "input",
        name: "repo",
        message: "What is the GitHub repository (owner/repo)?",
      },
      {
        type: "input",
        name: "prNumber",
        message: "What is the pull request number?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "{{ turbo.paths.root }}/{{ dashCase file }}{{ type }}",
        templateFile: "templates/turborepo-generators.hbs",
        data: (answers: any) => {
          const { repo, prNumber } = answers;
          const changelog = execSync(`node /path/to/github-info.js -r ${repo} -p ${prNumber}`).toString();
          return { changelog };
        },
      },
    ],
  });
}
