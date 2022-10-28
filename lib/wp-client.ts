// This simulates an API Client to show how you can use segment options
// When you don't have access to fetch.

interface FetchPayload {
  query: string
  variables?: Record<string, string>
}

export class WordPressClient {
  baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async query(payload: FetchPayload) {
    const response = await fetch(new URL(this.baseUrl).toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response?.ok) {
      throw new Error(response.statusText)
    }

    const { data, errors } = await response.json()

    if (errors) {
      throw new Error(errors?.map((e) => e.message).join("\n") ?? "unknown")
    }

    return data
  }

  async getPosts() {
    const data = await this.query({
      query: `
				query AllPosts {
					posts(where: {orderby: {field: DATE, order: DESC}}) {
						edges {
							node {
								id
								title
								excerpt
								slug
								date
								featuredImage {
									node {
										sourceUrl
									}
								}
								author {
									node {
										name
										firstName
										lastName
										avatar {
											url
										}
									}
								}
							}
						}
					}
				}
			`,
    })

    return data?.posts?.edges.map(({ node }) => node)
  }

  async getPostBySlug(slug: string) {
    const data = await this.query({
      query: `
				query ($uri: String!) {
					nodeByUri(uri: $uri) {
						__typename
						... on Post {
							id
							title
							content
							slug
							date
							featuredImage {
								node {
									sourceUrl
								}
							}
							author {
								node {
									name
									firstName
									lastName
									avatar {
										url
									}
								}
							}
						}
					}
				}
			`,
      variables: {
        uri: slug,
      },
    })

    return data?.nodeByUri
  }

  async getPostSlugs() {
    const data = await this.query({
      query: `
				query {
					posts(first: 10000) {
						edges {
							node {
								slug
							}
						}
					}
				}
			`,
    })

    return data?.posts?.edges.map(({ node }) => node)
  }
}

export const wpClient = new WordPressClient(process.env.WORDPRESS_API_URL)
