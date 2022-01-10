<template>
  <div>
    <div
      v-if="loading"
      class="spinner-border text-secondary"
      id="spinner"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <div class="container mt-4">
      <router-link
        to="/dashboard"
        class="btn btn-secondary btn-lg rounded-circle"
        width="50px"
      >
        <i class="fa-solid fa-arrow-left"></i>
      </router-link>
      <h2 class="text-center mb-5">Editar Contacto</h2>

      <div class="row">
        <div class="col-md-5">
          <img
            v-if="!$route.params.contacto.foto"
            src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
            class="img-fluid rounded-3"
          />
          <img
            v-if="$route.params.contacto.foto"
            :src="$route.params.contacto.foto"
            class="img-fluid rounded-3"
          />
        </div>
        <div class="col-md-7">
          <form @submit.prevent="updateContacto($route.params.contacto.id)">
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Nombre</label>
              <input
                type="text"
                class="form-control"
                v-model="$route.params.contacto.nombre"
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label"
                >Apellidos</label
              >
              <input
                type="text"
                class="form-control"
                v-model="$route.params.contacto.apellidos"
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label"
                >Teléfono</label
              >
              <input
                type="text"
                class="form-control"
                v-model="$route.params.contacto.telefono"
              />
            </div>
            <div class="mb-5 mt-4">
              <input
                type="file"
                accept="image/*"
                @change="clickFoto($event)"
                class="form-control"
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary col-12 col-md-6 offset-md-6"
            >
              Editar
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db, storage } from "../utils/firebase";
export default {
  name: "Edit",
  props: {
    contacto: Object,
  },
  data() {
    return {
      fotoData: "",
      user: auth.currentUser,
      loading: false,
    };
  },
  methods: {
    async updateContacto(id) {
      this.loading = !false;
      await this.subirFoto();
      await db
        .collection("contactos")
        .doc(id)
        .update({
          nombre: this.contacto.nombre,
          apellidos: this.contacto.apellidos,
          telefono: this.contacto.telefono,
          foto: this.contacto.foto,
        })
        .catch((err) => console.log(err.message));
      this.loading = false;
    },
    clickFoto(e) {
      this.fotoData = e.target.files[0];
      console.log(this.fotoData);
    },
    async subirFoto() {
      //busca el último . que es desde donde parte la extension, esto evita descargar fotos sin extensión por tener el nombre varios puntos
      if (!this.fotoData) {
        return (this.fotoData = ""); //Si la foto viene vacía lo retorna vacío y se sale de la función
      }
      const lastDot = this.fotoData.name.lastIndexOf(".");
      const ext = this.fotoData.name.substring(lastDot + 1);
      const fotoName = Math.random().toString(36).slice(2);

      await storage
        .ref()
        .child(this.user.uid + "/contactos/" + fotoName + "." + ext)
        .put(this.fotoData, { contentType: "img/jpeg" })
        .then(() => console.log("foto subida correctamente"));

      await storage
        .ref()
        .child(this.user.uid + "/contactos/" + fotoName + "." + ext)
        .getDownloadURL()
        .then((url) => (this.contacto.foto = url));
    },
  },
};
</script>

<style scoped>
#spinner {
  margin-left: 50%;
  position: fixed;
  margin-top: 10%;
  z-index: 99;
  width: 150px;
  height: 150px;
}
</style>