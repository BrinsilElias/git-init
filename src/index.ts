#!/usr/bin/env node

import prompts from "prompts"
import ora from "ora"
import { promptArray } from "./core/options"

const init = async () => {
  const userResponses = await prompts(promptArray)

  const spinner = ora("Creating project").start()
  setTimeout(() => {
    spinner.succeed("Project created successfully")
    console.log(userResponses)
  }, 2000)
}

init()
