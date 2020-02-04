import Login from './pages/login.js';
import Register from './pages/register.js';
import Post from './pages/post.js';
import ForgotPassword from './pages/forgot_password.js';
import Profile from './pages/profile.js';

/* eslint-disable no-unused-expressions, no-restricted-globals, */

function routesPage() {
  const main = document.querySelector('main');
  firebase.auth().onAuthStateChanged(((user) => {
    /* const name = user.displayName; */
    switch (window.location.hash) {
      case '#register':
        user ? window.location = '#post' : main.innerHTML = Register();
        break;
      case '#login':
        user ? window.location.hash = '#post' : main.innerHTML = Login();
        break;
      case '#forgot_password':
        user ? window.location = '#post' : main.innerHTML = ForgotPassword();
        break;
      case '#profile':
        user ? main.innerHTML = Profile() : window.location = '#login';
        break;
      case '#post':
        user ? main.innerHTML = Post(name) : window.location = '#login';
        break;
      default:
        window.location = '#login';
    }
  }));
}

window.addEventListener('hashchange', routesPage, false);
window.addEventListener('load', routesPage);
