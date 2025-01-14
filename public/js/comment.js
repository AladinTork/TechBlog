// Handle comment submission via AJAX
document.getElementById('comment_form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    const commentContent = document.querySelector('textarea[name="commentContent"]').value;
    const postId = "{{post.id}}"; // Ensure the post ID is treated as a string

    // Send the comment to the backend via AJAX
    fetch(`/api/post/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentContent: commentContent, // Send the comment content
      }),
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error:', error);
      });
  });
  