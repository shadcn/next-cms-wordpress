import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

import { wpClient } from "@/lib/wp-client"
import { formatDate } from "@/lib/utils"

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

  return (
    <div className="grid gap-10">
      <Link href="/">Back</Link>
      <article>
        <h1 className="mt-0">{post.title}</h1>
        <div className="flex items-center space-x-2">
          {post.author && (
            <>
              <Image
                src={post.author.node.avatar.url}
                alt="Picture"
                width={40}
                height={40}
                className="m-0 rounded-full"
              />
              <span>
                {" "}
                Posted by <strong>{post.author.node.name}</strong>
              </span>
            </>
          )}
          {post.date && <span> on {formatDate(post.date)}</span>}
        </div>
        {post.featuredImage?.node?.sourceUrl && (
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.title}
            width={700}
            height={450}
          />
        )}
        {post.content && (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
      </article>
    </div>
  )
}
