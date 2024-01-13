// Seleção de elementos
const url = "https://jsonplaceholder.typicode.com/posts";

const loadingEl = document.querySelector("#loading");
const postsContainer = document.querySelector("#posts-container");

const urlSearchParams = new URLSearchParams(window.location.search); // Pega a query string da URL
const postId = urlSearchParams.get("id");

const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comments-container");

const commentForm = document.querySelector("#comment-form");
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body");

// Funções
getAllPosts = async () => {
    const response = await fetch(url); // Faz a requisição e aguarda a resposta

    console.log(response);

    const data = await response.json(); // Transforma a resposta em um objeto 

    console.log(data);

    loadingEl.classList.add("hide");

    data.map((post) => {
        const div = document.createElement("div");
        const title = document.createElement("h2");
        const body = document.createElement("p");
        const link = document.createElement("a");

        title.innerText = post.title;
        body.innerText = post.body;
        link.innerText = "Ler";
        link.setAttribute("href", `/post.html?id=${post.id}`);

        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);

        postsContainer.appendChild(div);
    });
}

getPost = async (id) => {
    const [responsePost, responseComments] = await Promise.all([ // Faz as duas requisições ao mesmo tempo
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ]);

    const dataPost = await responsePost.json();

    const dataComments = await responseComments.json();

    loadingEl.classList.add("hide");
    postPage.classList.remove("hide");

    const title = document.createElement("h1");
    const body = document.createElement("p");

    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    postContainer.appendChild(title);
    postContainer.appendChild(body);

    console.log(dataComments);

    dataComments.map((comment) => { // Percorre o array de comentários e cria um comentário para cada item
        createComment(comment);
    });
}

createComment = (comment) => {
    const div = document.createElement("div");
    const email = document.createElement("h3");
    const commentBody = document.createElement("p");

    email.innerText = comment.email;
    commentBody.innerText = comment.body;

    div.appendChild(email);
    div.appendChild(commentBody);

    commentsContainer.appendChild(div);
}

postComment = async (comment) => {
    const response = await fetch(`${url}/${postId}/comments`, {
        method: "POST", // Método da requisição
        body: comment, // Envia o comentário
        headers: {
            "Content-type": "application/json", // Informa que o conteúdo é um JSON
        },
    });

    const data = await response.json();

    createComment(data);
}

// Chamada de funções e eventos
if(!postId) {
    getAllPosts();
} else {
    getPost(postId);

    // Eventos
    commentForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Previne o comportamento padrão do formulário

        let comment = {
            email: emailInput.value,
            body: bodyInput.value,
        }

        comment = JSON.stringify(comment); // Transforma o objeto em uma string

        postComment(comment);
    });
}