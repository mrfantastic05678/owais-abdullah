// lib/sanity/queries.ts
import { groq } from 'next-sanity'

export const allToolReviewsQuery = groq`
  *[_type == "toolReview"] | order(myRating desc, dateAdded desc) {
    _id,
    name,
    slug,
    category,
    tagline,
    myRating,
    stackLayer,
    logo,
    featured,
    projectsUsingIt
  }
`

export const featuredToolReviewsQuery = groq`
  *[_type == "toolReview" && featured == true] | order(myRating desc) {
    _id,
    name,
    slug,
    category,
    tagline,
    myRating,
    stackLayer,
    logo,
    projectsUsingIt
  }
`

export const toolReviewBySlugQuery = groq`
  *[_type == "toolReview" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    category,
    tagline,
    myRating,
    useCase,
    stackLayer,
    clientFit,
    websiteUrl,
    githubUrl,
    docsUrl,
    logo,
    featured,
    dateAdded,
    projectsUsingIt,
    body
  }
`

export const toolsByCategoryQuery = groq`
  *[_type == "toolReview" && category == $category] | order(myRating desc) {
    _id,
    name,
    slug,
    tagline,
    myRating,
    stackLayer,
    logo,
    projectsUsingIt
  }
`

export const allToolSlugsQuery = groq`
  *[_type == "toolReview" && defined(slug.current)].slug.current
`
