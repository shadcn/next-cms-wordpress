# WordPress + Next.js 13

An example Next.js 13 app built from WordPress data. - [@shadcn](https://twitter.com/shadcn)

## Features

- Uses segment options.
- Dynamic front page with latest posts (`getServerSideProps`)
- Static post page with fallback and not found behavior (`getStaticPaths` / `getStaticProps`)

## Front Page (`getServerSideProps`)

```ts
import { wpClient } from "@/lib/wp-client"

// This is the home page.
// On the home page, I want to display a list of the latest posts.

// I want the home page to be dynamic i.e I want Next.js to refetch the data
// for this page every time I visit it.
// I set revalidate to 0.
// This is like getServerSideProps.
export const revalidate = 0

export default async function Home() {
  // Fetch all posts.
  const posts = await wpClient.getPosts()

  return ...
}
```

## Post page (`getStaticPaths` / `getStaticProps`)

```ts
import { notFound } from "next/navigation"

import { wpClient } from "@/lib/wp-client"

// This page is a post page.
// I want this page to be static/cached indefinitely until manually revalidated.
// This is default behavior so no need to specify any segment options.

// We use generateStaticParams to return an array of slugs.
export async function generateStaticParams() {
  const posts = await wpClient.getPostSlugs()

  return posts?.map((post) => ({
    slug: post.slug.split("/"),
  }))
}

export default async function Post({ params }) {
  // Here we fetch the post using the slug.
  const post = await wpClient.getPostBySlug(`/${params?.slug.join("/")}`)

  // If we reached here, it means the post was not found.
  // We trigger a notFound() to render not-found.tsx.
  if (!post) {
    notFound()
  }

  return ...
}
```


