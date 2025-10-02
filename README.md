# instaslide

i built an app that lets you **create slideshows instantly** :scream:

simply paste an outline of what you want your slideshow to be, press generate, and the app will make you a perfectly presentable slideshow in **less than 30 seconds**

you can even save your slideshows and share them with others!

built with:

- nextjs, typescript on frontend
- trpc talking to databse on backend

how it works:
when you press "generate", an llm uses the slidev markdown library to generate a slideshow. we store this in supabase and then render it using the slidev client

used claude heavily for ui, supabase, and basically everything else lmfao. was a bit shocked on how well it was able to generate a very very nice (not even vibe coded looking!) ui

# [demo here](https://instaslide.jeffz.dev)

video demo below! :point_down:

https://youtu.be/_VwbD8r3FVU
