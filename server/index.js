import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./database.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

// Tester la connexion MariaDB
app.get("/api/test", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.json({ message: "Connexion MariaDB réussie !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur MariaDB" });
    }
});

// Récupérer toutes les idées
app.get("/api/idees", async (req, res) => {
    try {
        const idees = await pool.query(
            "SELECT * FROM idees ORDER BY date_creation DESC"
        );

        res.json(idees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération" });
    }
});

// Ajouter une idée
app.post("/api/idees", async (req, res) => {
    try {
        const { titre, categorie, contenu } = req.body;

        if (
            typeof titre !== "string" || !titre.trim() ||
            typeof categorie !== "string" || !categorie.trim() ||
            typeof contenu !== "string" || !contenu.trim()
        ) {
            return res.status(400).json({
                error: "Tous les champs sont obligatoires."
            });
        }

        const result = await pool.query(
            `INSERT INTO idees (titre, categorie, contenu)
             VALUES (?, ?, ?)`,
            [titre.trim(), categorie.trim(), contenu.trim()]
        );

        res.status(201).json({
            message: "Idée ajoutée avec succès !",
            id: Number(result.insertId)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'ajout" });
    }
});

// Modifier une idée
app.put("/api/idees/:id", async (req, res) => {
    try {
        const { titre, categorie, contenu } = req.body;
        const { id } = req.params;

        if (
            !Number.isInteger(Number(id)) || Number(id) <= 0 ||
            typeof titre !== "string" || !titre.trim() ||
            typeof categorie !== "string" || !categorie.trim() ||
            typeof contenu !== "string" || !contenu.trim()
        ) {
            return res.status(400).json({
                error: "Données invalides."
            });
        }

        const result = await pool.query(
            `UPDATE idees
             SET titre = ?, categorie = ?, contenu = ?
             WHERE id = ?`,
            [titre.trim(), categorie.trim(), contenu.trim(), id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Idée introuvable." });
        }

        res.json({ message: "Idée modifiée avec succès !" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la modification" });
    }
});

// Supprimer une idée
app.delete("/api/idees/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM idees WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Idée introuvable." });
        }

        res.json({ message: "Idée supprimée avec succès !" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la suppression" });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});