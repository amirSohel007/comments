document.addEventListener('DOMContentLoaded', ()=> {
    let comments = []
    let commentCheck = false;
    // Target DOM Elements
    let comment_box = document.querySelector("#comment_box");
    let comment_btn = document.querySelector("#add_comment");
    let comment_wrapper = document.querySelector("#comment_list_inner")

    //initialize loacl stroge if not 
    if (localStorage.getItem('comments') === null)
    localStorage.setItem('comments', JSON.stringify(comments));

    //Add comment object in localStorge
    let addComment = comment => {
        let all_comments = JSON.parse(localStorage.getItem('comments'))
        all_comments.push(comment)
        localStorage.setItem('comments', JSON.stringify(all_comments))
    }

    //Add reply on the same index
    let addReply = (reply, index) => {
        let all_comments = JSON.parse(localStorage.getItem('comments'))
        all_comments.forEach((element, i) => {
            if (i == index) {
                element.children = reply
            }
        });
        localStorage.setItem('comments', JSON.stringify(all_comments))
    }

    let getNewComments = (newcomment) => {
        let comment_list = `<li class="comment_list">
        <div class="parent-comment">
            <div class="user_avtar">
                <img
                    src="https://instagram.fdel18-1.fna.fbcdn.net/v/t51.2885-15/e35/95168755_1188313104848732_7163586086101228730_n.jpg?_nc_ht=instagram.fdel18-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=E04Bpx3IeJYAX8m_BP-&oh=3486a37e1f6b0807382ed237660dc258&oe=5EDC7BFF">
            </div>
            <div class="user-comments">
                <h3>Amir Sohel</h3>
                <p>${newcomment.message}</p>
                <a class="reply">Reply</a>
            </div>
        </div>
    </li>`
        comment_wrapper.innerHTML += comment_list
    }
    
    let getAllComments = () => {
        let get_all_comments = JSON.parse(localStorage.getItem('comments'))
        get_all_comments.map((comment, index) => {
            let comment_list = `<li class="comment_list">
        <div class="parent-comment">
            <div class="user_avtar">
                <img
                    src="https://instagram.fdel18-1.fna.fbcdn.net/v/t51.2885-15/e35/95168755_1188313104848732_7163586086101228730_n.jpg?_nc_ht=instagram.fdel18-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=E04Bpx3IeJYAX8m_BP-&oh=3486a37e1f6b0807382ed237660dc258&oe=5EDC7BFF">
            </div>
            <div class="user-comments">
                <h3>Amir Sohel</h3>
                <p>${comment.message}</p>
                <a onclick="reply()" class="reply">Reply</a>
            </div>
        </div>
    </li>`

    comment_wrapper.innerHTML += comment_list
        })
    }
  
    function reply(index){
        console.log(index)
    }


  //adding new reply
    // let comment_parent_area = document.getElementById('comment_list_inner')
    // comment_parent_area.addEventListener('click', (e) => {
    //     if (e.target.classList == 'reply') {
    //         commentCheck = true
    //         comment_box.focus();
    //         let target_index = e.target.id
    //         comment_btn.addEventListener('click', () => {
    //             let message = comment_box.value;
    //             let comment_obj = {
    //                 name: "Ankit",
    //                 src: "http://facebook.com/",
    //                 message: message
    //             }
    //             addReply(comment_obj, target_index);
    //         })
    //     }
    // })

    //adding new comment
    comment_btn.addEventListener('click', () => {
        if (!commentCheck) {
            let message = comment_box.value;
            let comment_obj = {
                name: "Amir Sohel",
                src: "http://google.com/",
                message: message
            }
            comment_box.value = ""
            addComment(comment_obj)
            getNewComments(comment_obj)
        }
    })

    //on load get all comments
    getAllComments()
    // reply()
})