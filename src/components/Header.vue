<template>
  <nav class="navbar navbar-expand-lg navbar-light rounded shadow-lg" id="1">
    <div class="container">
      <Router-Link to="/" class="navbar-brand" aria-current="page"
        ><img src="../assets/logo.png" alt="" width="55" height="50"
      /></Router-Link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="collapse navbar-collapse justify-content-end"
        id="navbarSupportedContent"
      >
        <ul class="navbar-nav">
          <li class="nav-item me-4" v-if="!loginUsuario">
            <Router-Link to="/login" class="nav-link active" aria-current="page"
              >Iniciar Sesión</Router-Link
            >
          </li>
          <li class="nav-item" v-if="!loginUsuario">
            <Router-Link
              to="/sign-up"
              class="nav-link active btn btn-outline-light"
              aria-current="page"
              >Registrarse</Router-Link
            >
          </li>
          <li class="nav-item me-4" v-if="loginUsuario">
            <Router-Link
              to="/dashboard"
              class="nav-link active"
              aria-current="page"
              >Mis Contactos</Router-Link
            >
          </li>
          <li class="nav-item" title="Salir" v-if="loginUsuario">
            <a
              class="salir nav-link active"
              aria-current="page"
              @click="logOut"
            >
              Salir <i class="ms-1 fa-solid fa-right-from-bracket"> </i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { auth } from "../utils/firebase";
export default {
  name: "Header",
  created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.loginUsuario = auth.currentUser.emailVerified;
      } else {
        this.loginUsuario = false;
      }
    });
  },
  data() {
    return {
      loginUsuario: false,
    };
  },
  methods: {
    async logOut() {
      await auth
        .signOut()
        .then(() => {
          this.$router.replace("/");
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
  },
};
</script>

<style scoped>
nav {
  background-color: #f6f6f6;
}
.btn-outline-light {
  color: #f6f6f6 !important;
  background-color: #f9b864;
  border-color: #f6f6f6;
}
.btn-outline-light:hover {
  color: #f9b864 !important;
  background-color: #f6f6f6;
  border-color: #f9b864;
}
.salir {
  cursor: pointer;
}
</style>
