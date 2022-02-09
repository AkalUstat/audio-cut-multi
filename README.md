# Audio Cut Multi

Lifted my own code from my own project [ydl-text](https://github.com/FatehKhalsaTech/ydl-text) for Khalis Hackathon

## Installation

> Requires Node 12 (I think). But if that doesn't work, then 14+


Not available on npm as of yet, so `git clone https://github.com/AkalUstat/audio-cut-multi.git` and run `npm run local_install` or just `npm link`. If you're using asdf, remember to run `asdf reshim` afterwords.

## Usage 

```
$ audio-cut-multi -h
Usage: audio-cut-multi [options] <path>

Arguments:
  path                         audio file path

Options:
  -t, --from-text <text-path>  text file to read timestamps from
  -l, --list [timestamps...]   give timestamps as a comma separated list
  -p, --output-path <path>     override default output path (default: process.cwd)
  -h, --help                   display help for command
  ```

This tool requires your audio file to already be on your local machine. If you need help with that, try using [youtube-dl](https://github.com/ytdl-org/youtube-dl) on its own or alongside my nodejs wrapper for it, [ydl-text](https://github.com/FatehKhalsaTech/ydl-text).

Once you have the audio file, simply pass the path to the command like so

`audio-cut-multi ./{INSERT_PATH_HERE}`

You now need to pass some timestamps to the command, either via a space separated list with the `-l` flag or a text file with the `-t` flag.

**`-l` flag:**

`audio-cut-multi ./{INSERT_PATH_HERE} -l  0:30 1:20 2:15 11:12`

**`-t` flag:**

Inside `{INSERT_FILE_NAME}.txt`:
```
0:30
1:20
2:15
11:12
```
and then:
`audio-cut-multi ./{INSERT_PATH_HERE} -t ./{INSERT_FILE_NAME}`

When giving timestamps, please make sure **NOT** to include the start time of the file or the end time of the file...the program handles it automagically and it breaks otherwise and I couldn't find a fix to that yet.

When cutting through, the program will cut from timestamp to timestamp. For example, given our times above, the program will cut 5 files: from `0:00` to `0:30`, `0:30` to `1:20`, `1:20` to `2:15`, `2:15` to `11:12`, and `11:12` to `end`. 
Each file will be name accordingly: `{START_TIME}-to-{END_TIME}-{ORIGINAL_FILE_NAME}`

Finally, specify the output-path if you require the files to be written to a different location. Otherwise, it will use the current working directory. 


