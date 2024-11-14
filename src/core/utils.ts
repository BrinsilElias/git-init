import * as fs from "node:fs"
import pc from "picocolors"
import { promisify } from "node:util"
import { log, cancel } from "@clack/prompts"
import { execSync } from "node:child_process"

const fsWriteFile = promisify(fs.writeFile)
const fsExists = promisify(fs.exists)
const fsMkdir = promisify(fs.mkdir)

interface File {
  name: string
  content: string
  path: string
}

export const createDirectory = async (pathDir: string): Promise<void> => {
  try {
    const exists = await fsExists(pathDir)
    if (exists) {
      log.warn(pc.bold(pc.yellowBright("Directory already exists.")))
      log.message()
      return Promise.resolve()
    }
    await fsMkdir(pathDir)
    return Promise.resolve()
  } catch (_) {
    Promise.reject()
  }
  return Promise.resolve()
}

export const createFiles = async (file: File): Promise<boolean> => {
  try {
    const filePath = `${file.path}/${file.name}`
    await fsWriteFile(filePath, file.content.toString())
  } catch (_) {
    return false
  }
  return true
}

export async function makeApiRequest(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  query?: Record<string, string>,
) {
  let apiEndPoint = url
  const options = { method }

  if (query) {
    const queryString = new URLSearchParams(query).toString()
    apiEndPoint += `?${queryString}`
  }

  try {
    const response = await fetch(apiEndPoint, options)
    if (!response.ok) {
      return Promise.reject()
    }
    const data = await response.json()
    return data
  } catch (_) {
    return Promise.reject()
  }
}

export function initializeGit(path: string | unknown): { error: boolean; message: string } {
  if (isGitInitialized({ cwd: path, stdio: "ignore" })) {
    return { error: true, message: "Git is already initialized." }
  }
  try {
    execSync(`git init ${path}`)
  } catch (_) {
    return { error: true, message: "Failed to initialize git." }
  }
  return { error: false, message: "Git initialized successfully." }
}

export function isGitInitialized(options?: Record<string, unknown>): boolean {
  try {
    execSync("git rev-parse --is-inside-work-tree", options)
  } catch (_) {
    return false
  }
  return true
}

export function setBranchName(
  branchName: string,
  options?: Record<string, unknown>,
): { error: boolean; message: string } {
  if (!isGitInitialized(options)) {
    return { error: true, message: "Git is not initialized" }
  }
  try {
    execSync(`git branch -m ${branchName}`, options)
  } catch (_) {
    return { error: true, message: "Failed to set branch name." }
  }
  return { error: false, message: "Branch name set successfully." }
}

export function setRemoteUrl(
  url: string,
  options?: Record<string, unknown>,
): { error: boolean; message: string } {
  if (!isGitInitialized(options)) {
    return { error: true, message: "Git is not initialized" }
  }
  try {
    execSync(`git remote add origin ${url}`, options)
  } catch (_) {
    return { error: true, message: "Failed to set remote URL." }
  }
  return { error: false, message: "Remote URL set successfully." }
}

export function _cancel(message: string): void {
  cancel(pc.bgRedBright(message))
  process.exit(1)
}
