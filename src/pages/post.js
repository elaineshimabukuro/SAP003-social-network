import TextArea from '../components/textarea.js';
import Button from '../components/button.js';
import PostCard from '../components/postcard.js';
import Icons from '../components/icons.js';
import Menu from '../components/menu.js';
import Header from '../components/header.js';

/* eslint-disable no-use-before-define, no-alert, no-plusplus */

function loadPost() {
  firebase.firestore()
    .collection('Posts')
    .orderBy('data', 'desc')
    .onSnapshot(
      (querySnapshot) => {
        const timeline = document.getElementById('list-post');
        timeline.innerHTML = '';
        querySnapshot.forEach((posts) => {
          templatePosts({
            dataId: posts.id,
            like: posts.data().likes,
            name: posts.data().name,
            post: posts.data().post,
            time: posts.data().data.toDate().toLocaleString('pt-BR'),
          });
        });
      },
    );
}

function SharePost() {
  const postText = document.querySelector('.post-textarea').value;
  const codUid = firebase.auth().currentUser.uid;
  const time = firebase.firestore.FieldValue.serverTimestamp();
  const name = firebase.auth().currentUser.displayName;
  firebase
    .firestore()
    .collection('Posts')
    .add({
      name,
      user: codUid,
      data: time,
      likes: 0,
      post: postText,
      comments: [],
    })
    .then((docRef) => {
      firebase.firestore().collection('Posts')
        .doc(docRef.id)
        .update({ dataId: docRef.id });
      document.querySelector('.post-textarea').value = '';
    });
}

function deletePost(event) {
  const idPost = event.target.dataset.id;
  firebase.firestore().collection('Posts').doc(idPost).delete();
  event.target.parentElement.remove();
}

function likePost(event) {
  const idPost = event.target.dataset.id;
  const time = firebase.firestore.FieldValue.serverTimestamp();
  firebase.firestore().collection('Posts').doc(idPost).get()
    .then((foundlikes) => {
      let numLikes = foundlikes.data().likes;
      numLikes++;
      firebase.firestore().collection('Posts').doc(idPost).update({
        likes: numLikes,
        time,
      });
    });
}

function editPost(event) {
  const idPost = event.target.dataset.id;
  const select = document.querySelector(`div[data-id= '${idPost}']`).getElementsByClassName('card-post')[0];
  select.setAttribute('contentEditable', 'true');
  select.focus();
  document.getElementById(idPost).querySelector('.primary-icon-save').style.display = 'inline';
}

function savePost(event) {
  const idPost = event.target.dataset.id;
  const time = firebase.firestore.FieldValue.serverTimestamp();
  const newtext = document.querySelector(`div[data-id= '${idPost}']`).getElementsByClassName('card-post')[0].innerHTML;
  firebase.firestore().collection('Posts').doc(idPost).update(
    {
      post: newtext,
      time,
    },
  );
  document.getElementById(idPost).querySelector('.primary-icon-save').style.display = 'none';
}

function pageProfile() {
  window.location.hash = 'profile';
}

function logOut() {
  firebase.auth().signOut();
}

function templatePosts(props) {
  const timeline = document.getElementById('list-post');
  timeline.innerHTML += `<li id=${props.dataId} class='post-box'> 
    ${Icons({
    dataId: props.dataId,
    class: 'delete',
    title: 'X',
    onClick: deletePost,
  })}
    ${PostCard(props)} 
    ${Icons({
    dataId: props.dataId,
    class: 'like',
    title: `👍 ${props.like}`,
    onClick: likePost,
  })}
    ${Icons({
    dataId: props.dataId,
    class: 'edit',
    title: '📝',
    onClick: editPost,
  })}
    ${Icons({
    dataId: props.dataId,
    class: 'save',
    title: '💾',
    onClick: savePost,
  })}
    </li> `;
  document.getElementById(props.dataId).querySelector('.primary-icon-save').style.display = 'none';
}

function Post() {
  const template = `
  ${Header({ class: 'header-post', classImg: 'logo-post' })}
  <input type="checkbox" id="btn-menu"/>
  <label for="btn-menu">&#9776;</label>
  <nav class="menu">
    <ul>
    ${Menu({
    name: 'Perfil',
    link: pageProfile,
  })}
    ${Menu({
    name: 'Sair',
    link: logOut,
  })}
    </ul> 
  </nav>
  <section class="template-post">
    <div class="user">
      <img class = "avatar" src="./Imagens/avatar.png">
      <div class="user-info">
      <p class = "name-user">
        ${firebase.auth().currentUser.displayName}
      </p>
        <p class='job-user'>
        ${firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
    .get()
    .then((doc) => {
      document.querySelector('.job-user').textContent = doc.data().job;
    })}</p>
      </div>
    </div>
    <div class="box-post">
      <form class="forms-post">
    ${TextArea({
    class: 'post',
    placeholder: 'O que quer compartilhar?',
  })}
        ${Button({
    id: 'btnshare',
    title: 'Compartilhar',
    onClick: SharePost,
  })}
      </form>
      <ul id="list-post"></ul>
    </div>
  </section>
  `;
  loadPost();
  return template;
}

window.post = {
  deletePost,
  editPost,
  savePost,
};

export default Post;
