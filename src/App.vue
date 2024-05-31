<template>
  <div>
  <nav class="navbar" x-data>
      <a href="#" class="navbar-logo"><span>Syifani_343</span></a> 
    </nav>
  </div>
  <div class="list-article-container">
    <h2>PERPUSTAKAAN</h2>
    <form @submit.prevent="save" class="form">
      <input type="text" v-model="form.title" placeholder="Title" /> <br />
      <input type="text" v-model="form.img" placeholder="Image (Url)" /> <br />
      <textarea v-model="form.content" placeholder="Content"></textarea> <br />
      <button type="submit" class="save">Save</button>
    </form>
    <ul class="list-article">
      <li v-for="article in articles" :key="article.id" class="article">
        <img :src="article.img" alt="" class="article-img" />
        <div class="article-content">
          <h3>{{ article.title }}</h3>
          <p class="article-text">
            {{
              article.expanded
                ? article.content
                : truncateText(article.content, 10)
            }}
            <span
              v-if="article.content.length > 15"
              @click="toggleReadMore(article)"
              class="read-more"
            >
              {{ article.expanded ? "Read less" : "Read more" }}
            </span>
          </p>
        </div>
        <div class="article-actions">
          <button @click="edit(article)" class="edit">Edit</button>
          <button @click="remove(article.id)" class="delete">Delete</button>
        </div>
      </li>
    </ul>
    <button @click="load" class="load">Load</button>
  </div>
</template>
<script>
import { ref, onMounted, reactive } from "vue";
import axios from "axios";

export default {
  setup() {
    const form = reactive({
      id: null,
      title: "",
      img: "",
      content: "",
    });

    const articles = ref([]);

    async function load() {
      try {
        const response = await axios.get("http://localhost:3000/articles");
        articles.value = response.data.map((article) => ({
          ...article,
          expanded: false,
        }));
      } catch (error) {
        console.error("Error loading articles:", error);
      }
    }

    async function save() {
      try {
        const url = form.id
          ? `http://localhost:3000/articles/${form.id}`
          : "http://localhost:3000/articles";
        const method = form.id ? "put" : "post";
        const response = await axios[method](url, {
          title: form.title,
          img: form.img,
          content: form.content,
        });

        if (form.id) {
          articles.value = articles.value.map((article) =>
            article.id === response.data.id
              ? { ...response.data, expanded: false }
              : article
          );
        } else {
          articles.value.push({ ...response.data, expanded: false });
        }

        form.id = null;
        form.title = "";
        form.img = "";
        form.content = "";
      } catch (error) {
        console.error("Error saving article:", error);
      }
    }

    async function remove(id) {
      try {
        await axios.delete(`http://localhost:3000/articles/${id}`);
        articles.value = articles.value.filter((article) => article.id !== id);
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }

    function edit(article) {
      form.id = article.id;
      form.title = article.title;
      form.img = article.img;
      form.content = article.content;
    }

    function toggleReadMore(article) {
      article.expanded = !article.expanded;
    }

    function truncateText(text, length) {
      return text.length > length ? text.substring(0, length) + "..." : text;
    }

    onMounted(load);

    return {
      form,
      articles,
      save,
      edit,
      remove,
      load,
      toggleReadMore,
      truncateText,
    };
  },
};
</script>
<style scoped>
.list-article-container {
  width: 1000px;
  margin: auto;
  padding: 20px;
  background-color: #917fb3;
  border-radius: 7px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form {
  max-width: 400px;
  display: flex;
  flex-direction: column;
  margin: 0 auto 20px auto;
}

input,
textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  background-color: #fff;
  color: #000;
  box-sizing: border-box;
}

button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.list-article {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 20px;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.article {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: white;
}

.article-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.article-content {
  padding: 15px;
  color: #28a745;
}

.article-text {
  position: relative;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.read-more {
  color: #007bff;
  cursor: pointer;
  display: inline-block;
  margin-left: 5px;
}

.article-actions {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.save {
  background-color: #e5beec;
  font-weight: bold;
  color: white;
}

.load {
  background-color: #628ae7;
  color: white;
  margin-top: 20px;
  display: block;
  width: 100%;
  font-weight: bold;
  text-align: center;
}

.edit {
  background-color: #1580d2;
  color: white;
  font-size: 1rem;
}

.delete {
  background-color: #dc3545;
  color: white;
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.4rem 7%;
  background-color: #755ba5;
  position: fixed;

  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}

.navbar .navbar-logo {
  font-size: 2rem;
  color: #fff;
}

.navbar .navbar-logo span {
  color: #fff;
  font-weight: bold;
}


</style>
