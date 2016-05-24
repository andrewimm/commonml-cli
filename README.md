A lazy man's lazy tool. `cml` provides a couple of handy aliases to run CommonML commands from anywhere in your project tree.

### Installation

```
npm install -g commonml-cli
```

This installs the `cml` command line tool, which gives you a couple handy commands to save time. More are planned, as more tedious tasks present themselves.

### Usage

From anywhere in your CommonML project, use any of the following actions:

 * `cml install` - Run `npm install` at the top level of your CommonML project, fetching all of your dependencies
 * `cml build` - Run the CommonML build script from anywhere in the project tree
 * `cml dir` - show the top-level directory of the current CommonML project, mostly to know what the other commands will do

That's it. It removes the hassle of needing to run current-working-directory-specific commands.
