# Protocol Documentation
<a name="top"></a>

## Table of Contents

- [comment.proto](#comment.proto)
    - [Comment](#comment.Comment)
    - [CommentEdge](#comment.CommentEdge)
    - [CreateCommentInput](#comment.CreateCommentInput)
    - [FindCommentsPayload](#comment.FindCommentsPayload)
    - [UpdateCommentInput](#comment.UpdateCommentInput)
  
  
  
    - [CommentService](#comment.CommentService)
  

- [commons.proto](#commons.proto)
    - [Count](#commons.Count)
    - [Id](#commons.Id)
    - [PageInfo](#commons.PageInfo)
    - [Query](#commons.Query)
  
  
  
  

- [mailer.proto](#mailer.proto)
    - [SendMailInput](#mailer.SendMailInput)
    - [SendMailPayload](#mailer.SendMailPayload)
  
  
  
    - [MailerService](#mailer.MailerService)
  

- [post.proto](#post.proto)
    - [CreatePostInput](#post.CreatePostInput)
    - [FindPostsPayload](#post.FindPostsPayload)
    - [Post](#post.Post)
    - [PostEdge](#post.PostEdge)
    - [UpdatePostInput](#post.UpdatePostInput)
  
  
  
    - [PostService](#post.PostService)
  

- [user.proto](#user.proto)
    - [CreateUserInput](#user.CreateUserInput)
    - [FindUsersPayload](#user.FindUsersPayload)
    - [UpdateUserInput](#user.UpdateUserInput)
    - [User](#user.User)
    - [UserEdge](#user.UserEdge)
  
  
  
    - [UserService](#user.UserService)
  

- [Scalar Value Types](#scalar-value-types)



<a name="comment.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## comment.proto



<a name="comment.Comment"></a>

### Comment



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| text | [string](#string) |  |  |
| author | [string](#string) |  |  |
| post | [string](#string) |  |  |
| createdAt | [string](#string) |  |  |
| updatedAt | [string](#string) |  |  |
| version | [int32](#int32) |  |  |






<a name="comment.CommentEdge"></a>

### CommentEdge



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| node | [Comment](#comment.Comment) |  |  |
| cursor | [string](#string) |  |  |






<a name="comment.CreateCommentInput"></a>

### CreateCommentInput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| text | [string](#string) |  |  |
| author | [string](#string) |  |  |
| post | [string](#string) |  |  |






<a name="comment.FindCommentsPayload"></a>

### FindCommentsPayload



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| edges | [CommentEdge](#comment.CommentEdge) | repeated |  |
| pageInfo | [commons.PageInfo](#commons.PageInfo) |  |  |






<a name="comment.UpdateCommentInput"></a>

### UpdateCommentInput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| data | [Comment](#comment.Comment) |  |  |





 

 

 


<a name="comment.CommentService"></a>

### CommentService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| find | [.commons.Query](#commons.Query) | [FindCommentsPayload](#comment.FindCommentsPayload) |  |
| findById | [.commons.Id](#commons.Id) | [Comment](#comment.Comment) |  |
| findOne | [.commons.Query](#commons.Query) | [Comment](#comment.Comment) |  |
| count | [.commons.Query](#commons.Query) | [.commons.Count](#commons.Count) |  |
| create | [CreateCommentInput](#comment.CreateCommentInput) | [Comment](#comment.Comment) |  |
| update | [UpdateCommentInput](#comment.UpdateCommentInput) | [Comment](#comment.Comment) |  |
| destroy | [.commons.Query](#commons.Query) | [.commons.Count](#commons.Count) |  |

 



<a name="commons.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## commons.proto



<a name="commons.Count"></a>

### Count



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| count | [int32](#int32) |  |  |






<a name="commons.Id"></a>

### Id



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |






<a name="commons.PageInfo"></a>

### PageInfo



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| startCursor | [string](#string) |  |  |
| endCursor | [string](#string) |  |  |
| hasNextPage | [bool](#bool) |  |  |
| hasPreviousPage | [bool](#bool) |  |  |






<a name="commons.Query"></a>

### Query



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| select | [string](#string) | repeated |  |
| where | [string](#string) |  |  |
| orderBy | [string](#string) | repeated |  |
| limit | [int32](#int32) |  |  |
| before | [string](#string) |  |  |
| after | [string](#string) |  |  |





 

 

 

 



<a name="mailer.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## mailer.proto



<a name="mailer.SendMailInput"></a>

### SendMailInput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| template | [string](#string) |  |  |
| to | [string](#string) |  |  |
| data | [bytes](#bytes) |  |  |






<a name="mailer.SendMailPayload"></a>

### SendMailPayload



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| isSent | [bool](#bool) |  |  |





 

 

 


<a name="mailer.MailerService"></a>

### MailerService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| send | [SendMailInput](#mailer.SendMailInput) | [SendMailPayload](#mailer.SendMailPayload) |  |

 



<a name="post.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## post.proto



<a name="post.CreatePostInput"></a>

### CreatePostInput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| title | [string](#string) |  |  |
| body | [string](#string) |  |  |
| published | [bool](#bool) |  |  |
| author | [string](#string) |  |  |






<a name="post.FindPostsPayload"></a>

### FindPostsPayload



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| edges | [PostEdge](#post.PostEdge) | repeated |  |
| pageInfo | [commons.PageInfo](#commons.PageInfo) |  |  |






<a name="post.Post"></a>

### Post



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| title | [string](#string) |  |  |
| body | [string](#string) |  |  |
| published | [bool](#bool) |  |  |
| author | [string](#string) |  |  |
| createdAt | [string](#string) |  |  |
| updatedAt | [string](#string) |  |  |
| version | [int32](#int32) |  |  |






<a name="post.PostEdge"></a>

### PostEdge



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| node | [Post](#post.Post) |  |  |
| cursor | [string](#string) |  |  |






<a name="post.UpdatePostInput"></a>

### UpdatePostInput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| data | [Post](#post.Post) |  |  |





 

 

 


<a name="post.PostService"></a>

### PostService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| find | [.commons.Query](#commons.Query) | [FindPostsPayload](#post.FindPostsPayload) |  |
| findById | [.commons.Id](#commons.Id) | [Post](#post.Post) |  |
| findOne | [.commons.Query](#commons.Query) | [Post](#post.Post) |  |
| count | [.commons.Query](#commons.Query) | [.commons.Count](#commons.Count) |  |
| create | [CreatePostInput](#post.CreatePostInput) | [Post](#post.Post) |  |
| update | [UpdatePostInput](#post.UpdatePostInput) | [Post](#post.Post) |  |
| destroy | [.commons.Query](#commons.Query) | [.commons.Count](#commons.Count) |  |

 



<a name="user.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## user.proto



<a name="user.CreateUserInput"></a>

### CreateUserInput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| name | [string](#string) |  |  |
| email | [string](#string) |  |  |
| password | [string](#string) |  |  |
| age | [int32](#int32) |  |  |






<a name="user.FindUsersPayload"></a>

### FindUsersPayload



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| edges | [UserEdge](#user.UserEdge) | repeated |  |
| pageInfo | [commons.PageInfo](#commons.PageInfo) |  |  |






<a name="user.UpdateUserInput"></a>

### UpdateUserInput



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| data | [User](#user.User) |  |  |






<a name="user.User"></a>

### User



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| name | [string](#string) |  |  |
| email | [string](#string) |  |  |
| password | [string](#string) |  |  |
| age | [int32](#int32) |  |  |
| createdAt | [string](#string) |  |  |
| updatedAt | [string](#string) |  |  |
| version | [int32](#int32) |  |  |






<a name="user.UserEdge"></a>

### UserEdge



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| node | [User](#user.User) |  |  |
| cursor | [string](#string) |  |  |





 

 

 


<a name="user.UserService"></a>

### UserService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| find | [.commons.Query](#commons.Query) | [FindUsersPayload](#user.FindUsersPayload) |  |
| findById | [.commons.Id](#commons.Id) | [User](#user.User) |  |
| findOne | [.commons.Query](#commons.Query) | [User](#user.User) |  |
| count | [.commons.Query](#commons.Query) | [.commons.Count](#commons.Count) |  |
| create | [CreateUserInput](#user.CreateUserInput) | [User](#user.User) |  |
| update | [UpdateUserInput](#user.UpdateUserInput) | [User](#user.User) |  |
| destroy | [.commons.Query](#commons.Query) | [.commons.Count](#commons.Count) |  |

 



## Scalar Value Types

| .proto Type | Notes | C++ Type | Java Type | Python Type |
| ----------- | ----- | -------- | --------- | ----------- |
| <a name="double" /> double |  | double | double | float |
| <a name="float" /> float |  | float | float | float |
| <a name="int32" /> int32 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. | int32 | int | int |
| <a name="int64" /> int64 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. | int64 | long | int/long |
| <a name="uint32" /> uint32 | Uses variable-length encoding. | uint32 | int | int/long |
| <a name="uint64" /> uint64 | Uses variable-length encoding. | uint64 | long | int/long |
| <a name="sint32" /> sint32 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s. | int32 | int | int |
| <a name="sint64" /> sint64 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s. | int64 | long | int/long |
| <a name="fixed32" /> fixed32 | Always four bytes. More efficient than uint32 if values are often greater than 2^28. | uint32 | int | int |
| <a name="fixed64" /> fixed64 | Always eight bytes. More efficient than uint64 if values are often greater than 2^56. | uint64 | long | int/long |
| <a name="sfixed32" /> sfixed32 | Always four bytes. | int32 | int | int |
| <a name="sfixed64" /> sfixed64 | Always eight bytes. | int64 | long | int/long |
| <a name="bool" /> bool |  | bool | boolean | boolean |
| <a name="string" /> string | A string must always contain UTF-8 encoded or 7-bit ASCII text. | string | String | str/unicode |
| <a name="bytes" /> bytes | May contain any arbitrary sequence of bytes. | string | ByteString | str |

