# windows96-local-2.0
**Have fun messing with Windows 96!**

## ⚠Disclaimer⚠

The main reason the windows 96 team had me take down windows 96 local 1.0 from their git server, was people being able to rehost their site using my script.

Even though I may be banned from their discord server, I still expect you to not just steal their site and rehost it without adding any proper value to it.

*Do note Windows 96 is **NOT** open source!
Even if you rehost *and* add some value, <ins>you could still get a DMCA</ins> from the windows 96 team, so be careful!*



<ins>***Rehosting is at your own risk!***</ins>

## Troubleshooting & Modern Node.js Setup

If you are running this project on modern Node.js versions (Node 18+ / Node 26+), you may run into strict TypeScript compilation errors or network routing issues. Follow these steps to get a clean build:
### 1. Network / DNS Issues (IPv6 Fallback)
If the ROFS downloader fails with an `ETIMEDOUT` or `ENETUNREACH` error, force Node to prioritize IPv4 during asset downloads:
```bash
node --dns-result-order=ipv4first "rofs downloader.js" https://windows96.net
```

## How do I download windows 96 using this?

1. Download this repository.

2. Run `npm install` and `npx tsc`

3. Run `node "rofs downloader.js" https://windows96.net` to start downloading.

4. Wait until you see `Done` in the console.

5. Start a local web server to use your local copy (e.g. `php -S 127.0.0.1:3000` or `npx http-server`)

## Recommended Environment

**Linux or Windows is recommended** for running this project, preferably with Node.JS installed.

Using NVM makes it easier to install and switch between Node.js versions if compatibility issues occur.

**Note:** Windows and other operating systems may work, but Linux with NVM is the recommended setup.
