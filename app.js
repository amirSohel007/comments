document.addEventListener("DOMContentLoaded", () => {
  const comments = [];
  // Target DOM Elements
  const comment_box = document.querySelector("#comment_box");
  const comment_wrapper = document.querySelector("#comment-listing");
  const nestedCommentForm = document.querySelector("#comment_list_inner .comment-area");
  const emoji_container = document.getElementById("emoji")

  //initialize loacl stroge if not
  if (localStorage.getItem("comments") === null)
    localStorage.setItem("comments", JSON.stringify(comments));

  //Add comment object in localStorge
  const addComment = (comment) => {
    let all_comments = getItemFromLocalStorage();
    all_comments.push(comment);
    setItemInLocalStorage(all_comments);
  };

  //get emoji on keypress
  const getEmoticons = async (parms) => {
    const get_responce = await fetch(`https://emoji.getdango.com/api/emoji?q=${parms}`);
    const json_data = await get_responce.json();
    return json_data;
  };

  //gettig li list of emoji
  comment_box.addEventListener("input", async (e) => {
    const list = await getEmoticons(e.target.value);
    let emoji_list = await list.results
      .map((list) => {
        return `<li>${list.text}</li>`;
      })
      .join("");
    if(comment_box.value != '')
      emoji_container.innerHTML = emoji_list;
      else
      emoji_container.innerHTML = ''
  });


  //get emoji on click and insert in input 
  document.getElementById("emoji").addEventListener('click', (e)=> {
     const stor_emoji = e.target.textContent
     comment_box.value +=  stor_emoji
     emoji_container.innerHTML = ''
  })


  //update local stroge with new data
  const setItemInLocalStorage = (newData) => {
    localStorage.setItem("comments", JSON.stringify(newData));
    renderComments();
  };

  //Add reply on the same index
  const addReply = (reply, index) => { 
    let all_comments = getItemFromLocalStorage();
    all_comments.find((element, i) => {
      if (i == index) {
        if (element.children) {
          element.children.push(reply);
        } else {
          element.children = [reply];
        }
      }
    });
    setItemInLocalStorage(all_comments);
  };

  //Delete parent comment
  const deleteComment = (index) => {
    let comment_list = getItemFromLocalStorage();
    comment_list.splice(index, 1);
    setItemInLocalStorage(comment_list);
  };

  // Delete child comment
  const deleteChild = (id) => {
    let comment_list = getItemFromLocalStorage();
    comment_list.forEach((comment) => {
      if (comment.children) {
        comment.children.splice(id, 1);
      }
    });
    setItemInLocalStorage(comment_list);
  };

  //Check is key enter or not
  const checkEnterKey = (e) => {
    var code = e.keyCode ? e.keyCode : e.which;
    return code == 13 ? true : false;
  };

  //get all existing comments from localStroge
  const getItemFromLocalStorage = () =>
    JSON.parse(localStorage.getItem("comments"));

  // Reply on any parent comment
  const reply = (index) => {
    //show comment reply form
    nestedCommentForm.style.display = "flex";
    const reply_input = document.querySelector("#reply-box");
    reply_input.addEventListener("keypress", (e) => {
      if (checkEnterKey(e)) {
        let message = reply_input.value;
        if (message != "") {
          let comment_obj = {
            name: "Ankit",
            src: "http://facebook.com/",
            message: message,
          };
          addReply(comment_obj, index); //adding reply in local stroge
          document.querySelector("#reply-box").value = "";
          nestedCommentForm.style.display = "none";
        }
      }
    });
  };

  //render all comments on UI
  let renderComments = () => {
    let comment_lists = getItemFromLocalStorage();
    let comment_list = comment_lists
      .map((comment, index) => {
        return  `<li class="comment_list">
        <div class="parent-comment">
            <div class="user_avtar">
                <img
                    src="https://instagram.fdel18-1.fna.fbcdn.net/v/t51.2885-15/e35/95168755_1188313104848732_7163586086101228730_n.jpg?_nc_ht=instagram.fdel18-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=E04Bpx3IeJYAX8m_BP-&oh=3486a37e1f6b0807382ed237660dc258&oe=5EDC7BFF">
            </div>
            <div class="user-comments">
                <h3>Amir Sohel</h3>
                <p>${comment.message}</p>
                <a onclick="reply(${index})" class="reply">Reply</a>
                <a onclick="deleteComment(${index})" class="delete">Delete</a>
            </div>
        </div>
        ${
          comment && comment.children
            ? comment.children
                .map(
                  (children, childIndex) => `<div class="sub-comment">
        <div class="user_avtar">
            <img
                src="https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F6%2F2018%2F04%2Fnup_181708_1056-2000.jpg">
        </div>
        <div class="user-comments">
            <h3>Johny Smith</h3>
            <p>${children.message}</p>
            <a onclick="reply(${index})" class="reply">Reply</a>
            <a onclick="deleteChild(${childIndex})" class="delete">Delete</a>
        </div>
    </div>`).join("")
 : ""
        }
    </li>`;
      })
      .join("");

    //Bind wiht html
    comment_wrapper.innerHTML = comment_list;
    //get list from bottom
    comment_wrapper.scrollTo({
      top: comment_wrapper.scrollHeight,
      behavior: "smooth",
    });
  };

  //adding new comment on press enter
  comment_box.addEventListener("keypress", (e) => {
    if (checkEnterKey(e)) {
      let message = comment_box.value;
      let comment_obj = {
        name: "Amir Sohel",
        src: "http://google.com/",
        message: message,
      };
      comment_box.value = "";
      addComment(comment_obj);
    }
  });

  //Adding functions in global scope
  window.reply = reply;
  window.deleteComment = deleteComment;
  window.deleteChild = deleteChild;

  //on load get all comments
  renderComments();
});
