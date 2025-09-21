const mongoose = require('mongoose');

// Définir le schéma pour les posts

const PostSchema = mongoose.Schema({
    titre : {
        type: String,
        required: true,
        trim: true,
    },
    contenu : {
        type: String,
        required: true,
        trim: true,
    },
    date : {
        type: Date,
        default: Date.now,
    },
    auteur: {
        type: String,
        required: true,
        trim: true,
    }
});

// Créer le modèle à partir du schéma
// 'Post' sera le nom de la collection dans MongoDB (au pluriel : 'posts')
const Post = mongoose.model('Post', PostSchema);

// Exporter le modèle pour qu'il puisse être utilisé ailleurs
module.exports = Post;