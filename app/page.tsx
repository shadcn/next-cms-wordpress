import Image from "next/image"
import Link from "next/link"

import { wpClient } from "@/lib/wp-client"
import { formatDate } from "@/lib/utils"

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

  return (
    <div className="grid gap-10">
      {posts.map((post) => (
        <article key={post.id}>
          <Link href={`/posts/${post.slug}`}>
            <h2 className="mt-0">{post.title}</h2>
          </Link>
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
          {post.excerpt && (
            <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
          )}
        </article>
      ))}
    </div>
  )
}
