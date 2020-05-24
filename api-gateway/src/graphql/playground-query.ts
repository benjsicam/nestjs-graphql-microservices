export const playgroundQuery = `mutation signup {
  signup(
    data: {
      name: "Sample User"
      email: "user1@example.com"
      password: "admin1234"
      age: 18
    }
  ) {
    user {
      id
      name
      email
      age
      createdAt
      updatedAt
      version
    }
    errors {
      field
      message
    }
  }
}

mutation login {
  login(
    data: {
      email: "user1@example.com",
      password: "admin1234"
    }
  ) {
    user {
      id
      name
      email
      age
    }
    errors {
      field
      message
    }
  }
}

mutation refreshToken {
  refreshToken {
    user {
      id
      name
      email
      age
    }
  }
}

mutation logout {
  logout
}

subscription postAdded {
  postAdded {
    id
    title
    body
    createdAt
    updatedAt
    version
  }
}

subscription commentAdded {
  commentAdded(post: "<replace with post id>") {
    id
    text
    createdAt
    updatedAt
    version
  }
}

mutation createPost {
  createPost(
    data: {
      title: "My Awesome Blog Post",
      body: "My Awesome Blog Content",
      published: false
    }
  ) {
    errors {
      field
      message
    }
    post {
      id
      title
      published
      body
      createdAt
      updatedAt
      version
      author {
        id
        name
      }
      comments(first: 50) {
        edges {
          node {
            id
            text
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
}

mutation updatePost {
  updatePost(
    id: "<replace with post id>",
    data: { published: true }
  ) {
    errors {
      field
      message
    }
    post {
      id
      title
      published
      createdAt
      updatedAt
      version
      author {
        id
        name
      }
      comments(first: 50) {
        edges {
          node {
            id
            text
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
}

mutation createComment {
  createComment(
    data: {
      text: "My Awesome Comment",
      post: "<replace with post id>"
    }
  ) {
    errors {
      field
      message
    }
    comment {
      id
      text
      createdAt
      updatedAt
      version
      author {
        id
        name
        email
      }
      post {
        id
        title
      }
    }
  }
}

mutation updateComment {
  updateComment(
    id: "<replace with comment id>"
    data: { text: "My Awesome Comment 2" }
  ) {
    errors {
      field
      message
    }
    comment {
      id
      text
      createdAt
      updatedAt
      version
      author {
        id
        name
        email
      }
      post {
        id
        title
      }
    }
  }
}

query me {
  me {
    id
    name
    email
    age
    createdAt
    updatedAt
    version
    posts(first: 50) {
      edges {
        node {
          id
          title
          body
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
    comments(first: 50) {
      edges {
        node {
          id
          text
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
}

query myPosts {
  myPosts(first: 50) {
    edges {
      node {
        id
        title
        body
        createdAt
        updatedAt
        version
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}

query findEverything {
  users: users(first: 50) {
    edges {
      node {
        id
        name
        email
        age
        createdAt
        updatedAt
        version
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
  posts: posts(first: 50) {
    edges {
      node {
        id
        title
        body
        published
        createdAt
        updatedAt
        version
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
  comments: comments(first: 50) {
    edges {
      node {
        id
        text
        createdAt
        updatedAt
        version
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}

query findUsers {
  users(first: 50) {
    edges {
      node {
        id
        name
        email
        age
        createdAt
        updatedAt
        version
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}

query findPosts {
  posts(first: 50) {
    edges {
      node {
        id
        title
        body
        published
        createdAt
        updatedAt
        version
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}

query findComments {
  comments(first: 50) {
    edges {
      node {
        id
        text
        createdAt
        updatedAt
        version
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}

query findUsersIncludingPostsAndComments {
  users(first: 50) {
    edges {
      node {
        id
        name
        email
        age
        createdAt
        updatedAt
        version
        posts(first: 50) {
          edges {
            node {
              id
              title
              body
              published
              createdAt
              updatedAt
              version
            }
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
        }
        comments(first: 50) {
          edges {
            node {
              id
              text
              createdAt
              updatedAt
              version
            }
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
        }
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}

query findPostsIncludingCommentsWithAuthor {
  posts(first: 50) {
    edges {
      node {
        id
        title
        body
        published
        createdAt
        updatedAt
        version
        author {
          id
          name
          createdAt
          updatedAt
          version
        }
        comments(first: 50) {
          edges {
            node {
              id
              text
              createdAt
              updatedAt
              version
            }
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
        }
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}

query findCommentsIncludingAuthor {
  comments(first: 50) {
    edges {
      node {
        id
        text
        createdAt
        updatedAt
        version
        author {
          id
          name
          email
          age
          createdAt
          updatedAt
          version
        }
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}

query findUser {
  user(id: "<replace with user id>") {
    id
    name
    email
    age
    createdAt
    updatedAt
    version
  }
}

query findPost {
  post(id: "<replace with post id>") {
    id
    title
    body
    createdAt
    updatedAt
    version
    author {
      id
      name
    }
  }
}

query commentCount {
  commentCount
}

query postCount {
  postCount
}

query userCount {
  userCount
}

mutation updateProfile {
  updateProfile(data: {
    name: "Sample User 2",
    age: 19
    }
  ) {
    errors {
      field
      message
    }
    user {
      id
      name
      email
      age
      createdAt
      updatedAt
      version
    }
  }
}

mutation updateEmail {
  updateEmail(
    data: {
      email: "sample2@example.com",
      currentPassword: "admin1234"
    }
  ) {
    user {
      id
      name
      email
      age
      createdAt
      updatedAt
      version
    }
    errors {
      field
      message
    }
  }
}

mutation updatePassword {
  updatePassword(
    data: {
      currentPassword: "admin1234",
      newPassword: "user12345",
      confirmPassword: "user12345"
    }
  ) {
    user {
      id
      name
      email
      age
      createdAt
      updatedAt
      version
    }
    errors {
      field
      message
    }
  }
}

mutation deleteComment {
  deleteComment(id: "<replace with comment id>") {
    errors {
      field
      message
    }
    count
  }
}

mutation deletePost {
  deletePost(id: "<replace with post id>") {
    errors {
      field
      message
    }
    count
  }
}

mutation deleteAccount {
  deleteAccount {
    errors {
      field
      message
    }
    count
  }
}

`
