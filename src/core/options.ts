import pc from "picocolors"
import * as constants from "./constants"
import { text, select, group, log } from "@clack/prompts"
import { makeApiRequest, _cancel as cancel } from "./utils"

async function initGitPrompts() {
  return group(
    {
      projectDirectory: () =>
        select({
          message: pc.bold("Initialize git in:"),
          initialValue: "currentDir",
          options: [
            { value: "currentDir", label: "Current directory" },
            { value: "newDir", label: "Specify directory" },
          ],
        }),

      specifyDirectoryPath: ({ results }) => {
        if (results.projectDirectory === "newDir") {
          return text({
            message: pc.bold("Specify the directory path"),
            placeholder: "./new-project",
            validate: (value) => {
              if (!value) return "Please enter a path."
              if (value[0] !== ".") return "Please enter a relative path."
            },
          })
        }
        return
      },

      chooseLicense: async () => {
        const licenseChoices = await makeApiRequest(constants.LISCENSES_API_URL, "GET").catch(
          () => {
            log.error(pc.bold(pc.redBright("Failed to fetch licenses")))
            return
          },
        )
        if (!licenseChoices) {
          return
        }
        const choices = licenseChoices.map(
          (item: {
            key: string
            name: string
            spdx_id: string
            url: string
            node_id: string
          }) => ({
            title: item.name,
            value: item.key,
          }),
        )
        return select({
          message: pc.bold("Choose a license"),
          options: [{ value: false, label: "None" }, ...choices],
          maxItems: 10,
        })
      },

      chooseGitignore: async () => {
        const gitIgnoreChoices = await makeApiRequest(constants.GITIGNORE_API_URL, "GET").catch(
          () => {
            log.error(pc.bold(pc.redBright("Failed to fetch gitignore template")))
            return
          },
        )
        if (!gitIgnoreChoices) {
          return
        }
        const choices = gitIgnoreChoices.map((item: string) => ({
          title: item,
          value: item,
        }))
        return select({
          message: pc.bold("Choose a .gitignore template"),
          options: [{ value: false, label: "None" }, ...choices],
          maxItems: 10,
        })
      },

      mainBranchName: () =>
        text({
          message: pc.bold("Enter the name of the main branch"),
          defaultValue: "main",
          placeholder: "main",
        }),

      remoteRepoUrl: () =>
        text({
          message: pc.bold("Enter the remote repository URL"),
          placeholder: "https://www.github.com/username/repo",
          validate: (value) => {
            if (!value.includes("https")) return "Please enter a valid URL."
          },
        }),
    },
    {
      onCancel: () => {
        cancel("  Operation cancelled  ")
      },
    },
  )
}

export default initGitPrompts
