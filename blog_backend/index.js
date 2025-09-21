// importer le module express
const express = require('express');
// importer le module mongoose
const mongoose = require('mongoose');
// importer le module cors
const cors = require('cors');
// importer le module dotenv
require('dotenv').config();
// importer le modèle Post
const Post = require('./models/Post');

// créer une instance de l'application express
const app = express();

// Configurer Express pour analyser les requêtes JSON et URL-encodées
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// UTILISATION DE CORS : Permet aux requêtes provenant d'autres origines (comme ton frontend React) d'accéder à ton API
app.use(cors());

// Connexion à MongoDB : 

const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI)
.then(() => console.log('connecté à MongoDB avec succès'))
.catch(err => console.error('erreur de connexion à MongoDB', err));

// définir le port
const PORT = process.env.PORT || 3000;


// définir la route endpoint basique :
app.get('/', (req, res) => {
    res.status(200).json({message : 'Bienvenue sur l\'API  "Créateur de Publications de Blog."'});
})

// ajooter une publication
app.post('/add_blog', async (req, res) => {
    // récupérer les données
    // Les données du formulaire sont disponibles dans req.body
    const postData = req.body
    console.log('données reçus du formulaire : ', postData);

   try {
        // créer une nouvelle instance de Post
        const newPost = new Post(postData);
        // Enregistrer l'instance dans la base de données.
        await newPost.save();

        res.status(200).send('Post Ajouté avec succès.');
   } catch (error) {
        console.error('Erreur lors de l\'ajout du post : ', error); // coté serveur.
        res.status(400).json({message : 'Erreur lors de l\'ajout du post', détails : error.message});
   }
})


// récupérer toutes les publications
app.get('/posts', async (req, res) => {
    try {
        const allPosts = await Post.find(); // Récupère tous les documents
        res.json(allPosts); // Renvoie les documents en JSON
    }

    catch(error) {
        console.error('Erreur lors de la récupération des données.', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des publications', details: error.message });
    }
})

// récupérer une seule publication par son id

app.get('/getPost/:id', async(req, res) => {
    try {
        const PostId = req.params.id;
        const post = await Post.findById(PostId);

        if(!post) {
            return res.status(404).json({message: 'Publication non trouvée.'})
        }

        res.status(200).json(post);
    }
    catch(error) {
        if(error.name == 'CastError') {
            return res.status(400).json({message: 'Id de publication invalide.', details : error.message});
        }
        console.error('Erreur lors de la récupération du post', error);
        res.status(500).json({message: 'Erreur lors de la récupération des publications', details: error.message});
    }
})

// modifier une publication
// pour la méthode, j'ai pensé à put et à update, mais je ne sais pas la différence
app.put('/posts/:id', async (req, res) => {
    try {
        const PostId = req.params.id; // récupérer l'ID de la publication à modifier
        const newData = req.body; // récupérer les nouvelles données depuis le corps de la requête.

        const updatePost = await Post.findByIdAndUpdate(PostId, newData, 
            {new: true, runValidators: true} // Options: retourner le nouveau document et exécuter les validateurs
            
        );

        if(!updatePost) {
            return res.status(404).json({message: 'Publication non trouvée.'});            
        }

        res.status(200).json({message: 'Publication modifiée avec succès.' , post: updatePost})
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Erreur de validation lors de la modification de la publication.', details: error.message });
        }
        if(error.name == 'CastError') {
            return res.status(400).json({message: 'Id de publication invalide.', details : error.message});
        }
        console.error('Erreur lors de la modification du publication.', error);
        res.status(500).json({message : 'Erreur lors de la modification du publication', details: error.message});
    }
})

app.delete('/posts/:id', async (req, res) => {
    
    try {
        const PostId = req.params.id; // Récupérer l'ID depuis les paramètres de l'URL

        const deletePost = await Post.findByIdAndDelete(PostId); 

        if(!deletePost) {
            return res.status(404).json({message : 'Publication non trouvée.'});
        }


        res.status(200).json({message:"Publication supprimée avec succèes.", post: deletePost})
        
    } catch (error) {
        if(error.name == 'CastError') {
            return res.status(400).json({message: 'Id de publication invalide.', details : error.message});
        }

        console.error('Erreur lors de la suppression du publication.', error);
        res.status(500).json({message: 'Erreur lors de la suppression du publication', details: error.message});
    }


})

// démarer le serveur et le faire écouter sur le port défini
app.listen(PORT, () => {
    console.log(`Serveur démarer avec succès sur le port ${PORT}`);
    console.log(`Accès local : http://localhost:${PORT}`);
});



