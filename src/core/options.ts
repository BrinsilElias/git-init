import type { PromptObject } from "prompts"
import pc from "picocolors"

const projectNamePrompt: PromptObject = {
  type: "text",
  name: "projectName",
  message: pc.bold("What is the name of the project?"),
  validate: (value) => (value ? true : pc.red("Project name cannot be empty")),
}

const authorNamePrompt: PromptObject = {
  type: "text",
  name: "authorName",
  message: pc.bold("What is the author name?"),
}

const addGitIgnorePrompt: PromptObject = {
  type: "confirm",
  name: "shouldAddGitIgnore",
  message: pc.bold("Do you want to add a .gitignore file?"),
  initial: true,
}

const licensePrompt: PromptObject = {
  type: "select",
  name: "chosenLicense",
  message: pc.bold("Choose a license"),
  choices: [
    { title: "MIT", value: "MIT" },
    { title: "Apache 2.0", value: "Apache 2.0" },
    { title: "GPL 3.0", value: "GPL 3.0" },
  ],
}

const mainBranchPrompt: PromptObject = {
  type: "text",
  name: "mainBranchName",
  message: pc.bold("Enter the name of the main branch"),
}

const addRemoteRepoPrompt: PromptObject = {
  type: "confirm",
  name: "shouldAddRemoteRepo",
  message: pc.bold("Do you want to add a remote repository?"),
  initial: true,
}

const remoteRepoUrlPrompt: PromptObject = {
  type: "text",
  name: "remoteRepoUrl", // This one is okay too!
  message: pc.bold("Enter the remote repository URL"),
}

export const promptArray: Array<PromptObject> = [
  projectNamePrompt,
  authorNamePrompt,
  addGitIgnorePrompt,
  licensePrompt,
  mainBranchPrompt,
  addRemoteRepoPrompt,
  remoteRepoUrlPrompt,
]
