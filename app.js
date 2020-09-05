
const comments = [];
// Target DOM Elements
const comment_box = document.querySelector("#comment_box");
const comment_wrapper = document.querySelector("#comment-listing");
const nestedCommentForm = document.querySelector("#comment_list_inner .comment-area");
const emoji_container = document.getElementById("emoji")
const reply_input = document.querySelector("#reply-box")

//initialize loacl stroge if not
if (localStorage.getItem("comments") === null)
  localStorage.setItem("comments", JSON.stringify(comments));

//Add comment object in localStorge
function addComment(comment) {
  let all_comments = getItemFromLocalStorage();
  all_comments.push(comment);
  setItemInLocalStorage(all_comments);
};

//update local stroge with new data
function setItemInLocalStorage(newData) {
  localStorage.setItem("comments", JSON.stringify(newData));
  renderComments();
};

//Add reply on the same index
function addReply(reply, index) {
  let all_comments = getItemFromLocalStorage();
  const foundElem = all_comments.find((element, i) => i === index)
  foundElem.children ? foundElem.children.push(reply) : foundElem.children = [reply]
  setItemInLocalStorage(all_comments);
};

//Delete parent comment
function deleteComment(index) {
  let comment_list = getItemFromLocalStorage();
  const updatedComment = comment_list.filter((element, i) => i != index);
  setItemInLocalStorage(updatedComment);
};

// Delete child comment
function deleteChild(id) {
  let comment_list = getItemFromLocalStorage();
  comment_list.forEach((comment) => {
    if (comment.children) {
      comment.children.splice(id, 1);
    }
  });
  setItemInLocalStorage(comment_list);
};


//get all existing comments from localStroge
function getItemFromLocalStorage() {
  return JSON.parse(localStorage.getItem("comments"))
};

// Reply on any parent comment
function reply(index) {
  nestedCommentForm.style.display = "flex";
  reply_input.addEventListener("keypress", (e) => {
    if (e.keyCode === 13) {
      let message = reply_input.value;
      if (message != "") {
        let comment_obj = {
          name: "Ankit",
          src: "http://facebook.com/",
          message: message,
        };
        addReply(comment_obj, index); //adding reply in local stroge
        reply_input.value = "";
        nestedCommentForm.style.display = "none";
      }
    }
  });
};

function renderCommentHTML(comment, index) {
  return `<li class="comment_list">
    <div class="parent-comment">
        <div class="user_avtar">
            <img src="https://is.gd/7QS0yw">
        </div>
        <div class="user-comments">
            <h3>Amir Sohel</h3>
            <p>${comment.message}</p>
            <a onclick="reply(${index})" class="reply">Reply</a>
            <a onclick="deleteComment(${index})" class="delete">Delete</a>
        </div>
    </div>
    ${comment && comment.children ? comment.children.map((children, childIndex) => `<div class="sub-comment">
    <div class="user_avtar">
        <img src="https://is.gd/MHC0y5">
    </div>
    <div class="user-comments">
        <h3>Johny Smith</h3>
        <p>${children.message}</p>
        <a onclick="reply(${index})" class="reply">Reply</a>
        <a onclick="deleteChild(${childIndex})" class="delete">Delete</a>
    </div>
</div>`).join("") : ""}</li>`
}



//render all comments on UI
function renderComments() {
  let comment_lists = getItemFromLocalStorage();
  let comment_list = comment_lists.map(renderCommentHTML).join("");
  comment_wrapper.innerHTML = comment_list
  //get list from bottom
  comment_wrapper.scrollTo({
    top: comment_wrapper.scrollHeight,
    behavior: "smooth",
  });
};

//adding new comment on press enter
comment_box.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    let message = comment_box.value;
    let comment_obj = {
      name: "Amir Sohel",
      src: "https://is.gd/MHC0y5",
      message: message,
    };
    comment_box.value = "";
    addComment(comment_obj);
  }
});

//on load get all comments
renderComments();

