import { execSync, spawn } from "child_process";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import fs from "node:fs";
import cliProgress from "cli-progress";
import readline from "readline";

const cwd = process.cwd();

// ---- read package.json safely ----

let pkg = { name: "project", version: "1.0.0" };

try {
  pkg = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf-8"));
} catch {
  // ignore if no package.json
}

const run = (cmd) => execSync(cmd, { cwd, stdio: "pipe" }).toString();

const prompt = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
};

// ==================== HELP ====================
const showHelp = () => {
  console.log(chalk.cyan(`\n╔════════════════════════════════════════════════════════╗`));
  console.log(
    chalk.cyan(
      `║           ${chalk.bold("Git Helper - Quick Commands for ease of access")}           ║`,
    ),
  );
  console.log(chalk.cyan(`╚════════════════════════════════════════════════════════╝\n`));

  console.log(chalk.yellow("BRANCH MANAGEMENT:"));
  console.log(chalk.white("  npm run git new <branch-name>"));
  console.log(chalk.gray("  Example: npm run git new feature/awesome\n"));

  console.log(chalk.yellow("COMMIT & PUSH:"));
  console.log(chalk.white("  npm run git <branch> <message>"));
  console.log(chalk.gray("  Example: npm run git main 'added new feature'\n"));

  console.log(chalk.yellow("MERGE BRANCHES:"));
  console.log(chalk.white("  npm run git merge <source> <target>"));
  console.log(chalk.gray("  Example: npm run git merge nishu main\n"));

  console.log(chalk.yellow("REBASE BRANCHES:"));
  console.log(chalk.white("  npm run git rebase <branch>"));
  console.log(chalk.gray("  Example: npm run git rebase main"));
  console.log(chalk.white("  npm run git rebase-interactive <commits>"));
  console.log(chalk.gray("  Example: npm run git rebase-interactive 3"));
  console.log(chalk.white("  npm run git rebase-merge <source> <target>"));
  console.log(chalk.gray("  Example: npm run git rebase-merge main\n"));

  console.log(chalk.yellow("UTILITIES:"));
  console.log(chalk.white("  npm run git pull      ") + chalk.gray("→ Pull latest changes"));
  console.log(
    chalk.white("  npm run git undo      ") + chalk.gray("→ Undo last commit (keep changes)"),
  );
  console.log(
    chalk.white("  npm run git cherry-pick <commit-hash> ") + chalk.gray("→ Apply specific commit"),
  );
  console.log(
    chalk.white("  npm run git pr        ") + chalk.gray("→ Create Pull Request on GitHub"),
  );
  console.log(chalk.white("  npm run git help      ") + chalk.gray("→ Show this help\n"));

  console.log(chalk.gray("  Basic git commands: git status, git branch, git log, git checkout\n"));

  console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));
  process.exit(0);
};

// ==================== STATUS ====================
// const showStatus = () => {
//   console.log(chalk.cyan(`\n${pkg.name} : ${pkg.version}\n`))
//   console.log(chalk.yellow('Repository Status:\n'))
//   try {
//     const currentBranch = run('git branch --show-current')
//     console.log(chalk.white('Current branch: ') + chalk.greenBright(currentBranch))
//     console.log(run('git status'))
//   } catch (err) {
//     console.log(chalk.red('Not a git repository\n'))
//   }
//   process.exit(0)
// }

