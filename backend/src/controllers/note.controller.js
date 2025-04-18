import Note from "../models/note.model.js";

export const addMovieNote = async (req, res) => {
    try {
        const { movieId, note } = req.body;
        const userId = req.user.id

        if (!userId || !movieId || !note) {
            return res.status(400).json({ error: "Требуется указать ID пользователя, ID фильма и заметку." });
        }

        const existingNote = await Note.findOne({ userId, movieId });

        if (existingNote) {
            return res.status(400).json({ error: "Заметка для этого фильма уже существует." });
        }

        const newNote = new Note({
            userId,
            movieId,
            note
        });

        await newNote.save();
        res.status(201).json({ message: "Заметка успешно добавлена.", note: newNote });
    } catch (error) {
        console.error("Ошибка при добавлении заметки к фильму:", error.message);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

export const deleteMovieNote = async (req, res) => {
    const { id } = req.params;

    try {

        const deletedItem = await Note.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Note list item not found" });
        }

        return res.status(200).json({ message: "Note item deleted successfully" });
    } catch (error) {
        console.error("Error in deleteWatchList | watch list controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const getOneMovieNote = async (req, res) => {
    try {
        const { movieId } = req.params;
        const userId = req.user.id

        if (!userId || !movieId) {
            return res.status(400).json({ error: "Требуется указать ID пользователя ID фильма." });
        }

        const note = await Note.findOne({ userId, movieId });

        if (!note) {
            return res.status(404).json({ error: "Заметка не найдена." });
        }

        res.json(note);
    } catch (error) {
        console.error("Ошибка при получении заметки к фильму:", error.message);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};

export const getMovieNote = async (req, res) => {
    try {
        const userId = req.user.id

        if (!userId) {
            return res.status(400).json({ error: "Требуется указать ID пользователя." });
        }

        const note = await Note.find({ userId });

        if (!note) {
            return res.status(404).json({ error: "Заметка не найдена." });
        }

        res.json(note);
    } catch (error) {
        console.error("Ошибка при получении заметки к фильму:", error.message);
        res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
};
