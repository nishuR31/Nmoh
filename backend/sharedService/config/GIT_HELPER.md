# 📚 Git Helper - Complete Guide

## Quick Reference

```bash
# Show this help
npm run git help

# Branch Management
npm run git new <branch-name>
npm run git pull
npm run git undo

# Commit & Push
npm run git <branch> <message>

# Merge
npm run git merge <source> <target>

# Rebase (All 3 variants)
npm run git rebase <branch>
npm run git rebase-interactive <commits>
npm run git rebase-merge <branch>

# Other
npm run git cherry-pick <commit-hash>
npm run git pr
```

---

## ✅ Rebase & Merge Together

### **One Command Does Everything:**

```bash
npm run git rebase-merge main
```

**This executes 3 steps automatically:**

#### Step 1️⃣ **Rebase** - Replay your commits on top of main

```bash
git fetch origin main
git rebase origin/main
```

✅ Your branch now has latest main + your changes

#### Step 2️⃣ **Force Push** - Update remote with clean history

```bash
git push origin <your-branch> --force-with-lease
```

✅ Remote branch updated (safe flag, won't overwrite others)

#### Step 3️⃣ **Merge** - Merge into main

```bash
git checkout main
git pull origin main
git merge <your-branch> --ff-only
git push origin main
```

✅ Your changes are now in main!

---

## 📋 Full Workflow Example

```bash
# Create a new feature branch
npm run git new feature/user-auth

# Make changes and commit
echo "new code" > file.js
npm run git feature/user-auth "added user auth"

# More commits...
npm run git feature/user-auth "fixed bug in auth"

# Ready to merge? Rebase + Push + Merge all at once
npm run git rebase-merge main

# Done! 🎉 Your code is now in main
```

---

## 🔄 What Happens Step-by-Step

```
BEFORE:
main:     A ─── B ─── C
                    │
feature:            D ─── E ─── F

STEP 1 - Rebase (replay your commits):
main:     A ─── B ─── C
                    │
feature:            D' ─── E' ─── F'
                    (commits moved on top of latest main)

STEP 2 - Force Push (update remote):
Remote updated with: D' ─── E' ─── F'

STEP 3 - Merge (merge into main):
main:     A ─── B ─── C ─── D' ─── E' ─── F'
                                   ↑
                            (merged, linear history!)
```

---

## 🎯 When to Use Each Command

| Scenario              | Command                            |
| --------------------- | ---------------------------------- |
| Start new work        | `npm run git new feature/x`        |
| Save your changes     | `npm run git <branch> 'message'`   |
| Get latest from main  | `npm run git rebase main`          |
| Cleanup commits       | `npm run git rebase-interactive 3` |
| Merge + Clean history | `npm run git rebase-merge main`    |
| Merge without rebase  | `npm run git merge branch1 main`   |
| Get a specific commit | `npm run git cherry-pick abc123`   |
| Undo last commit      | `npm run git undo`                 |
| Create PR             | `npm run git pr`                   |

---

## 📖 Detailed Commands

### BRANCH MANAGEMENT

#### Create New Branch

```bash
npm run git new feature/awesome
```

- Creates and switches to new branch
- Prompts to commit any pending changes
- Ready to start coding!

#### Pull Latest Changes

```bash
npm run git pull
```

- Updates current branch with latest from remote
- Safe if no local changes

#### Undo Last Commit

```bash
npm run git undo
```

- Keeps changes, just removes commit
- Use if you committed by mistake

---

### COMMIT & PUSH

#### Commit & Push Changes

```bash
npm run git <branch-name> <message>
npm run git feature/auth "added login form"
npm run git main "fixed footer bug"
```

- Formats code automatically
- Stages all changes
- Commits with message
- Pushes to remote
- Shows progress bar

---

### REBASE OPERATIONS

#### Standard Rebase

```bash
npm run git rebase main
```

- Rebases current branch onto main
- Gets latest main commits
- Replays your commits on top
- Prompts to force push

**When to use:** Before merging to catch conflicts early

#### Interactive Rebase

```bash
npm run git rebase-interactive 3
```

- Shows last 3 commits
- Opens editor to modify commits
- Operations:
  - `pick` - keep commit
  - `reword` - change message
  - `squash` - combine with previous
  - `fixup` - combine, discard message
  - `drop` - remove commit

**When to use:** Clean up messy commits before merging

#### Rebase & Merge (Complete Flow)

```bash
npm run git rebase-merge main
```

- ✅ Rebases onto main
- ✅ Force pushes safely
- ✅ Merges into main
- ✅ All in one command!

**When to use:** Ready to merge, want clean history

---

### MERGE OPERATIONS

#### Merge Two Branches

```bash
npm run git merge source target
npm run git merge feature/auth main
```

- Merges source into target
- Pulls latest from target first
- Uses `--no-ff` (preserves merge commit)
- Pushes result

**When to use:** Standard merge that shows branch history

#### Difference: Rebase vs Merge

**Rebase (linear history):**

```
main: A ─── B ─── C ─── D ─── E
      (all commits in a line)
```

✅ Clean, easy to read
✅ Each commit builds on previous

**Merge (branching history):**

```
      ┌─── C ─── D ───┐
      │               │ (merge commit)
main: A ─── B ───────────── E
      (preserves branches)
```

✅ Shows work was done in parallel
✅ Merge commit documents integration

---

### OTHER COMMANDS

#### Cherry-pick Specific Commit

```bash
npm run git cherry-pick abc123d
```

- Finds commit by hash
- Applies to current branch
- Prompts to format & push
- Useful for backporting fixes

#### Create Pull Request

```bash
npm run git pr
```

- Ensures branch is pushed
- Asks for PR title & description
- Opens GitHub PR creation page
- Fills in details automatically

---

## ⚡ Pro Tips

### 🎯 Tip 1: Rebase Before Merge

```bash
npm run git rebase main
npm run git rebase-merge main
# Better than direct merge!
```

### 🎯 Tip 2: Clean Up Commits

```bash
npm run git rebase-interactive 5
# Squash related commits
# Reword unclear messages
```

### 🎯 Tip 3: Recover from Mistakes

```bash
git reflog  # See all actions
git reset --hard <commit>  # Go back if needed
```

### 🎯 Tip 4: Fetch Before Push

```bash
npm run git pull  # Get latest first
npm run git rebase main  # Avoid conflicts
```

### 🎯 Tip 5: Force Push Safely

```bash
# Only use --force-with-lease (built into commands)
# Never use --force (can overwrite others' work)
git push origin branch --force-with-lease ✅
git push origin branch --force ❌
```

---

## 🚨 Conflict Resolution

If rebase fails with conflicts:

```bash
# See conflicted files
git status

# Edit files to resolve:
# Remove conflict markers: <<<<<<, ======, >>>>>>

# Stage resolved files
git add .

# Continue rebase
git rebase --continue

# Or abort if needed
git rebase --abort
```

---

## 📊 Git History Visualization

```bash
# See your commits
git log --oneline -5

# See all branches
git branch -a

# See commit details
git log -p -1

# See what changed
git diff main
```

---

## 🎓 Learning Path

1. **Start:** `npm run git new <branch>`
2. **Work:** Make changes
3. **Save:** `npm run git <branch> 'message'`
4. **Repeat:** Steps 2-3 multiple times
5. **Clean:** `npm run git rebase-interactive 3` (if messy)
6. **Integrate:** `npm run git rebase-merge main`
7. **Done:** Code is now in main!

---

## 📞 Quick Troubleshooting

| Problem               | Solution                                        |
| --------------------- | ----------------------------------------------- |
| Need latest changes   | `npm run git pull`                              |
| Have uncommitted work | `npm run git <branch> 'message'` or `git stash` |
| Rebase failed         | `git rebase --abort` then fix conflicts         |
| Wrong commit          | `npm run git undo`                              |
| Lost changes          | `git reflog` to find it                         |
| Can't push            | `npm run git pull` first, then push             |

---

## ✨ One-Command Summary

```bash
# The complete workflow in 2 commands:
npm run git feature/x 'added new feature'  # Work & save
npm run git rebase-merge main              # Integrate
```

Done! 🚀