// ==================== CREATE PR ====================
const createPullRequest = async () => {
  console.log(chalk.cyan(`\n${pkg.name} : ${pkg.version}\n`));

  try {
    // Get current branch
    const currentBranch = run("git branch --show-current").trim();
    console.log(chalk.yellow(`Current branch: ${currentBranch}\n`));

    // Check if branch is pushed
    const pushing = ora(chalk.yellow("Ensuring branch is pushed")).start();
    try {
      run(`git push -u origin ${currentBranch}`);
      pushing.succeed(chalk.green("Branch pushed"));
    } catch {
      pushing.succeed(chalk.green("Branch already pushed"));
    }

    // Get target branch
    const targetBranch = await prompt(chalk.cyan(`Target branch for PR (default: main): `));
    const target = targetBranch || "main";

    // Get PR title
    const title = await prompt(chalk.cyan("PR Title: "));
    if (!title) {
      console.log(chalk.red("\nPR title required\n"));
      process.exit(1);
    }

    // Get PR description
    const description = await prompt(chalk.cyan("PR Description (optional): "));

    // Get repo info
    const remoteUrl = run("git remote get-url origin").trim();
    const repoMatch = (remoteUrl + `.git`).match(/github\.com[:/](.+?)\.git/);

    if (!repoMatch) {
      console.log(chalk.red("\nCould not detect GitHub repository\n"));
      process.exit(1);
    }

    const repo = repoMatch[1];
    const prUrl = `https://github.com/${repo}/compare/${target}...${currentBranch}?diff=split&w&title=${encodeURIComponent(title)}${description ? `&body=${encodeURIComponent(description)}` : ""}`;

    console.log(chalk.greenBright("\nOpening PR in browser...\n"));
    console.log(chalk.gray(`${prUrl}\n`));

    // Open in browser (use OS default handler)
    const platform = process.platform;
    const openCmd =
      platform === "win32"
        ? `start "" "${prUrl}"`
        : platform === "darwin"
          ? `open "${prUrl}"`
          : `xdg-open "${prUrl}"`;
    run(openCmd);

    console.log(chalk.green("PR creation page opened in browser\n"));
  } catch (err) {
    console.log(chalk.red("\nFailed to create PR:\n") + chalk.gray(err.message));
    process.exit(1);
  }
  process.exit(0);
};

// ==================== PULL ====================
const pullChanges = async () => {
  console.log(chalk.cyan(`\n${pkg.name} : ${pkg.version}\n`));
  try {
    const currentBranch = run("git branch --show-current").trim();
    const pull = ora(chalk.yellow("Pulling latest changes")).start();
    run(`git pull origin ${currentBranch}`);
    pull.succeed(chalk.green("Up to date"));
  } catch (err) {
    console.log(chalk.red(`\nFailed: ${err.message}\n`));
  }
  process.exit(0);
};

// ==================== UNDO COMMIT ====================
const undoCommit = async () => {
  console.log(chalk.cyan(`\n${pkg.name} : ${pkg.version}\n`));
  try {
    const answer = await prompt(chalk.yellow("Undo last commit (keeps changes)? (y/n): "));
    if (answer === "y" || answer === "yes") {
      run("git reset --soft HEAD~1");
      console.log(chalk.green("\nLast commit undone (changes kept)\n"));
    } else {
      console.log(chalk.gray("\nCancelled\n"));
    }
  } catch (err) {
    console.log(chalk.red(`\nFailed: ${err.message}\n`));
  }
  process.exit(0);
};

