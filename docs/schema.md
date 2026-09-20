users
-----
id
email
name
avatar_url
created_at


notes
-----
id
user_id
title
content
content_json
summary
cover_image_url
status
created_at
updated_at


tags
----
id
user_id
name


note_tags
---------
note_id
tag_id


attachments
-----------
id
note_id
type
url
filename
mime_type
size
created_at


ai_generations
--------------
id
note_id
user_id
type
model
prompt
input_tokens
output_tokens
result
created_at


embeddings
----------
id
note_id
chunk_index
content
embedding
created_at