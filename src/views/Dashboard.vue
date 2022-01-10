<template >
  <div>
    <div
      v-if="loading"
      class="spinner-border text-secondary"
      id="spinner"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
    <div class="container mt-5 pt-2">
      <div class="justify-content-end col-lg-1 col-3 ms-auto">
        <button
          type="button"
          title="Crear contacto"
          class="btn btn-primary ps-3 pe-3"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
        >
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>

      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Apellidos</th>
            <th scope="col">Teléfono</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contacto in resultado" :key="contacto.id">
            <td>{{ contacto.nombre }}</td>
            <td>{{ contacto.apellidos }}</td>
            <td>{{ contacto.telefono }}</td>
            <td>
              <button
                @click="deleteContacto(contacto.id)"
                class="btn btn-danger me-5"
              >
                Borrar
              </button>
              <router-link
                :to="{ name: 'edit', params: { contacto: contacto } }"
                class="btn btn-warning text-white"
              >
                Ver y Editar
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- CreateUser MODAL  -->
      <div
        class="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog pt-5">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">
                Crear un nuevo contacto
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="close"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="createContacto">
                <div class="mb-4">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nombre"
                    v-model="nombre"
                    required
                  />
                </div>
                <div class="mb-4">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Apellidos"
                    v-model="apellido"
                  />
                </div>
                <div class="mb-4">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Teléfono"
                    v-model="telefono"
                    required
                  />
                </div>
                <div class="mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    @change="clickFoto($event)"
                    class="form-control"
                  />
                </div>
                <button type="submit" class="btn btn-primary w-100 my-3 shadow">
                  Crear contacto
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db, storage } from "../utils/firebase";
export default {
  name: "Dashboard",
  created() {
    this.getContactos();
  },
  data() {
    return {
      user: auth.currentUser,
      resultado: [],
      nombre: "",
      apellido: "",
      telefono: "",
      fotoData: "",
      foto: "",
      mensaje: "",
      loading: false,
    };
  },
  methods: {
    info(id) {
      this.idUpdateContacto = id;
      console.log(this.idUpdateContacto);
    },
    async getContactos() {
      this.loading = !false;
      await db
        .collection("contactos")
        .where("usuarioID", "==", this.user.uid)
        .orderBy("nombre", "asc")
        .get()
        .then((res) => {
          res.forEach((doc) => {
            const data = {
              nombre: doc.data().nombre,
              apellidos: doc.data().apellidos,
              telefono: doc.data().telefono,
              foto: doc.data().foto,
              id: doc.id,
            };
            this.resultado.push(data);
          });
        })
        .catch((err) => console.log(err.message));
      this.loading = false;
    },
    async createContacto() {
      await this.subirFoto();
      await db
        .collection("contactos")
        .add({
          nombre: this.nombre,
          apellidos: this.apellido,
          telefono: this.telefono,
          usuarioID: this.user.uid,
          foto: this.foto,
        })
        .then((res) =>
          this.resultado.push({
            nombre: this.nombre,
            apellidos: this.apellido,
            telefono: this.telefono,
            foto: this.foto,
            id: res.id,
          })
        )
        .then(document.getElementById("close").click())
        .catch((err) => console.log(err.message));

      this.nombre = "";
      this.apellido = "";
      this.telefono = "";
      this.foto = "";
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
        .then((url) => (this.foto = url));
    },
    async deleteContacto(id) {
      await db
        .collection("contactos")
        .doc(id)
        .delete()
        .then(() => {
          this.resultado = this.resultado.filter(
            (contacto) => contacto.id !== id
          );
        })
        .catch((err) => console.log(err.message));
    },
  },
};
</script>

<style scoped>
#spinner {
  margin-left: 46%;
  position: fixed;
  margin-top: 7%;
  z-index: 99;
  width: 70px;
  height: 70px;
}
</style>