// ==================== CHERRY-PICK ====================
const cherryPick = async (commitHash) => {
  console.log(chalk.cyan(`\n${pkg.name} : ${pkg.version}\n`));

  if (!commitHash) {
    console.log(chalk.red("\nCommit hash required"));
    console.log(chalk.yellow("Usage: npm run git cherry-pick <commit-hash>"));
    console.log(chalk.gray("Example: npm run git cherry-pick a1b2c3d\n"));
    process.exit(1);
  }

  try {
    // Check for uncommitted changes
    const checkChanges = ora(chalk.yellow("Checking for uncommitted changes")).start();
    const status = run("git status --porcelain");

    if (status.trim()) {
      checkChanges.warn(chalk.yellow("You have uncommitted changes"));
      console.log(chalk.gray("\n" + status));

      const answer = await prompt(chalk.cyan("Commit changes before cherry-picking? (y/n): "));

      if ((answer.toLowerCase() === "y" || answer, toLowerCase() === "yes")) {
        const commitMsg = await prompt(chalk.cyan("Enter commit message: "));

        const fmt = ora(chalk.yellow("Running format")).start();
        run("npm run format");
        fmt.succeed(chalk.green("Format complete"));

        const commit = ora(chalk.yellow("Committing changes")).start();
        run("git add .");
        run(`git commit -m "${commitMsg}"`);
        commit.succeed(chalk.green("Changes committed"));
      } else {
        console.log(chalk.red("\nPlease commit or stash your changes first\n"));
        process.exit(1);
      }
    } else {
      checkChanges.succeed(chalk.green("Working tree clean"));
    }

    // Show commit details
    const info = ora(chalk.yellow("Fetching commit details")).start();
    try {
      const commitInfo = run(`git log --oneline -1 ${commitHash}`);
      info.succeed(chalk.green("Commit found"));
      console.log(chalk.gray(`\n  ${commitInfo}`));
    } catch {
      info.fail(chalk.red("Commit not found"));
      console.log(chalk.yellow('\nTip: Use "npm run git log" to see available commits\n'));
      process.exit(1);
    }

    // Confirm cherry-pick
    const confirm = await prompt(chalk.cyan("Apply this commit to current branch? (y/n): "));

    if (confirm.toLowerCase() !== "y" && confirm.toLowerCase() !== "yes") {
      console.log(chalk.gray("\nCancelled\n"));
      process.exit(0);
    }

    // Cherry-pick
    const pick = ora(chalk.yellow("Cherry-picking commit")).start();
    run(`git cherry-pick ${commitHash}`);
    pick.succeed(chalk.green("Cherry-pick successful"));

    // Ask if want to push
    const pushAnswer = await prompt(chalk.cyan("Push changes now? (y/n): "));

    if (pushAnswer.toLowerCase() === "y" || pushAnswer.toLowerCase() === "yes") {
      const currentBranch = run("git branch --show-current").trim();

      const fmt = ora(chalk.yellow("Running format")).start();
      run("npm run format");
      fmt.succeed(chalk.green("Format complete"));

      const push = ora(chalk.yellow(`Pushing to ${currentBranch}`)).start();
      run(`git push origin ${currentBranch}`);
      push.succeed(chalk.green("Pushed successfully"));
    }

    console.log(chalk.greenBright(`\nCherry-pick complete\n`));
  } catch (err) {
    console.log(chalk.red("\nCherry-pick failed:\n") + chalk.gray(err.message));
    console.log(
      chalk.yellow('\nTip: Fix conflicts manually, then run "git cherry-pick --continue"\n'),
    );
    process.exit(1);
  }
  process.exit(0);
};

