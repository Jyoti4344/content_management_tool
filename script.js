document.addEventListener("DOMContentLoaded", () => {
    const blogForm = document.getElementById("blog-form");
    const titleInput = document.getElementById("title");
    const contentTextarea = document.getElementById("content");
    const imageInput = document.getElementById("image");
    const videoInput = document.getElementById("video");
    const blogPreview = document.getElementById("blog-preview");

    // Load previously saved blog posts from localStorage
    let savedBlogPosts = JSON.parse(localStorage.getItem("blogPosts")) || [];

    // Display saved blog posts
    savedBlogPosts.forEach((post, index) => {
        displayBlogPost(post, index);
    });

    blogForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = titleInput.value;
        const content = contentTextarea.value;
        const imageUrl = imageInput.files[0] ? storeImage(imageInput.files[0]) : "";
        const videoUrl = videoInput.value;

        // Create a blog post object
        const blogPost = {
            title,
            content,
            imageUrl,
            videoUrl,
        };

        // Save the blog post to localStorage
        savedBlogPosts.push(blogPost);
        localStorage.setItem("blogPosts", JSON.stringify(savedBlogPosts));

        // Display the blog post
        displayBlogPost(blogPost, savedBlogPosts.length - 1);

        // Clear form fields
        titleInput.value = "";
        contentTextarea.value = "";
        imageInput.value = "";
        videoInput.value = "";
    });

    function displayBlogPost(post, index) {
        const postElement = document.createElement("div");
        postElement.classList.add("blog-post");
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <img src="${post.imageUrl}" alt="Blog Image">
            <iframe width="560" height="315" src="${post.videoUrl}" frameborder="0" allowfullscreen></iframe>
            <button class="edit-button" data-index="${index}">Edit</button>
            <button class="delete-button" data-index="${index}">Delete</button>
        `;

        blogPreview.appendChild(postElement);

        const editButtons = document.querySelectorAll(".edit-button");
        editButtons.forEach((button) => {
            button.addEventListener("click", () => {
                editBlogPost(index);
            });
        });

        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", () => {
                deleteBlogPost(index);
                postElement.remove();
            });
        });
    }

    function editBlogPost(index) {
        const postToEdit = savedBlogPosts[index];
        if (!postToEdit) return;

        const updatedTitle = prompt("Edit Title:", postToEdit.title);
        const updatedContent = prompt("Edit Content:", postToEdit.content);
        const updatedImageUrl = prompt("Edit Image URL:", postToEdit.imageUrl);
        const updatedVideoUrl = prompt("Edit Video URL:", postToEdit.videoUrl);

        if (updatedTitle !== null) {
            postToEdit.title = updatedTitle;
        }

        if (updatedContent !== null) {
            postToEdit.content = updatedContent;
        }

        if (updatedImageUrl !== null) {
            postToEdit.imageUrl = updatedImageUrl;
        }

        if (updatedVideoUrl !== null) {
            postToEdit.videoUrl = updatedVideoUrl;
        }

        savedBlogPosts[index] = postToEdit;

        localStorage.setItem("blogPosts", JSON.stringify(savedBlogPosts));

        blogPreview.innerHTML = "";
        savedBlogPosts.forEach((post, i) => {
            displayBlogPost(post, i);
        });
    }

    function deleteBlogPost(index) {
        
        savedBlogPosts.splice(index, 1);

        // Update localStorage with the modified array
        localStorage.setItem("blogPosts", JSON.stringify(savedBlogPosts));
    }

    function storeImage(file) {
        // In a real application, you would upload the image to your server
        // For this example, we'll just generate a temporary URL
        const imageUrl = URL.createObjectURL(file);
        return imageUrl;
    }
});