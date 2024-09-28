import prompts from "prompts"
import ora from "ora"
import { createFolder, initializeGit } from "./utils"
import { promptArray } from "./options"

const init = async (): Promise<void> => {
  const userResponses = await prompts(promptArray)
  const spinner = ora("Creating project\n").start()

  /**
   * Create the project directory and initialize the git
   * Add a .gitignore file if the user wants
   * Add a license file if the user wants
   * Add a remote repository if the user wants
   */

  if (userResponses.projectDirectory === "currentDir") {
    await initializeGit(".")
  }

  if (userResponses.projectDirectory === "newDir") {
    await createFolder(userResponses.specifyDirectoryPath)
  }

  spinner.stop()
}

export default init