// ==================== REBASE ====================
const rebaseBranch = async (branch) => {
  console.log(chalk.cyan(`\n${pkg.name} : ${pkg.version}\n`));
  console.log(chalk.magenta(`Rebasing current branch onto ${branch}\n`));

  if (!branch) {
    console.log(chalk.red("Branch name required"));
    console.log(chalk.yellow("Usage: npm run git rebase <branch>"));
    console.log(chalk.gray("Example: npm run git rebase main\n"));
    process.exit(1);
  }

  try {
    // Check if branch exists
    const checkBranch = ora(chalk.yellow("Checking branch exists")).start();
    const branches = run("git branch -a");

    if (!branches.includes(branch)) {
      checkBranch.fail(chalk.red(`Branch "${branch}" not found`));
      process.exit(1);
    }
    checkBranch.succeed(chalk.green(`Branch "${branch}" found`));

    // Check for uncommitted changes
    const checkChanges = ora(chalk.yellow("Checking for uncommitted changes")).start();
    const status = run("git status --porcelain");

    if (status.trim()) {
      checkChanges.warn(chalk.yellow("You have uncommitted changes"));
      console.log(chalk.gray("\n" + status));

      const answer = await prompt(chalk.cyan("Commit changes before rebasing? (y/n): "));

      if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
        const commitMsg = await prompt(chalk.cyan("Enter commit message: "));

        const fmt = ora(chalk.yellow("Running format")).start();
        run("npm run format");
        fmt.succeed(chalk.green("Format complete"));

        const commit = ora(chalk.yellow("Committing changes")).start();
        run("git add .");
        run(`git commit -m "${commitMsg}"`);
        commit.succeed(chalk.green("Changes committed"));
      } else {
        console.log(chalk.red("\nPlease commit or stash your changes first"));
        console.log(chalk.yellow("Run: git stash or git add . && git commit -m 'message'\n"));
        process.exit(1);
      }
    } else {
      checkChanges.succeed(chalk.green("Working tree clean"));
    }

    // Pull latest from base branch
    const pullBase = ora(chalk.yellow(`Pulling latest from ${branch}`)).start();
    try {
      run(`git fetch origin ${branch}`);
      pullBase.succeed(chalk.green(`Fetched latest ${branch}`));
    } catch {
      pullBase.warn(chalk.yellow("Could not fetch from remote"));
    }

    // Perform rebase
    const rebase = ora(chalk.yellow(`Rebasing onto ${branch}`)).start();
    try {
      run(`git rebase origin/${branch}`);
      rebase.succeed(chalk.green(`Successfully rebased onto ${branch}`));
    } catch (err) {
      rebase.fail(chalk.red("Rebase conflict detected"));
      console.log(chalk.yellow("\nTip: Fix conflicts manually, then run:"));
      console.log(chalk.white("  git add ."));
      console.log(chalk.white("  git rebase --continue\n"));
      process.exit(1);
    }

    // Ask if want to force push
    const pushAnswer = await prompt(chalk.cyan("Force push changes now? (y/n): "));

    if (pushAnswer.toLowerCase() === "y" || pushAnswer.toLowerCase() === "yes") {
      const currentBranch = run("git branch --show-current").trim();
      const forcePush = ora(chalk.yellow(`Force pushing ${currentBranch}`)).start();
      run(`git push origin ${currentBranch} --force-with-lease`);
      forcePush.succeed(chalk.green("Force pushed successfully"));
    }

    console.log(chalk.greenBright(`\nRebase complete\n`));
  } catch (err) {
    console.log(chalk.red("\nRebase failed:\n") + chalk.gray(err.message));
    process.exit(1);
  }
  process.exit(0);
};

