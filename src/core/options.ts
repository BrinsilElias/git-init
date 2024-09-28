import type { PromptObject } from "prompts"
import pc from "picocolors"

const projectDirectory: PromptObject = {
  type: "select",
  name: "projectDirectory",
  message: pc.bold("Initialize git in:"),
  choices: [
    { title: "Current directory", value: "currentDir" },
    { title: "Specify directory", value: "newDir" },
  ],
}

const speccifyDirectoryPath: PromptObject = {
  type: (prev) => (prev === "newDir" ? "text" : null),
  name: "specifyDirectoryPath",
  message: pc.bold("Specify the directory path"),
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
  projectDirectory,
  speccifyDirectoryPath,
  authorNamePrompt,
  addGitIgnorePrompt,
  licensePrompt,
  mainBranchPrompt,
  addRemoteRepoPrompt,
  remoteRepoUrlPrompt,
]
