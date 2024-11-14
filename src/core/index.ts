import pc from "picocolors"
import initGitPrompts from "./options"
import * as constants from "./constants"
import { intro, log, outro, spinner } from "@clack/prompts"
import {
  createDirectory,
  makeApiRequest,
  createFiles,
  initializeGit,
  setBranchName,
  setRemoteUrl,
  _cancel as cancel,
} from "./utils"

const init = async (): Promise<void> => {
  console.clear()
  intro(pc.inverse("  Initialize a new git repository  "))
  const userResponses = await initGitPrompts()

  const _spinner = spinner()
  _spinner.start("Initializing git repository...")

  // biome-ignore format: No need to format this line
  const projectDir =
    userResponses.projectDirectory === "currentDir"
    ? "."
    : userResponses?.specifyDirectoryPath

  if (projectDir === ".") {
    const initGit = initializeGit(projectDir)
    if (initGit.error) {
      _spinner.stop(pc.bold(pc.redBright(initGit.message)))
      log.message()
      cancel("  Aborting git initialization  ")
    }
  } else {
    // @ts-expect-error
    await createDirectory(projectDir)
      .then(() => {
        const initGit = initializeGit(projectDir)
        if (initGit.error) {
          _spinner.stop(pc.bold(pc.redBright(initGit.message)))
          log.message()
          cancel("  Aborting git initialization  ")
        }
      })
      .catch(() => {
        _spinner.stop(pc.red("Failed to create directory"))
        cancel("  Aborting git initialization  ")
      })
  }

  if (userResponses.chooseLicense) {
    const license = await makeApiRequest(
      `${constants.LISCENSES_API_URL}/${userResponses.chooseLicense}`,
      "GET",
    ).catch(() => {
      _spinner.stop(pc.bold(pc.redBright("Failed to fetch license")))
      cancel("  Aborting git initialization  ")
    })
    await createFiles({ name: "LICENSE", path: `${projectDir}`, content: license?.body }).catch(
      () => {
        _spinner.stop(pc.bold(pc.redBright("Failed to create LICENSE file")))
        cancel("  Aborting git initialization  ")
      },
    )
  }

  if (userResponses.chooseGitignore) {
    const gitignore = await makeApiRequest(
      `${constants.GITIGNORE_API_URL}/${userResponses.chooseGitignore}`,
      "GET",
    ).catch(() => {
      _spinner.stop(pc.bold(pc.redBright("Failed to fetch gitignore template")))
      cancel("  Aborting git initialization  ")
    })
    await createFiles({
      name: ".gitignore",
      path: `${projectDir}`,
      content: gitignore?.source,
    }).catch(() => {
      _spinner.stop(pc.bold(pc.redBright("Failed to create .gitignore file")))
      cancel("  Aborting git initialization  ")
    })
  }

  const isBranchSet = setBranchName(userResponses.mainBranchName, {
    cwd: projectDir,
    stdio: "ignore",
  })
  if (isBranchSet.error) {
    _spinner.stop(pc.bold(pc.redBright(isBranchSet.message)))
    cancel("  Aborting git initialization  ")
  }

  if (userResponses.remoteRepoUrl) {
    const isRemoteUrlSet = setRemoteUrl(userResponses.remoteRepoUrl, {
      cwd: projectDir,
      stdio: "ignore",
    })
    if (isRemoteUrlSet.error) {
      _spinner.stop(pc.bold(pc.redBright(isRemoteUrlSet.message)))
      cancel("  Aborting git initialization  ")
    }
  }

  _spinner.stop(pc.bgGreenBright("  Git initialized successfully  "))
  outro(`Checkout the repo? ${pc.underline(pc.cyan("https://github.com/BrinsilElias/git-init"))}`)
}

export default init