// ==================== INTERACTIVE REBASE ====================
const interactiveRebase = async (commitsStr) => {
  console.log(chalk.cyan(`\n${pkg.name} : ${pkg.version}\n`));

  if (!commitsStr || isNaN(commitsStr)) {
    console.log(chalk.red("Number of commits required"));
    console.log(chalk.yellow("Usage: npm run git rebase-interactive <number>"));
    console.log(chalk.gray("Example: npm run git rebase-interactive 3\n"));
    console.log(chalk.cyan("Options during interactive rebase:"));
    console.log(chalk.white("  pick   ") + chalk.gray("- use commit"));
    console.log(chalk.white("  reword ") + chalk.gray("- use commit, but edit message"));
    console.log(chalk.white("  squash ") + chalk.gray("- use commit, meld into previous"));
    console.log(chalk.white("  fixup  ") + chalk.gray("- like squash, but discard message"));
    console.log(chalk.white("  drop   ") + chalk.gray("- remove commit\n"));
    process.exit(1);
  }

  try {
    // Check for uncommitted changes
    const checkChanges = ora(chalk.yellow("Checking for uncommitted changes")).start();
    const status = run("git status --porcelain");

    if (status.trim()) {
      checkChanges.warn(chalk.yellow("You have uncommitted changes"));
      console.log(chalk.gray("\n" + status));

      const answer = await prompt(chalk.cyan("Commit changes before rebasing? (y/n): "));

      if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
        const commitMsg = await prompt(chalk.cyan("Enter commit message: "));

        const fmt = ora(chalk.yellow("Running format")).start();
        run("npm run format");
        fmt.succeed(chalk.green("Format complete"));

        const commit = ora(chalk.yellow("Committing changes")).start();
        run("git add .");
        run(`git commit -m "${commitMsg}"`);
        commit.succeed(chalk.green("Changes committed"));
      } else {
        console.log(chalk.red("\nPlease commit or stash your changes first\n"));
        process.exit(1);
      }
    } else {
      checkChanges.succeed(chalk.green("Working tree clean"));
    }

    // Show commits to be rebased
    const info = ora(chalk.yellow(`Fetching last ${commitsStr} commits`)).start();
    try {
      const commits = run(`git log --oneline -${commitsStr}`);
      info.succeed(chalk.green("Commits found"));
      console.log(chalk.gray(`\n${commits}`));
    } catch {
      info.fail(chalk.red("Could not fetch commits"));
      process.exit(1);
    }

    // Confirm interactive rebase
    const confirm = await prompt(
      chalk.cyan(`Start interactive rebase for last ${commitsStr} commits? (y/n): `),
    );

    if (confirm.toLowerCase() !== "y" && confirm.toLowerCase() !== "yes") {
      console.log(chalk.gray("\nCancelled\n"));
      process.exit(0);
    }

    // Interactive rebase
    console.log(chalk.magenta("\nOpening interactive rebase editor...\n"));
    const rebaseCmd = spawn("git", ["rebase", "-i", `HEAD~${commitsStr}`], {
      cwd,
      stdio: "inherit",
    });

    rebaseCmd.on("close", (code) => {
      if (code === 0) {
        console.log(chalk.greenBright("\nInteractive rebase completed\n"));

        (async () => {
          const pushAnswer = await prompt(chalk.cyan("Push changes now? (y/n): "));

          if (pushAnswer.toLowerCase() === "y" || pushAnswer.toLowerCase() === "yes") {
            const currentBranch = run("git branch --show-current").trim();
            const forcePush = ora(chalk.yellow(`Force pushing ${currentBranch}`)).start();
            try {
              run(`git push origin ${currentBranch} --force-with-lease`);
              forcePush.succeed(chalk.green("Force pushed successfully"));
            } catch {
              forcePush.fail(chalk.red("Force push failed"));
            }
          }
          process.exit(0);
        })();
      } else {
        console.log(chalk.red("\nInteractive rebase cancelled or failed\n"));
        process.exit(1);
      }
    });
  } catch (err) {
    console.log(chalk.red("\nFailed to start interactive rebase:\n") + chalk.gray(err.message));
    process.exit(1);
  }
};

