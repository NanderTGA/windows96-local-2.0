# windows96-local-2.0
## The infamous windows 96 downloader!


They don't want you to see this.

They don't want this to be public.

They had me take down 1.0, which was buggy anyways,

but now I am releasing the better (working) version.

No bugs, no weird crashing server script, now you can just download everything in one command, and host it using any web server!

**Have fun messing with Windows 96!**

## ⚠Disclaimer⚠

The main reason the windows 96 team had me take down windows 96 local 1.0 from their git server, was people being able to rehost their site using my script.

Even though I may be banned from their discord server, I still expect you to not just steal their site and rehost it without adding any proper value to it.

*Do note Windows 96 is **NOT** open source!
Even if you rehost *and* add some value, <ins>you could still get a DMCA</ins> from the windows 96 team, so be careful!*



<ins>***Rehosting is at your own risk!***</ins>

## How do I download windows 96 using this?

1. Download this repository.

2. Run `npm install` and `npx tsc`

3. Run `node "rofs downloader.js" https://windows96.net` to start downloading.

4. Wait until you see `Done` in the console.

5. Start a local web server to use your local copy (e.g. `php -S 127.0.0.1:3000` or `npx http-server`)
