# s3sync-cli

Sync files with AWS S3 via a node.js powered cli.

## Setup

Install globally with npm:

```
npm i -g s3sync-cli
```

Setup environment variables for your AWS credentials:

```
  AWS_ACCESS_KEY=abc123
  AWS_SECRET_KEY=def456
```

## Usage

```
Usage:
  s3sync -b bucket [-p path] [-f pattern] [-d pattern] [-t n]

Options:

  -h, --help          Show help
  -b, --bucket        S3 bucket to sync with
  -p, --path          Directory path, defaults to cwd
  -t, --watch         Sync again every n seconds
  -f, --filefilter    File filter pattern
  -d, --dirfilter     Directory filter pattern
```