// ==================== REBASE & MERGE ====================
const rebaseAndMerge = async (branch, targetBranch) => {
  console.log(chalk.cyan(`\n${pkg.name} : ${pkg.version}\n`));
  const currentBranch = run("git branch --show-current").trim();
  const target = targetBranch || "main";

  console.log(chalk.magenta(`Rebase → Force Push → Merge: ${currentBranch} → ${target}\n`));

  try {
    // Step 1: Rebase
    console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.yellow("STEP 1: Rebasing..."));
    console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));

    const checkBranch = ora(chalk.yellow("Checking branch exists")).start();
    const branches = run("git branch -a");

    if (!branches.includes(branch)) {
      checkBranch.fail(chalk.red(`Branch "${branch}" not found`));
      process.exit(1);
    }
    checkBranch.succeed(chalk.green(`Branch "${branch}" found`));

    // Check for uncommitted changes
    const checkChanges = ora(chalk.yellow("Checking for uncommitted changes")).start();
    const status = run("git status --porcelain");

    if (status.trim()) {
      checkChanges.warn(chalk.yellow("You have uncommitted changes"));
      console.log(chalk.gray("\n" + status));

      const answer = await prompt(chalk.cyan("Commit changes before rebasing? (y/n): "));

      if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
        const commitMsg = await prompt(chalk.cyan("Enter commit message: "));

        const fmt = ora(chalk.yellow("Running format")).start();
        run("npm run format");
        fmt.succeed(chalk.green("Format complete"));

        const commit = ora(chalk.yellow("Committing changes")).start();
        run("git add .");
        run(`git commit -m "${commitMsg}"`);
        commit.succeed(chalk.green("Changes committed"));
      } else {
        console.log(chalk.red("\nPlease commit or stash your changes first\n"));
        process.exit(1);
      }
    } else {
      checkChanges.succeed(chalk.green("Working tree clean"));
    }

    // Pull latest from base branch
    const pullBase = ora(chalk.yellow(`Pulling latest from ${branch}`)).start();
    try {
      run(`git fetch origin ${branch}`);
      pullBase.succeed(chalk.green(`Fetched latest ${branch}`));
    } catch {
      pullBase.warn(chalk.yellow("Could not fetch from remote"));
    }

    // Perform rebase
    const rebase = ora(chalk.yellow(`Rebasing onto ${branch}`)).start();
    try {
      run(`git rebase origin/${branch}`);
      rebase.succeed(chalk.green(`Successfully rebased onto ${branch}`));
    } catch (err) {
      rebase.fail(chalk.red("Rebase conflict detected"));
      console.log(chalk.yellow("\nTip: Fix conflicts manually, then run:"));
      console.log(chalk.white("  git add ."));
      console.log(chalk.white("  git rebase --continue\n"));
      process.exit(1);
    }

    // Step 2: Force Push
    console.log(chalk.cyan("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.yellow("STEP 2: Force Pushing..."));
    console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));

    const forcePush = ora(chalk.yellow(`Force pushing ${currentBranch}`)).start();
    run(`git push origin ${currentBranch} --force-with-lease`);
    forcePush.succeed(chalk.green("Force pushed successfully"));

    // Step 3: Merge
    console.log(chalk.cyan("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.yellow("STEP 3: Merging..."));
    console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));

    const checkout = ora(chalk.yellow(`Switching to ${target}`)).start();
    run(`git checkout ${target}`);
    checkout.succeed(chalk.green(`Switched to ${target}`));

    const pullTarget = ora(chalk.yellow(`Pulling latest from ${target}`)).start();
    try {
      run(`git pull origin ${target}`);
      pullTarget.succeed(chalk.green("Branch up to date"));
    } catch {
      pullTarget.warn(chalk.yellow("Could not pull"));
    }

    const merge = ora(chalk.yellow(`Merging ${currentBranch}`)).start();
    run(`git merge ${currentBranch} --ff-only`);
    merge.succeed(chalk.green(`Merged ${currentBranch} successfully`));

    const pushMerge = ora(chalk.yellow(`Pushing ${target}`)).start();
    run(`git push origin ${target}`);
    pushMerge.succeed(chalk.green(`Pushed to origin/${target}`));

    console.log(
      chalk.greenBright(
        `\n✅ Complete! Rebased, pushed, and merged ${currentBranch} → ${target}\n`,
      ),
    );
  } catch (err) {
    console.log(chalk.red("\nOperation failed:\n") + chalk.gray(err.message));
    console.log(chalk.yellow("\nTip: Check git status or run 'git log' to see what happened\n"));
    process.exit(1);
  }
  process.exit(0);
};

