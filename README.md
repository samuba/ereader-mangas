# ereader-mangas

I got annoyed that there was no good, free solution to reading mangas on my Kindle. Especially because I don't want to transfer the new chapters every week.
So I build this to fix my pain.

[https://ereader-mangas.vercel.app](https://ereader-mangas.vercel.app)

# features

- utilizes as much of the screen as possible
- powerful search
- over 33.7000 Mangas
- remembers last reading position
- add/remove favorites
- no login required

## Disclaimer

This is basically just an ereader friendly frontend for manganato.com. I do not host any content myself, all data is just proxied.

## TODO

- make proxying the images faster
  - look into streaming the req/res
  - caching via cloudflare
    - asynchroniously trigger image fetch for the next 3 images
- optimize pages with long width
