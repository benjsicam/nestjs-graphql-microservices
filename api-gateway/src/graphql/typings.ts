
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateCommentInput {
    text: string;
    post: string;
}

export interface UpdateCommentInput {
    text?: string;
}

export interface CreatePostInput {
    title: string;
    body: string;
    published: boolean;
}

export interface UpdatePostInput {
    title?: string;
    body?: string;
    published?: boolean;
}

export interface SignupUserInput {
    name: string;
    email: EmailAddress;
    password: string;
    age?: UnsignedInt;
}

export interface LoginUserInput {
    email: EmailAddress;
    password: string;
}

export interface UpdateProfileInput {
    name?: string;
    age?: UnsignedInt;
}

export interface UpdateEmailInput {
    email: EmailAddress;
    currentPassword: string;
}

export interface UpdatePasswordInput {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface IMutation {
    signup(data: SignupUserInput): UserPayload | Promise<UserPayload>;
    login(data: LoginUserInput): UserPayload | Promise<UserPayload>;
    refreshToken(): UserPayload | Promise<UserPayload>;
    logout(): boolean | Promise<boolean>;
    createComment(data: CreateCommentInput): CommentPayload | Promise<CommentPayload>;
    updateComment(id: string, data: UpdateCommentInput): CommentPayload | Promise<CommentPayload>;
    deleteComment(id: string): DeleteCommentPayload | Promise<DeleteCommentPayload>;
    createPost(data: CreatePostInput): PostPayload | Promise<PostPayload>;
    updatePost(id: string, data: UpdatePostInput): PostPayload | Promise<PostPayload>;
    deletePost(id: string): DeletePostPayload | Promise<DeletePostPayload>;
    updateProfile(data: UpdateProfileInput): UserPayload | Promise<UserPayload>;
    updateEmail(data?: UpdateEmailInput): UserPayload | Promise<UserPayload>;
    updatePassword(data?: UpdatePasswordInput): UserPayload | Promise<UserPayload>;
    deleteAccount(): DeleteAccountPayload | Promise<DeleteAccountPayload>;
}

export interface IQuery {
    comments(q?: string, first?: number, last?: number, before?: string, after?: string, filterBy?: JSONObject, orderBy?: string): CommentsConnection | Promise<CommentsConnection>;
    commentCount(q?: string, filterBy?: JSONObject): number | Promise<number>;
    post(id: string): Post | Promise<Post>;
    posts(q?: string, first?: number, last?: number, before?: string, after?: string, filterBy?: JSONObject, orderBy?: string): PostsConnection | Promise<PostsConnection>;
    postCount(q?: string, filterBy?: JSONObject): number | Promise<number>;
    myPosts(q?: string, first?: number, last?: number, before?: string, after?: string, filterBy?: JSONObject, orderBy?: string): PostsConnection | Promise<PostsConnection>;
    user(id: string): User | Promise<User>;
    users(q?: string, first?: number, last?: number, before?: string, after?: string, filterBy?: JSONObject, orderBy?: string): UsersConnection | Promise<UsersConnection>;
    userCount(q?: string, filterBy?: JSONObject): number | Promise<number>;
    me(): User | Promise<User>;
}

export interface ISubscription {
    commentAdded(post: string): Comment | Promise<Comment>;
    postAdded(): Post | Promise<Post>;
}

export interface Comment {
    id: string;
    text: string;
    author: User;
    post: Post;
    createdAt: DateTime;
    updatedAt: DateTime;
    version: number;
}

export interface CommentsConnection {
    edges: CommentEdge[];
    pageInfo: PageInfo;
}

export interface CommentEdge {
    node: Comment;
    cursor: string;
}

export interface CommentPayload {
    errors?: ErrorPayload[];
    comment?: Comment;
}

export interface DeleteCommentPayload {
    errors?: ErrorPayload[];
    count?: number;
}

export interface ErrorPayload {
    field?: string;
    message?: string[];
}

export interface PageInfo {
    startCursor: string;
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface Post {
    id: string;
    title: string;
    body: string;
    published: boolean;
    author: User;
    comments?: CommentsConnection;
    createdAt: DateTime;
    updatedAt: DateTime;
    version: number;
}

export interface PostsConnection {
    edges: PostEdge[];
    pageInfo: PageInfo;
}

export interface PostEdge {
    node: Post;
    cursor: string;
}

export interface PostPayload {
    errors?: ErrorPayload[];
    post?: Post;
}

export interface DeletePostPayload {
    errors?: ErrorPayload[];
    count?: number;
}

export interface User {
    id: string;
    name: string;
    email: EmailAddress;
    age?: UnsignedInt;
    posts?: PostsConnection;
    comments?: CommentsConnection;
    createdAt: DateTime;
    updatedAt: DateTime;
    version: number;
}

export interface UsersConnection {
    edges: UserEdge[];
    pageInfo: PageInfo;
}

export interface UserEdge {
    node: User;
    cursor: string;
}

export interface UserPayload {
    errors?: ErrorPayload[];
    user?: User;
}

export interface DeleteAccountPayload {
    errors?: ErrorPayload[];
    count?: number;
}

export type DateTime = any;
export type EmailAddress = any;
export type UnsignedInt = any;
export type JSONObject = any;
