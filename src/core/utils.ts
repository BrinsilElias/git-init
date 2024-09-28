import * as fs from "node:fs"
import * as path from "node:path"
import { exec } from "node:child_process"

export async function createFolder(folderPath: string): Promise<void> {
  const absolutePath = path.resolve(folderPath)

  // Use a promise to handle asynchronous behavior without external dependencies
  return new Promise((resolve, reject) => {
    // Check if folder exists
    fs.access(absolutePath, fs.constants.F_OK, (err) => {
      if (!err) {
        console.log(`Folder "${absolutePath}" already exists.`)
        resolve()
      } else if (err.code === "ENOENT") {
        // Folder does not exist, create it
        fs.mkdir(absolutePath, { recursive: true }, (mkdirErr) => {
          if (mkdirErr) {
            console.error(
              `Error creating folder "${absolutePath}": ${mkdirErr.message}`,
            )
            reject(mkdirErr)
          } else {
            console.log(`Folder "${absolutePath}" created successfully.`)
            resolve()
          }
        })
      } else {
        // Some other error while accessing the folder
        console.error(
          `Error accessing folder "${absolutePath}": ${err.message}`,
        )
        reject(err)
      }
    })
  })
}

/**
 * Utility function to initialize a Git repository in the specified folder.
 *
 * @param repoPath - The path where the Git repository should be initialized.
 * @returns Promise<void> - Resolves if the Git repository is initialized successfully, rejects if there is an error.
 */
export async function initializeGit(repoPath: string): Promise<void> {
  const absolutePath = path.resolve(repoPath)

  return new Promise((resolve, reject) => {
    // Use child_process to execute the git init command
    exec("git init", { cwd: absolutePath }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error initializing Git repository: ${stderr}`)
        reject(error)
      } else {
        console.log(`Git repository initialized at ${absolutePath}`)
        resolve()
      }
    })
  })
}

export async function makeApiRequest(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
) {
  const options: RequestInit = {
    method,
  }

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    throw error
  }
}