// ==================== MERGE ====================
const mergeBranches = async (source, target) => {
  console.log(chalk.cyan(`\n${pkg.name} : ${pkg.version}\n`));
  console.log(chalk.magenta(`Merging ${source} → ${target}\n`));

  try {
    // Check branches exist
    const checkBranches = ora(chalk.yellow("Checking branches")).start();
    const branches = run("git branch -a");

    if (!branches.includes(source)) {
      checkBranches.fail(chalk.red(`Source branch "${source}" not found`));
      process.exit(1);
    }

    checkBranches.succeed(chalk.green("Branches verified"));

    // Check for uncommitted changes
    const checkChanges = ora(chalk.yellow("Checking for uncommitted changes")).start();
    const status = run("git status --porcelain");

    if (status.trim()) {
      checkChanges.warn(chalk.yellow("You have uncommitted changes"));
      console.log(chalk.gray("\n" + status));

      const answer = await prompt(
        chalk.cyan("Do you want to commit these changes before merging? (y/n): "),
      );

      if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
        const commitMsg = await prompt(chalk.cyan("Enter commit message: "));

        const commit = ora(chalk.yellow("Committing changes")).start();
        run("git add .");
        run(`git commit -m "${commitMsg}"`);
        commit.succeed(chalk.green("Changes committed"));
      } else {
        console.log(chalk.red("\nPlease commit or stash your changes first"));
        console.log(chalk.yellow("Run: git stash or git add . && git commit -m 'message'\n"));
        process.exit(1);
      }
    } else {
      checkChanges.succeed(chalk.green("Working tree clean"));
    }

    // Switch to target branch
    const checkout = ora(chalk.yellow(`Switching to ${target}`)).start();
    run(`git checkout ${target}`);
    checkout.succeed(chalk.green(`Switched to ${target}`));

    // Pull latest
    const pull = ora(chalk.yellow("Pulling latest changes")).start();
    try {
      run(`git pull origin ${target}`);
      pull.succeed(chalk.green("Branch up to date"));
    } catch {
      pull.warn(chalk.yellow("Could not pull (maybe first push)"));
    }

    // Merge
    const merge = ora(chalk.yellow(`Merging ${source}`)).start();
    run(`git merge ${source} --no-ff -m "Merge ${source} into ${target}"`);
    merge.succeed(chalk.green(`Merged ${source} successfully`));

    // Push
    const push = ora(chalk.yellow(`Pushing ${target}`)).start();
    run(`git push origin ${target}`);
    push.succeed(chalk.green(`Pushed to origin/${target}`));

    // Delete merged branch
    const deleteBranch = ora(chalk.yellow(`Deleting merged branch ${source}`)).start();
    try {
      run(`git branch -d ${source}`);
      deleteBranch.succeed(chalk.green(`Deleted local branch ${source}`));

      // Try to delete remote branch
      try {
        run(`git push origin --delete ${source}`);
        console.log(chalk.green(`Deleted remote branch origin/${source}`));
      } catch {
        console.log(chalk.yellow(`Remote branch origin/${source} not found or already deleted`));
      }
    } catch (err) {
      deleteBranch.warn(chalk.yellow(`Could not delete branch: ${err.message}`));
    }

    console.log(chalk.greenBright(`\nSuccessfully merged ${source} → ${target}\n`));
  } catch (err) {
    console.log(chalk.red("\nMerge failed:\n") + chalk.gray(err.message));
    console.log(chalk.yellow("\nTip: Check for merge conflicts or run 'git status'\n"));
    process.exit(1);
  }
};

// ==================== COMMIT & PUSH ====================
const commitAndPush = async (branch, message) => {
  console.log(chalk.cyan(`\n${pkg.name} : ${pkg.version}\n`));

  try {
    const fmt = ora(chalk.yellow("Running format")).start();
    run("npm run format");
    fmt.succeed(chalk.green("Format complete"));

    // Check if there are changes to commit
    const checkChanges = ora(chalk.yellow("Checking for changes")).start();
    const status = run("git status --porcelain");

    if (!status.trim()) {
      checkChanges.warn(chalk.yellow("No changes to commit"));
      process.exit(0);
    }
    checkChanges.succeed(chalk.green("Changes detected"));

    // Stage files
    const stage = ora(chalk.yellow("Staging files")).start();
    run("git add .");
    stage.succeed(chalk.green("Files staged"));

    // Commit
    const commit = ora(chalk.yellow("Creating commit")).start();
    run(`git commit -m "${message}"`);
    commit.succeed(chalk.green(`Committed -> "${message}"`));

    // Push with progress
    console.log(chalk.magenta(`\nPushing to origin/${branch}...\n`));
    const push = spawn("git", ["push", "origin", branch], {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const bar = new cliProgress.SingleBar({
      format: chalk.magenta("Upload") + " |" + chalk.cyan("{bar}") + "| {percentage}%",
      barCompleteChar: "█",
      barIncompleteChar: "░",
      hideCursor: true,
    });

    bar.start(100, 0);

    push.stderr.on("data", (data) => {
      const text = data.toString();
      const match = text.match(/(\d+)%/);
      if (match) {
        bar.update(parseInt(match[1]));
      }
      process.stdout.write(chalk.gray(text));
    });

    push.on("close", (code) => {
      bar.update(100);
      bar.stop();

      if (code === 0) {
        console.log(chalk.greenBright("\nPushed successfully\n"));
      } else {
        console.log(chalk.red("\nPush failed\n"));
        process.exit(code);
      }
    });
  } catch (err) {
    console.log(chalk.red("\nGit error:\n") + chalk.gray(err.message));
    process.exit(1);
  }
};

// ==================== CREATE NEW BRANCH ====================
const createNewBranch = async (branchName) => {
  console.log(chalk.cyan(`\n${pkg.name} : ${pkg.version}\n`));

  if (!branchName) {
    console.log(chalk.red("\nBranch name required"));
    console.log(chalk.yellow("Usage: npm run git new <branch-name>"));
    console.log(chalk.gray("Example: npm run git new feature/awesome\n"));
    process.exit(1);
  }

  try {
    // Check if branch already exists
    const checkBranch = ora(chalk.yellow("Checking branch availability")).start();
    const branches = run("git branch -a");

    if (branches.includes(branchName)) {
      checkBranch.fail(chalk.red(`Branch "${branchName}" already exists`));
      process.exit(1);
    }
    checkBranch.succeed(chalk.green(`Branch "${branchName}" available`));

    // Check for uncommitted changes (optional)
    const status = run("git status --porcelain");

    if (status.trim()) {
      console.log(chalk.yellow("\nYou have uncommitted changes:"));
      console.log(chalk.gray(status));

      const answer = await prompt(chalk.cyan("Commit changes before creating branch? (y/n): "));

      if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
        const commitMsg = await prompt(chalk.cyan("Enter commit message: "));

        const fmt = ora(chalk.yellow("Running format")).start();
        run("npm run format");
        fmt.succeed(chalk.green("Format complete"));

        const commit = ora(chalk.yellow("Committing changes")).start();
        run("git add .");
        run(`git commit -m "${commitMsg}"`);
        commit.succeed(chalk.green("Changes committed"));
      } else {
        console.log(chalk.yellow("Continuing without committing...\n"));
      }
    }

    // Create and switch to new branch
    const create = ora(chalk.yellow(`Creating branch "${branchName}"`)).start();
    run(`git checkout -b ${branchName}`);
    create.succeed(chalk.green(`Branch "${branchName}" created and switched`));

    console.log(chalk.greenBright(`\nReady to work on ${chalk.yellow(branchName)}\n`));
  } catch (err) {
    console.log(chalk.red("\nFailed to create branch:\n") + chalk.gray(err.message));
    process.exit(1);
  }
  process.exit(0);
};

// ==================== MAIN ====================
(async () => {
  const args = process.argv.slice(2);
  const command = args[0];

  if (
    !command ||
    command === "help" ||
    command === "--help" ||
    command === "h" ||
    command === "-h"
  ) {
    showHelp();
  }

  switch (command) {
    case "pr":
      await createPullRequest();
      break;

    case "pull":
      await pullChanges();
      break;

    case "undo":
      await undoCommit();
      break;

    case "cherry-pick":
      await cherryPick(args[1]);
      break;

    case "new":
      await createNewBranch(args[1]);
      break;

    case "merge":
      if (!args[1] || !args[2]) {
        console.log(chalk.red("\nMissing arguments"));
        console.log(chalk.yellow("Usage: npm run git merge <source> <target>"));
        console.log(chalk.gray("Example: npm run git merge nishu main\n"));
        process.exit(1);
      }
      await mergeBranches(args[1], args[2]);
      break;

    case "rebase":
      await rebaseBranch(args[1]);
      break;

    case "rebase-interactive":
      await interactiveRebase(args[1]);
      break;

    case "rebase-merge":
      await rebaseAndMerge(args[1], args[2]);
      break;

    default:
      // Commit & Push: npm run git <branch> <message>
      const branch = command;
      const message = args.slice(1).join(" ").replace(/"/g, '\\"') || "updated something";
      await commitAndPush(branch, message);
      break;
  }
})();
